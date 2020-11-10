import EngineBak from '@/modules/engine/core/engine.bak';

const Reference = EngineBak.instance.define('engine.component.Reference', {
  static: {
    getConfig: function(association) {
      return {
        ajax: {
          transport: _.debounce(function(params, success, failure) {
            if (params.data.q) {
              const nameFrom = association.nameFrom || 'name';
              const otherKey = association.otherKey || 'id';
              new engine.data.RestQuery(association[0] || association.model).findAll({
                attributes: [nameFrom, otherKey],
                limit: 20,
                where: params.data.q ? {
                  '$and': [
                    {
                      [nameFrom]: {
                        '$regex': params.data.q
                      }
                    }
                  ]
                } : {}
              }).then(function(data) {
                success({
                  results: data.map(function(record) {
                    return {
                      id: record[otherKey],
                      text: record[nameFrom]
                    };
                  })
                });
              });
            }
          }, 1000)
        },
        dropdownCssClass: 'filter-select2'
      };
    }
  },
  constructor: function(el, association) {
    if (!el) {
      el = $('<select/>').get(0);
    }
    this.$el = $(el);
    this.$el.data('engine.component.Reference', this);
    this.$el.data('engine.component', this);
    this.association = association;
  },
  build: function() {
    const _this = this;
    const association = this.association;
    this.$el.select2(ReferenceComponent.getConfig(association));
  }
});
export default Reference;
