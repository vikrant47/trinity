export class EngineObservable {
  constructor() {
    this.events = {};
  }

  emit(eventName, ...args) {
    const _this = this;
    if (this.events[eventName]) {
      this.events[eventName].forEach((callbaack) => {
        callbaack.apply(_this, args);
      });
    }
    return this;
  }

  on(eventNames, callback) {
    if (!Array.isArray(eventNames)) {
      eventNames = [eventNames];
    }
    eventNames.forEach((eventName) => {
      if (!this.events[eventName]) {
        this.events[eventName] = [];
      }
      this.events[eventName].push(callback);
    });
    return this;
  }

  destroy() {
    for (const event in this.events) {
      delete this.events[event];
    }
  }
}

export class AsyncEventObservable extends EngineObservable {
  emit(eventName, ...args) {
    const _this = this;
    if (this.events[eventName]) {
      return Promise.all(this.events[eventName].map((callbaack) => {
        return new Promise((resolve, reject) => {
          try {
            resolve(callbaack.apply(_this, args));
          } catch (e) {
            reject(e);
          }
        });
      }));
    }
    return this;
  }
}
