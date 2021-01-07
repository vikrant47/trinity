export class EngineScript {
  id = new Date().getTime();
  name;
  alias;
  script;
  compiledScript;

  constructor(settings = {}) {
    Object.assign(this, settings);
  }

  static compile(script) {
    return new Function(`
    "use strict";
    return ${script}
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
    return Object.assign({ self: self }, context, defaultContext);
  }

  compile() {
    this.compiledScript = EngineScript.compile(this.script);
    return this;
  }

  execute(event, context = {}) {
    if (!this.compiledScript) {
      this.compile();
    }
    context = EngineScript.buildContext(context, this);
    if (typeof this.compiledScript === 'function') {
      return this.compiledScript(event, context);
    } else if (typeof this.compiledScript === 'object' && this.compiledScript.handler) {
      return this.compiledScript.handler(event, context);
    }
    throw new Error('Invalid script no handler found ', this.compiledScript);
  }
}
