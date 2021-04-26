import { EngineScript } from '@/modules/engine/core/engine.script';

export class EngineAction extends EngineScript {
  children = [];
  style = {
    icon: 'el-icon-check',
    plain: true,
    shape: 'plain',
    size: 'small',
    type: 'plain'
  };
  label;
  loading = false;
  parent;

  constructor(settings = {}) {
    super(settings);
    if (settings.style) {
      Object.assign(this.style, settings.style);
    }
    Object.assign(this, settings); // <--- webpack pushing default initialization here, re-invoking parent method again
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

