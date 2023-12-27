import { ComponentFactoryResolver, DOMHelper, ElementStyle, EventEmitter } from '@jeli/core';
Service({
    name: 'viewIntent'
})

/**
 * 
 * @param {*} ComponentResolver 
 */
export function ViewIntentService() {
    this._currentOpenIntent = new Map();
    this.intentContainer = null;
    this._currentIntent = "";
    this.onCloseEvent = new EventEmitter();
}

/**
 * 
 * @param {*} intentName 
 * @param {*} params 
 * @returns 
 */
ViewIntentService.prototype.openIntent = function(intentName, params) {
    if ((this._currentIntent === intentName)) {
        return;
    }

    var intentConfig = $intentCollection[intentName];
    if (intentConfig) {
        if (!this._currentOpenIntent.has(intentName)) {
            // set out intent to cache
            // set the current intent name
            this._currentIntent = intentName;
            this._currentOpenIntent.set(intentName, {
                element: null,
                route: {
                    name: intentName,
                    params: params,
                    data: intentConfig.data
                }
            });

            ComponentFactoryResolver(intentConfig.component, this.intentContainer, componentRef => {
                var config = this._currentOpenIntent.get(intentName);
                config.element = componentRef;
                componentRef.nativeElement.classList.add('view-intent');
                this.intentContainer.nativeElement.appendChild(componentRef.nativeElement);
                this.intentContainer.children.add(componentRef);
                this.transitIntent(intentName, intentConfig.transition || 50);
            }, true);
        } else {
            this.transitIntent(intentName, 50);
        }
    };
}

ViewIntentService.prototype.closeIntent = function(data) {
    var allIntents = [];
    // get net intent
    this._currentOpenIntent.forEach((intent, key) => {
        intent.element && intent.element.nativeElement.removeAttribute('style');
        if ((this._currentIntent === key)) {
            DOMHelper.remove(intent.element, true);
        } else {
            allIntents.push(key);
        }
    });

    var previous = this._currentIntent;
    this._currentOpenIntent.delete(this._currentIntent);
    this._currentIntent = allIntents.pop();
    if (this._currentIntent) {
        this.transitIntent(this._currentIntent, 70);
    }

    this.onCloseEvent.emit({
        intent: previous,
        current: this._currentIntent,
        data
    })
};

ViewIntentService.prototype.destroyAllIntent = function() {
    // get all intent keys
    this._currentOpenIntent.forEach(function(intentView) {
        DOMHelper.remove(intentView.element);
    });
    this._currentIntent = undefined;
    this._currentOpenIntent.clear();
};

ViewIntentService.prototype.animate = function(element, style, timer) {
    var start = null;
    function step(timestamp) {
        if (!start) start = timestamp;
        var progress = timestamp - start;
        if (progress < timer) {
            window.requestAnimationFrame(step);
        } else {
            ElementStyle(element, style);
        }
    }

    if (!element) { return; }
    window.requestAnimationFrame(step);
}


ViewIntentService.prototype.removeIntent = function(intentName) {
    this._currentOpenIntent.remove(intentName);
};

ViewIntentService.prototype.transitIntent = function(intentName, timer) {
    var intentView = this._currentOpenIntent.get(intentName);
    if (intentView) {
        this._currentIntent = intentName;
        this.hideAllIntent();
        this.animate(intentView.element.nativeElement, {
            transform: 'translateX(0%)'
        }, timer || 100);
    }
};

/**
 * static methods
 */
ViewIntentService.prototype.getIntentView = function(intentName) {
    return this._currentOpenIntent.get(intentName);
};

ViewIntentService.prototype.hideAllIntent = function(removeIntent) {
    this._currentOpenIntent.forEach(function(intentView) {
        intentView.element && intentView.element.nativeElement.removeAttribute('style');
    });
};

ViewIntentService.prototype.getCurrentIntent = function() {
    return (this.getIntentView(this._currentIntent) || {}).route;
};