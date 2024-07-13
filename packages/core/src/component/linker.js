import { isobject, isequal } from '@jeli/helpers';
import { TemplateRef } from '../dom/renderer/templateref';
import { staticInjectionToken } from './injectors';
import { LifeCycleConst } from './lifecycle';
/**
 * assign all props binding from parent to child component 
 * lifeCyles to trigger  @willObserve and  @didChange
 * @param {*} componentInstance 
 * @param {*} elementRef 
 * @param {*} lifeCycle 
 * @param {*} ctors
 */
export function elementInputLinker(componentInstance, elementRef, lifeCycle, ctors) {
    lifeCycle.trigger(LifeCycleConst.willObserve);
    var propChanges = null;
    var registeredProperty = {};
    var ignoreChecks = [];
    var always = false;
    var elementProps = elementRef.internal_getDefinition('props');
    var asNative = elementRef.internal_getDefinition('asNative');
    if (ctors.props)
        always = _updateViewBinding();

    function getContext(){
        if (elementRef.hasContext) {
            return elementRef.context;
        } else {
            return ((isequal(elementRef.parent.type, 8) && !elementRef.isc) ? elementRef : elementRef.parent).context;
        } 
    }

    function _updateViewBinding() {
        var hasBinding = false;
        for (var prop in ctors.props) {
            if (ignoreChecks.includes(prop)) continue;
            var item = ctors.props[prop];
            var name = item.value || prop;
            var value;
            if (asNative) {
                setValue(prop, elementRef.getProps(prop));
                continue;
            }

            if (elementProps && elementProps.hasOwnProperty(name)){
                var context = getContext();
                try {
                    if (isobject(elementProps[name])) {
                        hasBinding = true;
                        value = getFilteredTemplateValue(elementProps[name], context, elementRef.parent.componentInstance);
                    } else {
                        value = getPrimitiveValue(item.type, name, elementProps[name]);
                        ignoreChecks.push(prop);
                    }
                    setValue(prop, value);
                } catch (e) { console.error(e); }
            } else if (elementRef.hasAttribute(name)) {
                ignoreChecks.push(prop);
                setValue(prop, elementRef.attr[name]);
            }
        }

        if (propChanges) {
            lifeCycle.trigger(LifeCycleConst.didChange, propChanges);
            propChanges = null;
        }

        return hasBinding;
    }

    /**
     * 
     * @param {*} a 
     * @param {*} count 
     * @returns 
     */
    function hash(a, count) {
        var count = count || 0;
        if (a === null || a === undefined) return count;
        else if (typeof a === 'number') count += a;
        else if (typeof a === 'string') count += a.length;
        else if (typeof a === 'boolean') count += a ? 1 : 0;
        else if (typeof a === 'object' && (a.constructor === Object || a.constructor === Array)) {
            for (var prop in a) {
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
     * @param {*} property 
     * @param {*} value 
     */
    function setValue(property, value) {
        var hasProp = registeredProperty.hasOwnProperty(property);
        var sameValue = isequal(componentInstance[property], value);
        if (hasProp && sameValue) return;

        if (propChanges === null) {
            propChanges = {};
        }
        /**
         * register the property to lookup object
         */
        registeredProperty[property] = true;
        propChanges[property] = value;
        componentInstance[property] = value;
    }

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

    /**
     * hook into the component observables
     */
    ObserveUntilDestroyed(elementRef, {
        next: function() {
            if (always) _updateViewBinding();
            lifeCycle.trigger(LifeCycleConst.willObserve);
        },
        done: function() {
            registeredProperty = null;
            ignoreChecks.length = 0;
            elementProps = null;
        }
    });
}