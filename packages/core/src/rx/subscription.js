import { isobject, isfunction } from "js-helpers/helpers";

/**
 * 
 * @param {*} replayOnSubscription 
 */
export function Subscription(replayOnSubscription) {
    var subscriptions = [];
    var state = {
        pending: false,
        value: null,
        resolveWith: ''
    };

    /**
     * 
     * @param {*} success 
     * @param {*} error 
     * @param {*} completed 
     */
    this.add = function(success, error, completed) {
        if (isobject(success)) {
            subscriptions.push(success);
        } else {
            subscriptions.push({
                onSuccess: success,
                onError: error,
                onCompleted: completed
            });
        }

        if (replayOnSubscription) {

        }

        return this;
    };

    /**
     * 
     * @param {*} type 
     * @param {*} args 
     */
    this.notify = function(type, args) {
        if (state.resolveWith === 'completed') {
            return;
        }

        subscriptions.forEach(function(subscription) {
            if (subscription[type] && isfunction(subscription[type])) {
                subscription[type](args);
            }
        });

        state.pending = subscriptions.length < 1;
        state.resolveWith = type;
        state.value = args;
    };

    this.destroy = function() {
        subscriptions.length = 0;
        state = null;
    };
}