export class ContextBuilder {
  static DEFAULT_CONTEXT = {};

  static buildContext(context = {}) {
    return Object.assign({}, context, this.DEFAULT_CONTEXT);
  }
}
