import { TenantService } from '@/modules/engine/services/tenant.service';

export class ModelService {
  modelAlias;
  tenantService;

  constructor(modelName) {
    this.tenantService = TenantService.getInstance();
    this.modelAlias = modelName;
  }

  requestDefinition(options = {}) {
    return this.tenantService.request({
      url: '/api/engine/models/' + this.modelAlias + '/definition',
      params: {
        list: options.list,
        formId: options.formId
      }
    });
  }

  paginate() {

  }
}
