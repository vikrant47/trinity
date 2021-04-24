import { TenantService } from '@/modules/engine/services/tenant.service';
import { RestQuery } from '@/modules/engine/services/rest.query';
import * as _ from 'lodash';
import { Pagination } from '@/modules/list/models/pagination';
import { Engine } from '@/modules/engine/core/engine';

export class EngineFile {
  selected = false;
  constructor(file) {
    Object.assign(this, file);
  }
  isImage(file) {
    return this.content_type.indexOf('image') > -1;
  }
  getUrl() {
    return Engine.getMediaServerUrl(this.path);
  }
}

export class EngineFileService {
  static APIS = {
    upload: '/engine/file/upload'
  };

  static getApiUrl(api) {
    return '/api' + TenantService.getInstance().getBaseTenantUrl() + api;
  }

  /** This will return the upload url*/
  static getUploadUrl() {
    return this.getApiUrl(this.APIS.upload);
  }

  loading = false;
  files = [];
  pagination;

  constructor(pagination = null) {
    this.pagination = pagination || new Pagination();
  }

  async init(rootFolderId) {
    this.loading = true;
    try {
      this.rootFolder = await this.getFile(rootFolderId);
    } finally {
      this.loading = false;
    }
  }
  async getFile(fileId) {
    const result = await new RestQuery('engine_system_files').findById(fileId);
    return result.contents;
  }
  async listFiles(query = {}) {
    this.loading = true;
    try {
      return await new RestQuery('engine_system_files').findAll({
        where: {
          parent_folder_id: this.rootFolder.id
        }
      });
    } finally {
      this.loading = false;
    }
  }

  async refresh(query = {}) {
    let condition = {
      parent_folder_id: this.rootFolder.id
    };
    if (!_.isEmpty(query)) {
      condition = {
        '$and': [
          condition,
          query
        ]
      };
    }
    this.loading = true;
    try {
      const response = await new RestQuery('engine_system_files').paginate({
        where: condition,
        page: this.pagination.page,
        limit: this.pagination.limit,
        order: [{
          field: 'name',
          direction: 'asc'
        }]
      });
      this.files = response.contents.data.map((file) => {
        return new EngineFile(file);
      });
      this.pagination.total = response.contents.total;
      return response;
    } finally {
      this.loading = false;
    }
  }

  navigate(rootFolder) {
    this.rootFolder = rootFolder;
    return this.refresh();
  }

  getSelected() {
    return this.files.filter(f => f.selected);
  }
}
