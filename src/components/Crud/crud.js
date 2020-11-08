import { initData, download } from '@/api/data';
import { parseTime, downloadFile } from '@/utils/index';
import Vue from 'vue';
import { ModelService } from '@/modules/engine/services/model.service';
import { RestQuery } from '@/modules/engine/services/rest.query';
import { ListService } from '@/modules/list/services/list.service';

/**
 * CRUD configuration
 * @author moxun
 * @param {*} options <br>
 * @return crud instance.
 * @example
 * To use multi-crud, please use crud-tag to mark the components associated with the crud, such as: <job Form :job-status="dict.job_status" crud-tag="job" />
 */
function CRUD(options) {
  const defaultOptions = {
    // model name
    modelAlias: '',
    list: 'default',
    tag: 'default',
    // id field name
    idField: 'id',
    // title
    title: '',
    // Request data url
    url: '',
    // Tabular data
    data: [],
    // Options
    selections: [],
    // Object to be queried
    query: {},
    // Query data parameters
    params: {},
    // Form Form
    form: {},
    // Reset form
    defaultForm: () => {
    },
    // Sorting rules, default id Descending order, Support multi-field sorting ['id,desc', 'createTime,asc']
    sort: ['id,desc'],
    // waiting time
    time: 50,
    // CRUD Method
    crudMethod: {
      add: (form) => {
      },
      del: (id) => {
      },
      edit: (form) => {
      },
      get: (id) => {
      }
    },
    // Which buttons are displayed on the homepage action bar
    optShow: {
      add: true,
      edit: true,
      del: true,
      download: true,
      reset: true
    },
    // Customize some extended attributes
    props: {},
    // Prepare on the homepage
    queryOnPresenterCreated: true,
    // Debug switch
    debug: false
  };
  options = mergeOptions(defaultOptions, options);
  const data = {
    ...options,
    // Record data status
    dataStatus: {},
    status: {
      add: CRUD.STATUS.NORMAL,
      edit: CRUD.STATUS.NORMAL,
      // Add or edit status
      get cu() {
        if (this.add === CRUD.STATUS.NORMAL && this.edit === CRUD.STATUS.NORMAL) {
          return CRUD.STATUS.NORMAL;
        } else if (this.add === CRUD.STATUS.PREPARED || this.edit === CRUD.STATUS.PREPARED) {
          return CRUD.STATUS.PREPARED;
        } else if (this.add === CRUD.STATUS.PROCESSING || this.edit === CRUD.STATUS.PROCESSING) {
          return CRUD.STATUS.PROCESSING;
        }
        throw new Error('wrong crud\'s cu status');
      },
      // title
      get title() {
        return this.add > CRUD.STATUS.NORMAL ? `Add ${crud.title}` : this.edit > CRUD.STATUS.NORMAL ? `Edit ${crud.title}` : crud.title;
      }
    },
    msg: {
      submit: 'Submitted successfully',
      add: 'Added successfully',
      edit: 'Edit successfully',
      del: 'successfully deleted'
    },
    page: {
      // page number
      page: 0,
      // Number of data per page
      limit: 15,
      // Total number of data
      total: 0
    },
    order: {
      attribute: 'updated_at',
      direction: 'DESC'
    },
    definition: { list: {}, form: {}},
    // Overall loading
    loading: false,
    // Exported Loading
    downloadLoading: false,
    // Deleted Loading
    delAllLoading: false
  };
  const methods = {
    /**
     * General tips
     */
    submitSuccessNotify() {
      crud.notify(crud.msg.submit, CRUD.NOTIFICATION_TYPE.SUCCESS);
    },
    addSuccessNotify() {
      crud.notify(crud.msg.add, CRUD.NOTIFICATION_TYPE.SUCCESS);
    },
    editSuccessNotify() {
      crud.notify(crud.msg.edit, CRUD.NOTIFICATION_TYPE.SUCCESS);
    },
    delSuccessNotify() {
      crud.notify(crud.msg.del, CRUD.NOTIFICATION_TYPE.SUCCESS);
    },
    // search
    toQuery() {
      crud.page.page = 1;
      crud.refresh();
    },
    loadDefinition() {
      if (!callVmHook(crud, CRUD.HOOK.beforeLoadDefinition)) {
        return;
      }
      return new Promise((resolve, reject) => {
        crud.loading = true;
        // request data
        new ModelService(crud.modelAlias).requestDefinition({
          list: crud.list
        }).then(definition => {
          crud.definition = new ListService(definition).sanitizeDefinition();
          // time Show table in milliseconds
          setTimeout(() => {
            crud.loading = false;
            callVmHook(crud, CRUD.HOOK.afterLoadDefinition);
          }, crud.time);
          resolve(data);
        }).catch(err => {
          crud.loading = false;
          reject(err);
        });
      });
    },
    // Refresh
    refresh() {
      if (!callVmHook(crud, CRUD.HOOK.beforeRefresh)) {
        return;
      }
      return new Promise((resolve, reject) => {
        crud.loading = true;
        // request data
        new RestQuery(this.modelAlias).paginate({
          page: crud.page.page,
          limit: crud.page.limit,
          order: [{ attribute: crud.order.attribute, direction: crud.order.direction }]
        }).then(result => {
          const table = crud.getTable();
          if (table && table.lazy) { // Lazy load child node data, clear the loaded data
            table.store.states.treeData = {};
            table.store.states.lazyTreeNodeMap = {};
          }
          crud.page.total = result.total;
          crud.data = result.data;
          crud.resetDataStatus();
          // time Show table in milliseconds
          setTimeout(() => {
            crud.loading = false;
            callVmHook(crud, CRUD.HOOK.afterRefresh);
          }, crud.time);
          resolve(result);
        }).catch(err => {
          crud.loading = false;
          reject(err);
        });
      });
    },
    /**
     * Start adding
     */
    toAdd() {
      crud.resetForm();
      if (!(callVmHook(crud, CRUD.HOOK.beforeToAdd, crud.form) && callVmHook(crud, CRUD.HOOK.beforeToCU, crud.form))) {
        return;
      }
      crud.status.add = CRUD.STATUS.PREPARED;
      callVmHook(crud, CRUD.HOOK.afterToAdd, crud.form);
      callVmHook(crud, CRUD.HOOK.afterToCU, crud.form);
    },
    /**
     * start editing
     * @param {*} data 数据项
     */
    toEdit(data) {
      crud.resetForm(JSON.parse(JSON.stringify(data)));
      if (!(callVmHook(crud, CRUD.HOOK.beforeToEdit, crud.form) && callVmHook(crud, CRUD.HOOK.beforeToCU, crud.form))) {
        return;
      }
      crud.status.edit = CRUD.STATUS.PREPARED;
      crud.getDataStatus(crud.getDataId(data)).edit = CRUD.STATUS.PREPARED;
      callVmHook(crud, CRUD.HOOK.afterToEdit, crud.form);
      callVmHook(crud, CRUD.HOOK.afterToCU, crud.form);
    },
    /**
     * Start delete
     * @param {*} data data item
     */
    toDelete(data) {
      crud.getDataStatus(crud.getDataId(data)).delete = CRUD.STATUS.PREPARED;
    },
    /**
     * Undelete
     * @param {*} data data item
     */
    cancelDelete(data) {
      if (!callVmHook(crud, CRUD.HOOK.beforeDeleteCancel, data)) {
        return;
      }
      crud.getDataStatus(crud.getDataId(data)).delete = CRUD.STATUS.NORMAL;
      callVmHook(crud, CRUD.HOOK.afterDeleteCancel, data);
    },
    /**
     * Cancel add/edit
     */
    cancelCU() {
      const addStatus = crud.status.add;
      const editStatus = crud.status.edit;
      if (addStatus === CRUD.STATUS.PREPARED) {
        if (!callVmHook(crud, CRUD.HOOK.beforeAddCancel, crud.form)) {
          return;
        }
        crud.status.add = CRUD.STATUS.NORMAL;
      }
      if (editStatus === CRUD.STATUS.PREPARED) {
        if (!callVmHook(crud, CRUD.HOOK.beforeEditCancel, crud.form)) {
          return;
        }
        crud.status.edit = CRUD.STATUS.NORMAL;
        crud.getDataStatus(crud.getDataId(crud.form)).edit = CRUD.STATUS.NORMAL;
      }
      crud.resetForm();
      if (addStatus === CRUD.STATUS.PREPARED) {
        callVmHook(crud, CRUD.HOOK.afterAddCancel, crud.form);
      }
      if (editStatus === CRUD.STATUS.PREPARED) {
        callVmHook(crud, CRUD.HOOK.afterEditCancel, crud.form);
      }
      // Clear form validation
      if (crud.findVM('form').$refs['form']) {
        crud.findVM('form').$refs['form'].clearValidate();
      }
    },
    /**
     * Submit new/edit
     */
    submitCU() {
      if (!callVmHook(crud, CRUD.HOOK.beforeValidateCU)) {
        return;
      }
      crud.findVM('form').$refs['form'].validate(valid => {
        if (!valid) {
          return;
        }
        if (!callVmHook(crud, CRUD.HOOK.afterValidateCU)) {
          return;
        }
        if (crud.status.add === CRUD.STATUS.PREPARED) {
          crud.doAdd();
        } else if (crud.status.edit === CRUD.STATUS.PREPARED) {
          crud.doEdit();
        }
      });
    },
    /**
     * Perform add
     */
    doAdd() {
      if (!callVmHook(crud, CRUD.HOOK.beforeSubmit)) {
        return;
      }
      crud.status.add = CRUD.STATUS.PROCESSING;
      crud.crudMethod.add(crud.form).then(() => {
        crud.status.add = CRUD.STATUS.NORMAL;
        crud.resetForm();
        crud.addSuccessNotify();
        callVmHook(crud, CRUD.HOOK.afterSubmit);
        crud.toQuery();
      }).catch(() => {
        crud.status.add = CRUD.STATUS.PREPARED;
        callVmHook(crud, CRUD.HOOK.afterAddError);
      });
    },
    /**
     * Executive edit
     */
    doEdit() {
      if (!callVmHook(crud, CRUD.HOOK.beforeSubmit)) {
        return;
      }
      crud.status.edit = CRUD.STATUS.PROCESSING;
      crud.crudMethod.edit(crud.form).then(() => {
        crud.status.edit = CRUD.STATUS.NORMAL;
        crud.getDataStatus(crud.getDataId(crud.form)).edit = CRUD.STATUS.NORMAL;
        crud.editSuccessNotify();
        crud.resetForm();
        callVmHook(crud, CRUD.HOOK.afterSubmit);
        crud.refresh();
      }).catch(() => {
        crud.status.edit = CRUD.STATUS.PREPARED;
        callVmHook(crud, CRUD.HOOK.afterEditError);
      });
    },
    /**
     * Execute delete
     * @param {*} data data item
     */
    doDelete(data) {
      let delAll = false;
      let dataStatus;
      const ids = [];
      if (data instanceof Array) {
        delAll = true;
        data.forEach(val => {
          ids.push(this.getDataId(val));
        });
      } else {
        ids.push(this.getDataId(data));
        dataStatus = crud.getDataStatus(this.getDataId(data));
      }
      if (!callVmHook(crud, CRUD.HOOK.beforeDelete, data)) {
        return;
      }
      if (!delAll) {
        dataStatus.delete = CRUD.STATUS.PROCESSING;
      }
      return crud.crudMethod.del(ids).then(() => {
        if (delAll) {
          crud.delAllLoading = false;
        } else {
          dataStatus.delete = CRUD.STATUS.PREPARED;
        }
        crud.dleChangePage(1);
        crud.delSuccessNotify();
        callVmHook(crud, CRUD.HOOK.afterDelete, data);
        crud.refresh();
      }).catch(() => {
        if (delAll) {
          crud.delAllLoading = false;
        } else {
          dataStatus.delete = CRUD.STATUS.PREPARED;
        }
      });
    },
    /**
     * Universal export
     */
    doExport() {
      crud.downloadLoading = true;
      download(crud.url + '/download', crud.getQueryParams()).then(result => {
        downloadFile(result, crud.title + '数据', 'xlsx');
        crud.downloadLoading = false;
      }).catch(() => {
        crud.downloadLoading = false;
      });
    },
    /**
     * Get query parameters
     */
    getQueryParams: function() {
      // Clear the case where the parameter has no value
      Object.keys(crud.query).length !== 0 && Object.keys(crud.query).forEach(item => {
        if (crud.query[item] === null || crud.query[item] === '') crud.query[item] = undefined;
      });
      Object.keys(crud.params).length !== 0 && Object.keys(crud.params).forEach(item => {
        if (crud.params[item] === null || crud.params[item] === '') crud.params[item] = undefined;
      });
      return {
        page: crud.page.page - 1,
        limit: crud.page.limit,
        order: crud.order,
        ...crud.query,
        ...crud.params
      };
    },
    // Current page change
    pageChangeHandler(e) {
      crud.page.page = e;
      crud.refresh();
    },
    // Change the number of items per page
    sizeChangeHandler(e) {
      crud.page.limit = e;
      crud.page.page = 1;
      crud.refresh();
    },
    // Change the order order
    sortHandler(e) {
      crud.order = { direction: e.order === 'ascending' ? 'ASC' : 'DESC', attribute: e.prop };
      return crud.refresh();
    },
    // Prevent the request for no data due to the wrong page number when deleting the last data on the second page, or when multiple selections are made to delete the data on the second page
    dleChangePage(size) {
      if (crud.data.length === size && crud.page.page !== 1) {
        crud.page.page -= 1;
      }
    },
    // Choice change
    selectionChangeHandler(val) {
      crud.selections = val;
    },
    /**
     * Reset query parameters
     * @param {Boolean} toQuery Query operation after reset
     */
    resetQuery(toQuery = true) {
      const defaultQuery = JSON.parse(JSON.stringify(crud.defaultQuery));
      const query = crud.query;
      Object.keys(query).forEach(key => {
        query[key] = defaultQuery[key];
      });
      // Reset parameters
      this.params = {};
      if (toQuery) {
        crud.toQuery();
      }
    },
    /**
     * Reset form
     * @param {Array} data Digital
     */
    resetForm(data) {
      const form = data || (typeof crud.defaultForm === 'object' ? JSON.parse(JSON.stringify(crud.defaultForm)) : crud.defaultForm.apply(crud.findVM('form')));
      const crudFrom = crud.form;
      for (const key in form) {
        if (crudFrom.hasOwnProperty(key)) {
          crudFrom[key] = form[key];
        } else {
          Vue.set(crudFrom, key, form[key]);
        }
      }
    },
    /**
     * Reset data status
     */
    resetDataStatus() {
      const dataStatus = {};

      function resetStatus(datas) {
        datas.forEach(e => {
          dataStatus[crud.getDataId(e)] = {
            delete: 0,
            edit: 0
          };
          if (e.children) {
            resetStatus(e.children);
          }
        });
      }

      resetStatus(crud.data);
      crud.dataStatus = dataStatus;
    },
    /**
     * 获取数据状态
     * @param {Number | String} id 数据项id
     */
    getDataStatus(id) {
      return crud.dataStatus[id];
    },
    /**
     * 用于树形表格多选, 选中所有
     * @param selection
     */
    selectAllChange(selection) {
      // 如果选中的数目与请求到的数目相同就选中子节点，否则就清空选中
      if (selection && selection.length === crud.data.length) {
        selection.forEach(val => {
          crud.selectChange(selection, val);
        });
      } else {
        crud.getTable().clearSelection();
      }
    },
    /**
     * 用于树形表格多选，单选的封装
     * @param selection
     * @param row
     */
    selectChange(selection, row) {
      // 如果selection中存在row代表是选中，否则是取消选中
      if (selection.find(val => {
        return crud.getDataId(val) === crud.getDataId(row);
      })) {
        if (row.children) {
          row.children.forEach(val => {
            crud.getTable().toggleRowSelection(val, true);
            selection.push(val);
            if (val.children) {
              crud.selectChange(selection, val);
            }
          });
        }
      } else {
        crud.toggleRowSelection(selection, row);
      }
    },
    /**
     * 切换选中状态
     * @param selection
     * @param data
     */
    toggleRowSelection(selection, data) {
      if (data.children) {
        data.children.forEach(val => {
          crud.getTable().toggleRowSelection(val, false);
          if (val.children) {
            crud.toggleRowSelection(selection, val);
          }
        });
      }
    },
    findVM(type) {
      return crud.vms.find(vm => vm && vm.type === type).vm;
    },
    notify(title, type = CRUD.NOTIFICATION_TYPE.INFO) {
      crud.vms[0].vm.$notify({
        title,
        type,
        duration: 2500
      });
    },
    updateProp(name, value) {
      Vue.set(crud.props, name, value);
    },
    getDataId(data) {
      return data[this.idField];
    },
    getTable() {
      return this.findVM('presenter').$refs.table;
    },
    attchTable() {
      const table = this.getTable();
      this.updateProp('table', table);
      const that = this;
      table.$on('expand-change', (row, expanded) => {
        if (!expanded) {
          return;
        }
        const lazyTreeNodeMap = table.store.states.lazyTreeNodeMap;
        row.children = lazyTreeNodeMap[crud.getDataId(row)];
        if (row.children) {
          row.children.forEach(ele => {
            const id = crud.getDataId(ele);
            if (that.dataStatus[id] === undefined) {
              that.dataStatus[id] = {
                delete: 0,
                edit: 0
              };
            }
          });
        }
      });
    }
  };
  const crud = Object.assign({}, data);
  // Observability
  Vue.observable(crud);
  // Additional method
  Object.assign(crud, methods);
  // Record the initial default query parameters and use them when resetting the query later
  Object.assign(crud, {
    defaultQuery: JSON.parse(JSON.stringify(data.query)),
    // Reserve 4-bit storage: components Homepage, header, pagination, form, debugging view is also easy to find
    vms: Array(4),
    /**
     * Registered component instance
     * @param {String} type Type
     * @param {*} vm Component instance
     * @param {Number} index This parameter is used internally
     */
    registerVM(type, vm, index = -1) {
      const vmObj = {
        type,
        vm: vm
      };
      if (index < 0) {
        this.vms.push(vmObj);
        return;
      }
      if (index < 4) { // Built-in reserved VM number
        this.vms[index] = vmObj;
        return;
      }
      this.vms.length = Math.max(this.vms.length, index);
      this.vms.splice(index, 1, vmObj);
    },
    /**
     * Unregister component instance
     * @param {*} vm Component instance
     */
    unregisterVM(type, vm) {
      for (let i = this.vms.length - 1; i >= 0; i--) {
        if (this.vms[i] === undefined) {
          continue;
        }
        if (this.vms[i].type === type && this.vms[i].vm === vm) {
          if (i < 4) { // Built-in reserved VM number
            this.vms[i] = undefined;
          } else {
            this.vms.splice(i, 1);
          }
          break;
        }
      }
    }
  });
  // Freeze processing, if you need to expand the data, use crud.update Prop(name, value), accessed in the form of crud.props.name, this is responsive and can be used for data binding
  Object.freeze(crud);
  return crud;
}

// hook VM
function callVmHook(crud, hook) {
  if (crud.debug) {
    console.log('callVmHook: ' + hook);
  }
  const tagHook = crud.tag ? hook + '$' + crud.tag : null;
  let ret = true;
  const nargs = [crud];
  for (let i = 2; i < arguments.length; ++i) {
    nargs.push(arguments[i]);
  }
  // Some components play multiple roles and need to be de-duplicated when calling hooks
  const vmSet = new Set();
  crud.vms.forEach(vm => vm && vmSet.add(vm.vm));
  vmSet.forEach(vm => {
    if (vm[hook]) {
      ret = vm[hook].apply(vm, nargs) !== false && ret;
    }
    if (tagHook && vm[tagHook]) {
      ret = vm[tagHook].apply(vm, nargs) !== false && ret;
    }
  });
  return ret;
}

function mergeOptions(src, opts) {
  const optsRet = {
    ...src
  };
  for (const key in src) {
    if (opts.hasOwnProperty(key)) {
      optsRet[key] = opts[key];
    }
  }
  return optsRet;
}

/**
 * Find crud
 * @param {*} vm
 * @param {string} tag
 */
function lookupCrud(vm, tag) {
  tag = tag || vm.$attrs['crud-tag'] || 'default';
  // function lookupCrud(vm, tag) {
  if (vm.$crud) {
    const ret = vm.$crud[tag];
    if (ret) {
      return ret;
    }
  }
  return vm.$parent ? lookupCrud(vm.$parent, tag) : undefined;
}

/**
 * crud homepage
 */
function presenter(crud) {
  if (crud) {
    console.warn('[CRUD warn]: ' + 'please use $options.cruds() { return CRUD(...) or [CRUD(...), ...] }');
  }
  return {
    data() {
      // Returning crud in data is to associate crud with the current instance, and the component observes changes in crud-related attributes
      return {
        crud: this.crud
      };
    },
    beforeCreate() {
      this.$crud = this.$crud || {};
      let cruds = this.$options.cruds instanceof Function ? this.$options.cruds() : crud;
      if (!(cruds instanceof Array)) {
        cruds = [cruds];
      }
      cruds.forEach(ele => {
        if (this.$crud[ele.tag]) {
          console.error('[CRUD error]: ' + 'crud with tag [' + ele.tag + ' is already exist');
        }
        this.$crud[ele.tag] = ele;
        ele.registerVM('presenter', this, 0);
      });
      this.crud = this.$crud['defalut'] || cruds[0];
    },
    methods: {
      parseTime
    },
    created() {
      for (const k in this.$crud) {
        if (this.$crud[k].queryOnPresenterCreated) {
          this.$crud[k].toQuery();
        }
      }
    },
    destroyed() {
      for (const k in this.$crud) {
        this.$crud[k].unregisterVM('presenter', this);
      }
    },
    mounted() {
      // If the table is not instantiated (for example, v-if is used), please refresh the table information in the crud.attch Table at an appropriate time later
      if (this.$refs.table !== undefined) {
        this.crud.attchTable();
      }
    }
  };
}

/**
 * Head
 */
function header() {
  return {
    data() {
      return {
        crud: this.crud,
        query: this.crud.query
      };
    },
    beforeCreate() {
      this.crud = lookupCrud(this);
      this.crud.registerVM('header', this, 1);
    },
    destroyed() {
      this.crud.unregisterVM('header', this);
    }
  };
}

/**
 * Definition
 */
function definition() {
  return {
    data() {
      // Returning crud in data is to associate crud with the current instance, and the component observes changes in crud-related attributes
      return {
        crud: this.crud
      };
    },
    beforeCreate() {
      this.$crud = this.$crud || {};
      let cruds = this.$options.cruds instanceof Function ? this.$options.cruds() : crud;
      if (!(cruds instanceof Array)) {
        cruds = [cruds];
      }
      cruds.forEach(ele => {
        ele.registerVM('definition', this, 5);
      });
      this.crud = this.$crud['defalut'] || cruds[0];
    },
    created() {
      for (const k in this.$crud) {
        if (this.$crud[k].queryOnPresenterCreated) {
          this.$crud[k].modelAlias = this.$route.params.modelAlias;
          this.$crud[k].list = this.$route.meta.list || 'default';
          this.$crud[k].loadDefinition().then((definition) => {
            this.definition = definition;
          });
        }
      }
    },
    destroyed() {
      for (const k in this.$crud) {
        this.$crud[k].unregisterVM('definition', this);
      }
    },
    mounted() {
      // If the table is not instantiated (for example, v-if is used), please refresh the table information in the crud.attch Table at an appropriate time later
      if (this.$refs.table !== undefined) {
        this.crud.attchTable();
      }
    }
  };
}

/**
 * Pagination
 */
function pagination() {
  return {
    data() {
      return {
        crud: this.crud,
        page: this.crud.page
      };
    },
    beforeCreate() {
      this.crud = lookupCrud(this);
      this.crud.registerVM('pagination', this, 2);
    },
    destroyed() {
      this.crud.unregisterVM('pagination', this);
    }
  };
}

/**
 * Form
 */
function form(defaultForm) {
  return {
    data() {
      return {
        crud: this.crud,
        form: this.crud.form
      };
    },
    beforeCreate() {
      this.crud = lookupCrud(this);
      this.crud.registerVM('form', this, 3);
    },
    created() {
      this.crud.defaultForm = defaultForm;
      this.crud.resetForm();
    },
    destroyed() {
      this.crud.unregisterVM('form', this);
    }
  };
}

/**
 * crud
 */
function crud(options = {}) {
  const defaultOptions = {
    type: undefined
  };
  options = mergeOptions(defaultOptions, options);
  return {
    data() {
      return {
        crud: this.crud
      };
    },
    beforeCreate() {
      this.crud = lookupCrud(this);
      this.crud.registerVM(options.type, this);
    },
    destroyed() {
      this.crud.unregisterVM(options.type, this);
    }
  };
}

/**
 * CRUD hook
 */
CRUD.HOOK = {
  afterLoadDefinition: 'afterLoadDefinition',
  beforeLoadDefinition: 'beforeLoadDefinition',
  /** 刷新 - 之前 */
  beforeRefresh: 'beforeCrudRefresh',
  /** 刷新 - 之后 */
  afterRefresh: 'afterCrudRefresh',
  /** 删除 - 之前 */
  beforeDelete: 'beforeCrudDelete',
  /** 删除 - 之后 */
  afterDelete: 'afterCrudDelete',
  /** 删除取消 - 之前 */
  beforeDeleteCancel: 'beforeCrudDeleteCancel',
  /** 删除取消 - 之后 */
  afterDeleteCancel: 'afterCrudDeleteCancel',
  /** 新建 - 之前 */
  beforeToAdd: 'beforeCrudToAdd',
  /** 新建 - 之后 */
  afterToAdd: 'afterCrudToAdd',
  /** 编辑 - 之前 */
  beforeToEdit: 'beforeCrudToEdit',
  /** 编辑 - 之后 */
  afterToEdit: 'afterCrudToEdit',
  /** 开始 "新建/编辑" - 之前 */
  beforeToCU: 'beforeCrudToCU',
  /** 开始 "新建/编辑" - 之后 */
  afterToCU: 'afterCrudToCU',
  /** "新建/编辑" 验证 - 之前 */
  beforeValidateCU: 'beforeCrudValidateCU',
  /** "新建/编辑" 验证 - 之后 */
  afterValidateCU: 'afterCrudValidateCU',
  /** 添加取消 - 之前 */
  beforeAddCancel: 'beforeCrudAddCancel',
  /** 添加取消 - 之后 */
  afterAddCancel: 'afterCrudAddCancel',
  /** 编辑取消 - 之前 */
  beforeEditCancel: 'beforeCrudEditCancel',
  /** 编辑取消 - 之后 */
  afterEditCancel: 'afterCrudEditCancel',
  /** 提交 - 之前 */
  beforeSubmit: 'beforeCrudSubmitCU',
  /** 提交 - 之后 */
  afterSubmit: 'afterCrudSubmitCU',
  afterAddError: 'afterCrudAddError',
  afterEditError: 'afterCrudEditError'
};

/**
 * CRUD状态
 */
CRUD.STATUS = {
  NORMAL: 0,
  PREPARED: 1,
  PROCESSING: 2
};

/**
 * CRUD通知类型
 */
CRUD.NOTIFICATION_TYPE = {
  SUCCESS: 'success',
  WARNING: 'warning',
  INFO: 'info',
  ERROR: 'error'
};

export default CRUD;

export {
  presenter,
  header,
  form,
  pagination,
  crud,
  definition
};
