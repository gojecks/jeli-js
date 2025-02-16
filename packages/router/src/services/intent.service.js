import { 
    ComponentFactoryResolver, 
    DOMHelper, 
    AttributeAppender, 
    EventEmitter,
    EventManager 
} from '@jeli/core';
import { INTENT_EVENT_ENUMS } from './utils';

Service({
    name: 'viewIntent'
})
/**
 *
 * @param {*} ComponentResolver
 */
export class ViewIntentService {
    constructor() {
        this._currentOpenIntent = new Map();
        this.intentContainer = null;
        this._currentIntent = "";
        this.onCloseEvent = new EventEmitter();
        /**
         * create an Event
         * Add Default Function to our listener
         * if slave function calls preventDefault
         * Master FN is not triggered
         */
        this.events = new EventManager((e, intentConfig, params) => {
            if (INTENT_EVENT_ENUMS.RENDER === e.type) {
                 // set out intent to cache
                // set the current intent name
                var name = intentConfig.name;
                this._previousIntent = this._currentIntent;
                this._currentIntent = name;
                this._currentOpenIntent.set(name, {
                    element: null,
                    transitionTimer: intentConfig.transition || 0,
                    route: {
                        name,
                        params,
                        data: intentConfig.data || null
                    }
                });

                ComponentFactoryResolver(intentConfig.component, this.intentContainer, componentRef => {
                    var config = this._currentOpenIntent.get(name);
                    config.element = componentRef;
                    componentRef.nativeElement.classList.add('view-intent');
                    this.intentContainer.nativeElement.appendChild(componentRef.nativeElement);
                    // attach attributes if defined
                    if (intentConfig.data && intentConfig.data.attrs){
                        AttributeAppender.set(componentRef.nativeElement, intentConfig.data.attrs);
                    }

                    this.intentContainer.children.add(componentRef);
                    this.transitIntent(name);
                    this.events.dispatch(INTENT_EVENT_ENUMS.SUCCESS, {name, params})
                }, true);
            }
        });
    }
    /**
     *
     * @param {*} intentName
     * @param {*} params
     * @returns
     */
    openIntent(intentName, params) {
        if ((this._currentIntent === intentName)) return;
        var intentConfig = $intentCollection[intentName];
        if (intentConfig) {
            if (!this._currentOpenIntent.has(intentName))
               this.events.dispatch(INTENT_EVENT_ENUMS.RENDER, intentConfig, params);
            else
                this.transitIntent(intentName);
        } else
            this.events.dispatch(INTENT_EVENT_ENUMS.NOTFOUND, {
                name: intentName, 
                current: this._currentIntent
            });
    }
    
    closeIntent(data) {
        var allIntents = [];
        // get net intent
        this._currentOpenIntent.forEach((intent, key) => {
            intent.element && intent.element.nativeElement.removeAttribute('style');
            if ((this._currentIntent === key))
                DOMHelper.remove(intent.element, true);
            else
                allIntents.push(key);
        });

        var previous = this._currentIntent;
        this._currentOpenIntent.delete(this._currentIntent);
        this._currentIntent = allIntents.pop();
        if (this._currentIntent)
            this.transitIntent(this._currentIntent);

        this.onCloseEvent.emit({
            intent: previous,
            current: this._currentIntent,
            data
        });
    }
    destroyAllIntent() {
        // get all intent keys
        this._currentOpenIntent.forEach(function (intentView) {
            DOMHelper.remove(intentView.element);
        });
        this._currentIntent = undefined;
        this._currentOpenIntent.clear();
    }

    animate(element, style, timer) {
        var start = null;
        function step(timestamp) {
            if (!start) start = timestamp;
            var progress = timestamp - start;
            if (progress < timer) {
                window.requestAnimationFrame(step);
            } else {
                AttributeAppender.set(element, {style});
            }
        }

        if (!element) { return; }
        window.requestAnimationFrame(step);
    }
    removeIntent(intentName) {
        this._currentOpenIntent.remove(intentName);
    }
    transitIntent(intentName) {
        var intentView = this._currentOpenIntent.get(intentName);
        if (intentView) {
            this._currentIntent = intentName;
            this.hideAllIntent();
            this.animate(intentView.element.nativeElement, {
                transform: 'translateX(0%)'
            }, intentView.transitionTimer || 1);
        }
    }
    /**
     * static methods
     */
    getIntentView(intentName) {
        return this._currentOpenIntent.get(intentName);
    }
    hideAllIntent() {
        this._currentOpenIntent.forEach((intentView) => {
            if (intentView.element){
                intentView.element.nativeElement.removeAttribute('style');
            }
        });
    }
    getCurrentIntent() {
        return (this.getIntentView(this._currentIntent) || {}).route;
    }

    getParams(){
        var currentIntentRoute = this.getCurrentIntent();
        return currentIntentRoute && currentIntentRoute.params;
    }
}
