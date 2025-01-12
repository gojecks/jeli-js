import { Subscription, SubscriptionStates } from "./subscription"

export class rxTimeout {
  constructor() {
    this.subscription = new Subscription(false);
    this.play = function (timer) {
      this.timerId = nativeTimeout(() => this.subscription.notify(SubscriptionStates.onSuccess), timer || 100);
      return this;
    };
  }
  subscribe(callback, onDestroy) {
    this.subscription.add(callback, onDestroy);
    return this;
  }
  stop() {
    clearTimeout(this.timerId);
  }
  clearTimeout(destroy) {
    this.stop();
    if (destroy) {
      this.subscription.destroy();
    }
  }
}

/**
 * Rx interval, alternative for native setInterval
 */
export class rxInterval {
  constructor() {
    this.subscription = new Subscription(false);
    this.intervalId = null;
    this.play = function (interval) {
      this.intervalId = nativeInterval(() => this.subscription.notify(SubscriptionStates.onSuccess), interval || 100);
      return this;
    };
  }
  subscribe(callback, onDestroy) {
    this.subscription.add(callback, onDestroy);
    return this;
  }
  stop() {
    clearInterval(this.intervalId);
  }
  clearInterval(destroy) {
    this.stop();
    if (destroy) {
      this.subscription.destroy();
    }
  }
}