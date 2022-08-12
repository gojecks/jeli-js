import { isobject, isequal } from 'js-helpers/helpers';
import { TemplateRef } from '../dom/renderer/templateref';
import { staticInjectionToken } from './injectors';
/**
 * structure require Model 
 * Useful in Directive Compiler
 * @param {*} componentInstance 
 * @param {*} elementRef 
 * @param {*} lifeCycle 
 * @param {*} definition
 */
export function ϕjeliLinker(componentInstance, elementRef, lifeCycle, definition) {
    lifeCycle.trigger('willObserve');
    var propChanges = null;
    var registeredProperty = {};
    var isPrimitive = [];
    var always = false;
    if (definition.props) {
        always = _updateViewBinding();
    }

    function _updateViewBinding() {
        var hasBinding = false;
        var context = null;
        if (elementRef.hasContext) {
            context = elementRef.context;
        } else {
            context = ((isequal(elementRef.parent.type, 'comment') && !elementRef.isc) ? elementRef : elementRef.parent).context;
        }

        for (var prop in definition.props) {
            if (isPrimitive.includes(prop)) continue;
            var item = definition.props[prop];
            var name = item.value || prop;
            var value;
            if (elementRef.props && elementRef.props.hasOwnProperty(name)) {
                try {
                    if (isobject(elementRef.props[name])) {
                        hasBinding = true;
                        value = getFilteredTemplateValue(elementRef.props[name], context, elementRef.parent.componentInstance);
                    } else {
                        value = getPrimitiveValue(item.type, name, elementRef.props[name]);
                        isPrimitive.push(prop);
                    }
                    setValue(prop, value);
                } catch (e) { console.error(e); }
            } else if (elementRef.hasAttribute(name)) {
                isPrimitive.push(prop);
                setValue(prop, elementRef.attr[name]);
            }
        }

        if (propChanges) {
            lifeCycle.trigger('didChange', propChanges);
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
        var hashValue = 1;
        var sameValue = isequal(componentInstance[property], value);;
        if (typeof value === 'object') {
            hashValue = hash(value);
            sameValue = hashValue === registeredProperty[property]
        }

        if (hasProp && sameValue) return;

        if (propChanges === null) {
            propChanges = {};
        }
        /**
         * register the property to lookup object
         */
        registeredProperty[property] = hashValue;
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
            lifeCycle.trigger('willObserve');
        },
        done: function() {
            registeredProperty = null;
            isPrimitive.length = 0;
        }
    });
}