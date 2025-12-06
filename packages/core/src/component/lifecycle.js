import { isobject, isequal, isfunction } from '@jeli/helpers';
import { TemplateRef } from '../dom/renderer/templateref';
import { staticInjectionToken } from './injectors';

/**
 * Jeli Component lifeCycle
 * didInit()
 * viewDidLoad()
 * viewDidDestroy()
 * willObserve()
 * didChange()
 */
export class LifeCycle {
    static lifeCycleConst = {
        willObserve: 0,
        didChange: 1,
        didInit: 2,
        viewDidLoad: 3,
        viewDidDestroy: 4,
        AfterViewLoad: 5
    };

    static lifeCycleKeys = Object.keys(LifeCycle.lifeCycleConst);

    static getContext(elementRef){
        if (elementRef.hasContext) {
            return elementRef.context;
        } else {
            return ((isequal(elementRef.parent.type, 8) && !elementRef.isc) ? elementRef : elementRef.parent).context;
        } 
    }

    static hash(a, count) {
        count = count || 0;
        if (a === null || a === undefined) return count;
        else if (typeof a === 'number') count += a;
        else if (typeof a === 'string') count += a.length;
        else if (typeof a === 'boolean') count += a ? 1 : 0;
        else if (typeof a === 'object' && (a.constructor === Object || a.constructor === Array)) {
            for (const prop in a) {
                if (typeof prop === 'number')
                    count += prop;
                else
                    count += prop.length;
                count = hash(a[prop], count);
            }
        } else {
            count += 1;
        }

        return count;
    }

    /**
     * 
     * @param {*} componentInstance 
     * @param {*} elementRef 
     * @param {*} props 
     */
    constructor(componentInstance, elementRef, props) {
        this.componentInstance = componentInstance;
        this.propChanges = null;
        this.registeredProperty = {};
        this.ignoreChecks = [];
        this.always = false;
        this._onDestroy = [];
        this._cycleState = {
            didInit: !!componentInstance.didInit,
            viewDidLoad: !!componentInstance.viewDidLoad,
            viewDidDestroy: !!componentInstance.viewDidDestroy,
            willObserve: !!componentInstance.willObserve,
            didChange: !!componentInstance.didChange,
            afterViewLoad: !!componentInstance.afterViewLoad
        };

        /**
         * assign all props binding from parent to child component
         * lifeCyles to trigger  @willObserve and  @didChange
         */
        this.trigger(LifeCycle.lifeCycleConst.willObserve);
        if (props) this._updateViewBinding(elementRef, props);
        // trigger init
        this.trigger(LifeCycle.lifeCycleConst.didInit);

        /**
         * hook into the component observables
         */
        ObserveUntilDestroyed(elementRef, {
            next: () => {
                if (this.always) this._updateViewBinding(elementRef, props);
                this.trigger(LifeCycle.lifeCycleConst.willObserve);
            },
            done: () => this._cleanUp() 
        });
    }

    onDestroy(callback){
        if(typeof callback == 'function'){
            this._onDestroy.push(callback);
        }
    }

    /**
     * 
     * @param {*} elementRef 
     * @param {*} properties 
     */
    _updateViewBinding(elementRef, properties) {
        let elementProps = elementRef.internal_getDefinition('props');
        const asNative = elementRef.internal_getDefinition('asNative');
        /**
         * 
         * @param {*} type 
         * @param {*} name 
         * @param {*} value 
         */
        function getPrimitiveValue(type, name, value) {
            switch (type) {
                case (staticInjectionToken.TemplateRef):
                    return TemplateRef.factory(elementRef, name);
                case (staticInjectionToken.Function):
                    return elementRef.parent.componentInstance[value];
                default:
                    return value;
            }
        }
        
        for (const prop in properties) {
            if (this.ignoreChecks.includes(prop)) continue;
            const item = properties[prop];
            const name = item.value || prop;
            let value;
            if (asNative) {
                this.setValue(prop, elementRef.getProps(prop));
                continue;
            }

            if (elementProps && elementProps.hasOwnProperty(name)){
                const context = LifeCycle.getContext(elementRef);
                try {
                    const propValue = elementProps[name];
                    if (isobject(propValue)) {
                        if (propValue.prop){
                            this.always = true;
                            value = getFilteredTemplateValue(propValue, context, elementRef.parent.componentInstance);
                        } else if (propValue.type == 'raw'){
                            // ignore checking when value is raw
                            value = propValue.value;
                            this.ignoreChecks.push(prop);
                        }
                    } else {
                        value = getPrimitiveValue(item.type, name, propValue);
                        this.ignoreChecks.push(prop);
                    }
                    this.setValue(prop, value);
                } catch (e) { console.error(e); }
            } else if (elementRef.hasAttribute(name)) {
                this.ignoreChecks.push(prop);
                this.setValue(prop, elementRef.attr[name]);
            }
        }

        if (this.propChanges) {
            this.trigger(LifeCycle.lifeCycleConst.didChange, this.propChanges);
            this.propChanges = null;
        }
    }

    /**
     * 
     * @param {*} property 
     * @param {*} value 
     */
    setValue(property, value) {
        const hasProp = this.registeredProperty.hasOwnProperty(property);
        const sameValue = isequal(this.componentInstance[property], value);
        if (hasProp && sameValue) return;

        if (this.propChanges === null) {
            this.propChanges = {};
        }
        /**
         * register the property to lookup object
         */
        this.registeredProperty[property] = true;
        this.propChanges[property] = value;
        this.componentInstance[property] = value;
    }

    /**
     *
     * @param {*} cycle
     * @returns
     */
    has(cycle) {
        return this._cycleState[cycle] && isfunction(this.componentInstance[cycle]);
    }

    /**
     *
     * @param {*} cycle
     * @param {*} args
     */
    trigger(cycle, args) {
        const cycleId = LifeCycle.lifeCycleKeys[cycle];
        if (this.has(cycleId)) {
            this.componentInstance[cycleId](args);
        }
    }

    _cleanUp(){
        this.trigger(LifeCycle.lifeCycleConst.viewDidDestroy);
        while(this._onDestroy.length){
            // trigger the handler
            this._onDestroy.shift()();
        }

        this.registeredProperty = null;
        this.ignoreChecks.length = 0;
        this.componentInstance = null;
        this.propChanges = null;
    }
}