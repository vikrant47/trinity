import { TenantService } from '@/modules/engine/services/tenant.service';
import { RestQuery } from '@/modules/engine/services/rest.query';

export class EngineFileService {
  static APIS = {
    upload: '/engine/file/upload'
  };

  static getApiUrl(api) {
    return '/api' + TenantService.getInstance().getBaseTenantUrl() + this.APIS[api];
  }

  /** This will return the upload url*/
  static getUploadUrl() {
    return this.getApiUrl(this.APIS.upload);
  }

  rootFolder;

  constructor(rootFolder) {
    this.rootFolder = rootFolder;
  }

  async listFiles() {
    return await new RestQuery('engine_system_files').findAll({
      where: {
        parent_folder_id: this.rootFolder
      }
    });
  }
}
