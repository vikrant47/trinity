export class ListEventHandler {
  vm;

  constructor(vm) {
    this.vm = vm;
  }

  selectionChangeHandler() {

  }

  handleCurrentChange() {

  }

  sortHandler(e) {
    const listService = this.vm.listService;
    listService.order = { direction: e.order === 'ascending' ? 'ASC' : 'DESC', attribute: e.prop };
    return listService.refresh();
  }
}
