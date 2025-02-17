import { isobject, isfunction } from "@jeli/helpers";

export var SubscriptionStates = {
    onError: 0,
    onSuccess: 1,
    onCompleted:  2
};

var statedIDs = Object.keys(SubscriptionStates);

/**
 * 
 * @param {*} replayOnSubscription 
 */
/**
 *
 * @param {*} replayOnSubscription
 */
export class Subscription {
    constructor(replayOnSubscription) {
        this.subscriptions = [];
        this.state = {
            pending: false,
            value: null,
            resolveWith: -1
        };
    }
    /**
     *
     * @param {*} success
     * @param {*} error
     * @param {*} completed
     */
    add(success, error, completed) {
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
    }
    /**
     *
     * @param {*} type
     * @param {*} args
     */
    notify(state, args) {
        if (!this.state || this.state.resolveWith === SubscriptionStates.onCompleted) {
            return;
        }

        var stateId = statedIDs[state];
        for (var subscription of this.subscriptions) {
            var callback = subscription[stateId];
            if (callback && isfunction(callback)) {
                callback(args);
            }
        }

        this.state.pending = this.subscriptions.length < 1;
        this.state.resolveWith = state;
        this.state.value = args;
    }
    destroy() {
        this.subscriptions.length = 0;
        this.state = null;
    }
}



