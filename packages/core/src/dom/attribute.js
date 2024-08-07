import { isobject, isequal } from '@jeli/helpers';
import { errorBuilder } from '../utils/errorLogger';
import { sce } from './renderer/sce';
import { ElementStyle } from './style';
import { ElementClassList } from './classlist';
/**
 * 
 * @param {*} nativeElement 
 * @param {*} name 
 * @param {*} value 
 */
export function AttributeAppender(nativeElement, prop, value) {
    if (11 === nativeElement.nodeType) return;
    if (isobject(prop)) {
        for (var name in prop) {
            if (AttributeAppender.helpers[name]) {
                AttributeAppender.helpers[name](nativeElement, prop[name])
            } else {
                AttributeAppender.setValue(nativeElement, name, prop[name]);
            }
        }
    } else {
        AttributeAppender.setValue(nativeElement, prop, value);
    }
}

/**
 * 
 * @param {*} nativeElement 
 * @param {*} prop 
 * @param {*} value 
 * @param {*} canRemoveAttr 
 * @returns 
 */
AttributeAppender.setValue = function(nativeElement, prop, value, canRemoveAttr) {
    var elementValue = nativeElement.getAttribute(prop);
    if (elementValue === value) return;
    if (canRemoveAttr && !value) {
        nativeElement.removeAttribute(prop);
    } else {
        nativeElement.setAttribute(prop, value);
    }
};

AttributeAppender.helpers = {
    style: function(nativeElement, value, template) {
        if (isobject(value)) {
            ElementStyle(nativeElement, value);
        } else if (template && template.type) {
            ElementStyle.set(nativeElement, template.type, value, template.suffix);
        } else {
            nativeElement.setAttribute('style', value);
        }
    },
    innerhtml: function(nativeElement, value) {
        AttributeAppender.setValue(nativeElement, 'innerHTML', sce.trustAsHTML(value));
    },
    src: function(nativeElement, value) {
        if (!['IMG', 'IFRAME', 'SOURCE', 'SCRIPT'].includes(nativeElement.tagName))
            return errorBuilder("src is not a valid property of " + nativeElement.tagName);
        AttributeAppender.setValue(nativeElement, 'src', value);
    },
    href: function(nativeElement, value) {
        if (!isequal('A', nativeElement.tagName))
            return errorBuilder("href is not a valid property of " + nativeElement.nativeElement.tagName);
        AttributeAppender.setValue(nativeElement, 'href', value);
    },
    class: function(nativeElement, value) {
        ElementClassList.add(nativeElement, value);
    },
    list: function(nativeElement, value) {
        AttributeAppender.setValue(nativeElement, 'list', value);
    },
    readonly: function(nativeElement, value) {
        AttributeAppender.setValue(nativeElement, 'readonly', value, true);
    },
    aria: (nativeElement, value) => singleOrMultipeUpdate(nativeElement, 'aria-',  value),
    data: (nativeElement, value) => singleOrMultipeUpdate(nativeElement, 'data-',  value)
};

/**
 * 
 * @param {*} nativeElement 
 * @param {*} propName 
 * @param {*} propValue 
 * @param {*} template 
 * @returns 
 */
AttributeAppender.setProp = function(nativeElement, propName, propValue, template) {
    try {
        if (propValue === undefined || !nativeElement || nativeElement.nodeType !== 1) return;
        if (AttributeAppender.helpers[propName]) 
            return AttributeAppender.helpers[propName](nativeElement, propValue, template);
    
        if (propName in nativeElement) nativeElement[propName] = propValue;
        else AttributeAppender.setValue(nativeElement, propName, propValue);
    } catch(e) {
        console.error(e);
    }
};

/**
 * 
 * @param {*} nativeElement 
 * @param {*} prop 
 * @param {*} value 
 */
function singleOrMultipeUpdate(nativeElement, prop, value){
    if (isobject(value)) {
        for(var name in value) {
            nativeElement.setAttribute(prop + name, value[name]);   
        }
    } else {
        nativeElement.setAttribute(prop, value);
    }
}