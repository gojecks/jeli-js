import { isobject, isequal } from 'js-helpers/helpers';
/**
 * structure require Model 
 * Useful in Directive Compiler
 * @param {*} componentInstance 
 * @param {*} elementRef 
 * @param {*} lifeCycle 
 * @param {*} definition
 */
function Linker(componentInstance, elementRef, lifeCycle, definition) {
    var propChanges = null;
    var registeredProperty = [];
    if (definition.props) {
        var always = _updateViewBinding(true);
        if (always) {
            var unsubscribe = SubscribeObservables(elementRef.hostRef.refId, _updateViewBinding);
            elementRef.observer(function() {
                unsubscribe();
                registeredProperty = [];
            });
        }
    }

    /**
     * 
     * @param {*} initialBinding 
     */
    function _updateViewBinding(initialBinding) {
        var hasBinding = false;
        for (var prop in definition.props) {
            var item = definition.props[prop];
            var name = item.value || prop;
            if (elementRef.props && elementRef.props.hasOwnProperty(name)) {
                var value;
                if (isobject(elementRef.props[name])) {
                    hasBinding = true;
                    value = getFilteredTemplateValue(elementRef.props[name], elementRef.context, elementRef.componentInstance);
                } else {
                    value = getPrimitiveValue(item.type, name, elementRef.props[name])
                }

                setValue(prop, value);
            } else if (elementRef.hasAttribute(name)) {
                setValue(prop, elementRef.attr[name]);
            }
        }

        if (propChanges) {
            lifeCycle.trigger('didChange', propChanges);
            propChanges = null;
        }

        lifeCycle.trigger('willObserve');

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
        if (isequal(type, 'TemplateRef')) {
            return elementRef.getTemplateRef(name)
        }

        return value;
    }
}