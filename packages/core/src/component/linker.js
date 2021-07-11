import { isobject, isequal } from 'js-helpers/helpers';
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
    var registeredProperty = [];
    var always = false;
    if (definition.props) {
        always = _updateViewBinding();
    }

    function _updateViewBinding() {
        var hasBinding = false;
        for (var prop in definition.props) {
            var item = definition.props[prop];
            var name = item.value || prop;
            var value;
            if (elementRef.props && elementRef.props.hasOwnProperty(name)) {
                try {
                    if (isobject(elementRef.props[name])) {
                        hasBinding = true;
                        value = getFilteredTemplateValue(
                            elementRef.props[name],
                            ((isequal(elementRef.parent.type, 'comment') && !elementRef.isc) ? elementRef : elementRef.parent).context,
                            elementRef.parent.componentInstance
                        );
                    } else {
                        value = getPrimitiveValue(item.type, name, elementRef.props[name]);
                    }
                    setValue(prop, value);
                } catch (e) { console.error(e); }
            } else if (elementRef.hasAttribute(name)) {
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
     * @param {*} property 
     * @param {*} value 
     */
    function setValue(property, value) {
        if (isequal(componentInstance[property], value) && registeredProperty.includes(property)) {
            return;
        }

        if (propChanges === null) {
            propChanges = {};
        }
        /**
         * register the property to lookup object
         */
        if (!registeredProperty.includes(property)) {
            registeredProperty.push(property);
        }

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
                return elementRef.getTemplateRef(name);
            case (staticInjectionToken.Function):
                return elementRef.parent.componentInstance[value];
            default:
                return value;
        }
    }

    /**
     * hook into the component observables
     */
    var unsubscribe = SubscribeObservables(elementRef.hostRef.refId, function() {
        if (always)
            _updateViewBinding();
        lifeCycle.trigger('willObserve');
    });

    attachElementObserver(elementRef, function() {
        unsubscribe();
        registeredProperty = [];
    });
}


/**
 * 
 * @param {*} refId 
 * @param {*} fn 
 */
function SubscribeObservables(refId, fn) {
    var componentRef = componentDebugContext.get(refId);
    var unsubscribe = null;
    if (componentRef) {
        unsubscribe = componentRef.observables.subscribe(fn);
    }

    return unsubscribe;
}