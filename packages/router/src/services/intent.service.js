import { ComponentFactoryResolver, DOMHelper } from '@jeli/core';
import { WebStateProvider } from './jwebstate.provider';
Service({
    name: 'viewIntent',
    DI: [WebStateProvider, ComponentFactoryResolver]
})

/**
 * 
 * @param {*} webStateProvider 
 * @param {*} ComponentResolver 
 */
export function ViewIntentService(webStateProvider, componentResolver) {
    this._currentOpenIntent = new Map();
    this.intentContainer = null;
    this.$currentIntent = "";
    /**
     * Open an intent
     */
    this.openIntent = function(intentName, params) {
        if ((this.$currentIntent === intentName)) {
            return;
        }

        var intentConfig = webStateProvider.getIntent(intentName);
        if (intentConfig) {
            if (!this._currentOpenIntent.has(intentName)) {
                // set out intent to cache
                // _intentCache[intentName] = _intent;
                // set the current intent name
                var _this = this;
                this.$currentIntent = intentName;
                this._currentOpenIntent.set(intentName, {
                    element: null,
                    route: {
                        name: intentName,
                        params: params,
                        data: intentConfig.data
                    }
                });

                componentResolver(intentConfig.view.component, this.intentContainer, function(elementRef) {
                    DOMHelper.insertAfter(elementRef, elementRef.nativeElement, _this.intentContainer.nativeElement);
                    var config = _this._currentOpenIntent.get(intentName);
                    config.element = elementRef;
                    elementRef.class.add('view-intent');
                    _this.transitIntent(intentName, intentConfig.transition || 50);
                }, false);
            } else {
                this.transitIntent(intentName, 50);
            }
        };
    }
}

ViewIntentService.prototype.closeIntent = function() {
    var allIntents = [];
    // get net intent
    var current = this.$currentIntent;
    this._currentOpenIntent.forEach(function(intent, key) {
        intent.element && intent.element.nativeElement.removeAttribute('style');
        if ((current === key)) {
            DOMHelper.remove(intent.element);
        } else {
            allIntents.push(key);
        }
    });

    this._currentOpenIntent.delete(current);
    this.$currentIntent = allIntents.pop();
    if (this.$currentIntent) {
        this.transitIntent(this.$currentIntent, 70);
    }
};

ViewIntentService.prototype.$destroyAllIntent = function() {
    // get all intent keys
    this._currentOpenIntent.forEach(function(intentView) {
        DOMHelper.remove(intentView.element);
    });
    this.$currentIntent = undefined;
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
        this.$currentIntent = intentName;
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
    return (this.getIntentView(this.$currentIntent) || {}).route;
};