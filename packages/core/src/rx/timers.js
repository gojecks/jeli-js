import { Subscription, SubscriptionStates } from "./subscription"

export function rxTimeout(){
  this.subscription = new Subscription(false);
  this.play = function(timer){
    this.timerId = nativeTimeout(()=>this.subscription.notify(SubscriptionStates.onSuccess), timer||100);
    return this;
  };
}

rxTimeout.prototype.subscribe = function(callback, onDestroy){
  this.subscription.add(callback, onDestroy);
  return this;
};

rxTimeout.prototype.stop = function(){
  clearTimeout(this.timerId);
}

rxTimeout.prototype.clearTimeout = function(destroy){
  this.stop();
  if (destroy){
    this.subscription.destroy();
  }
}

/**
 * Rx interval, alternative for native setInterval
 */
export function rxInterval(){
  this.subscription = new Subscription(false);
  this.intervalId = null;
  this.play = function(interval){
    this.intervalId = nativeInterval(()=>this.subscription.notify(SubscriptionStates.onSuccess), interval || 100);
    return this;
  };
}

rxInterval.prototype.subscribe = function(callback, onDestroy){
  this.subscription.add(callback, onDestroy);
  return this;
};

rxInterval.prototype.stop = function(){
  clearInterval(this.intervalId);
}

rxInterval.prototype.clearInterval = function(destroy){
  this.stop();
  if (destroy){
    this.subscription.destroy();
  }
}