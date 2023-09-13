import { ComponentFactoryResolver, DOMHelper } from '@jeli/core';
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
            // _intentCache[intentName] = _intent;
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
                // componentRef.class.add('view-intent');
                this.intentContainer.children.add(componentRef);
                // this.transitIntent(intentName, intentConfig.transition || 50);
            });
        } else {
            this.transitIntent(intentName, 50);
        }
    };
}

ViewIntentService.prototype.closeIntent = function() {
    var allIntents = [];
    // get net intent
    var current = this._currentIntent;
    this._currentOpenIntent.forEach(function(intent, key) {
        intent.element && intent.element.nativeElement.removeAttribute('style');
        if ((current === key)) {
            DOMHelper.remove(intent.element);
        } else {
            allIntents.push(key);
        }
    });

    this._currentOpenIntent.delete(current);
    this._currentIntent = allIntents.pop();
    if (this._currentIntent) {
        this.transitIntent(this._currentIntent, 70);
    }
};

ViewIntentService.prototype.destroyAllIntent = function() {
    // get all intent keys
    this._currentOpenIntent.forEach(function(intentView) {
        DOMHelper.remove(intentView.element);
    });
    this._currentIntent = undefined;
    this._currentOpenIntent.clear();
};

ViewIntentService.prototype.animate = function(elementRef, style, timer) {
    var start = null;

    function step(timestamp) {
        if (!start) start = timestamp;
        var progress = timestamp - start;
        if (progress < timer) {
            window.requestAnimationFrame(step);
        } else {
            elementRef.style(style);
        }
    }

    if (!elementRef) { return; }
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
        this.animate(intentView.element, {
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