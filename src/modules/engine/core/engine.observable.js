export class EngineObservable {
  constructor() {
    this.events = {};
    this.waitPromises = {};
  }

  emit(eventName, ...args) {
    this.resolveWaiters(eventName, args);
    this.triggerCallbacks(eventName, args);
    return this;
  }

  resolveWaiters(eventName, ...args) {
    if (this.waitPromises[eventName]) {
      this.waitPromises[eventName].forEach((promise) => {
        promise.resolve(args);
      });
    }
  }

  triggerCallbacks(eventName, ...args) {
    if (this.events[eventName]) {
      this.events[eventName].forEach((callback) => {
        callback.apply(this, args);
      });
    }
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

  waitFor(eventName) {
    if (!this.waitPromises[eventName]) {
      this.waitPromises[eventName] = [];
    }
    return new Promise((resolve, reject) => {
      this.waitPromises[eventName].push({ resolve, reject });
    });
  }

  destroy() {
    for (const event in this.events) {
      delete this.events[event];
    }
  }
}

export class AsyncEventObservable extends EngineObservable {
  async emit(eventName, ...args) {
    this.resolveWaiters(eventName, args);
    await this.triggerCallbacks(eventName, args);
    return this;
  }

  async triggerCallbacks(eventName, ...args) {
    if (this.events[eventName]) {
      await Promise.all(this.events[eventName].map(async(callback) => {
        try {
          await callback.apply(this, args);
        } catch (e) {
          throw e;
        }
      }));
    }
  }
}
