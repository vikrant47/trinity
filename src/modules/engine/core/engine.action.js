import { EngineScript } from '@/modules/engine/core/engine.script';

export class EngineAction extends EngineScript {
  type = 'default';
  children = [];
  icon = 'el-icon-check';
  label;
  plain = true;
  loading = false;
  shape = 'plain';
  size = 'small';
  parent;

  constructor(settings = {}) {
    super(settings);
    Object.assign(this, settings); // <--- webpack pushing default initialization here, re-invoking parent method again
    if (this.type.indexOf('plain') > -1) {
      this.type = this.type.replaceAll('plain', '');
      this.plain = true;
    }
  }

  showLoader() {
    this.loading = true;
    return this;
  }

  hideLoader() {
    this.loading = false;
    return this;
  }
}

