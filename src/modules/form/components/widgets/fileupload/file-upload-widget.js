import { BaseWidget } from '@/modules/form/components/widgets/base-widget/base-widget';
import { EngineFileService } from '@/modules/engine/services/engine.file.service';

export default class FileUploadWidget extends BaseWidget {
  fileList = [];
  palletSettings = {
    label: 'File Upload',
    icon: 'upload'
  };

  /** *handlers**/
  handlePreview() {
  }

  handleRemove() {
  }

  beforeRemove() {
  }

  handleExceed() {
  }

  overrideWidgetSettings(widgetSettings) {
    return Object.assign({
      multiple: false,
      fileList: []
    }, widgetSettings);
  }

  buildTemplate(h) {
    return (<el-upload
      class='upload-demo'
      action={EngineFileService.getUploadUrl()}
      onPreview={this.handlePreview}
      onRemove={this.handleRemove}
      beforeRemove={this.beforeRemove}
      multiple={this.widgetSettings.multiple}
      limit={this.widgetSettings.limit}
      onExceed={this.handleExceed}
      fileList={this.fileList}>
      <el-button size='small' type='primary'>Upload</el-button>
      <div slot='tip' class='el-upload__tip'>{this.widgetSettings.title}</div>
    </el-upload>);
  }

  componentRender(component, h) {
    return this.buildTemplate(h);
  }
}
