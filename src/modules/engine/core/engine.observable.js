import Engine from './engine';

const EngineObservable = Engine.instance.define('engine.EngineObservable', {
    constructor: function () {
        this.events = {};
    },
    emit: function (eventName, ...args) {
        const _this = this;
        if (this.events[eventName]) {
            this.events[eventName].forEach(function (callbaack) {
                callbaack.apply(_this, args);
            });
        }
        return this;
    },
    on: function (eventName, callback) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
        return this;
    }
});
export default EngineObservable;
