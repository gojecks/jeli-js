import { isobject, isfunction } from "js-helpers/helpers";

/**
 * 
 * @param {*} replayOnSubscription 
 */
export function Subscription(replayOnSubscription) {
    this.subscriptions = [];
    this.state = {
        pending: false,
        value: null,
        resolveWith: ''
    };
}

/**
 * 
 * @param {*} success 
 * @param {*} error 
 * @param {*} completed 
 */
Subscription.prototype.add = function(success, error, completed) {
    if (isobject(success)) {
        this.subscriptions.push(success);
    } else {
        this.subscriptions.push({
            onSuccess: success,
            onError: error,
            onCompleted: completed
        });
    }

    return this;
};

/**
 * 
 * @param {*} type 
 * @param {*} args 
 */
Subscription.prototype.notify = function(type, args) {
    if (!this.state || this.state.resolveWith === 'completed') {
        return;
    }

    this.subscriptions.forEach(function(subscription) {
        if (subscription[type] && isfunction(subscription[type])) {
            subscription[type](args);
        }
    });

    this.state.pending = this.subscriptions.length < 1;
    this.state.resolveWith = type;
    this.state.value = args;
};

Subscription.prototype.destroy = function() {
    this.subscriptions.length = 0;
    this.state = null;
};