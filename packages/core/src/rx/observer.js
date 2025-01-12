/**
 * @class Observer
 */
export class Observer {
    constructor() {
        this.$notifyInProgress = 0;
        this.bindingIdx = 0;
        this.retry = false;
        this._entries = new Map();
    }
    /**
     *
     * @param {*} callback
     */
    subscribe(callback) {
        var self = this, bindingIdx = this.bindingIdx++;
        this.retry = true;
        this._entries.set(bindingIdx, {
            handler: callback,
            state: false
        });

        return function () {
            self._entries.delete(bindingIdx);
        };
    }
    /**
     *
     * @param {*} key
     * @param {*} fn
     * @param {*} core
     */
    observeForKey(key, callback, core) {
        var index = 0;
        var self = this;
        var keyObserver;
        if (!this._entries.has(key)) {
            this._entries.push(key, {
                watchKey: key,
                handler: [callback],
                core: core,
                state: false
            });
        } else {
            keyObserver = this.get(key);
            index = keyObserver.length;
            keyObserver.handler.push(fn);
        }

        return function () {
            if (!index) {
                self._entries.delete(key);
            } else {
                keyObserver.handler.splice(index, 1);
            }
        };
    }
    /**
     * @param {*} model
     * @param {*} ignoreCheck
     */
    notifyAllObservers(model, ignoreCheck) {
        if (this.$notifyInProgress) {
            this.retry = true;
            return;
        }
        this.$notifyInProgress = true;
        this._entries.forEach(function (subscription) {
            rxNotify(subscription, model, ignoreCheck);
        });

        if (this.retry) {
            // trigger notification again
            this.retry = false;
            this.notifyAllObservers(model);
        }
        this.$notifyInProgress = false;
    }
    destroy() {
        this._entries.clear();
        this.notifyAllObservers = 0;
        this.retry = false;
    }
}




