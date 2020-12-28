export class EngineScript {
  id;
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

  static buildContext(context = {}) {
    const defaultContext = require('@/modules/engine/context/index').default;
    return Object.assign(context, defaultContext);
  }

  compile() {
    this.compiledScript = EngineScript.compile(this.script);
    return this;
  }

  execute(event, context = {}) {
    if (!this.compiledScript) {
      this.compile();
    }
    context = EngineScript.buildContext(context);
    if (typeof this.compiledScript === 'function') {
      return this.compiledScript(event, context);
    } else if (typeof this.compiledScript === 'object' && this.compiledScript.handler) {
      return this.compiledScript.call(this.compiledScript, event, context);
    }
    throw new Error('Invalid script no handler found ', this.compiledScript);
  }
}
