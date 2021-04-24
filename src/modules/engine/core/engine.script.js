import store from '@/store';

export class EngineScript {
  id = new Date().getTime();
  name;
  alias;
  script;
  compiled;

  constructor(settings = {}) {
    Object.assign(this, settings);
  }

  static compile(script) {
    return new Function(`
    "use strict";
    return ${script.trim()}
    `)();
  }

  static emptyThrowableScript() {
    return new EngineScript({ script: `()=>{throw new Error('Script not defined');}` });
  }

  static emptyScript() {
    return new EngineScript({ script: `()=>{}` });
  }

  static buildContext(context = {}, self) {
    const defaultContext = require('@/modules/engine/context/index').default;
    return Object.assign({ self: self }, context, store.state.user, defaultContext);
  }

  compile() {
    this.script = EngineScript.compile(this.script);
    this.compiled = true;
    return this;
  }

  execute(event, context = {}) {
    if (!this.compiled) {
      this.compile();
    }
    context = EngineScript.buildContext(context, this);
    if (typeof this.script === 'function') {
      return this.script(event, context);
    } else if (typeof this.script === 'object' && this.script.handler) {
      return this.script.handler(event, context);
    }
    throw new Error('Invalid script no handler found ', this.script);
  }
}
