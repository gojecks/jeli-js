import { isobject, isequal } from 'js-helpers/helpers';
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
    if (Node.DOCUMENT_FRAGMENT_NODE === nativeElement.nodeType) return;
    if (isobject(prop)) {
        for (var name in prop) {
            AttributeAppender.setValue(nativeElement, name, prop[name]);
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
        } else {
            ElementStyle.set(nativeElement, template.type, value, template.suffix);
        }
    },
    innerhtml: function(nativeElement, value) {
        AttributeAppender.setValue(nativeElement, 'innerHTML', sce.trustAsHTML(value));
    },
    src: function(nativeElement, value) {
        if (!['IMG', 'IFRAME'].includes(nativeElement.tagName)) {
            errorBuilder("src is not a valid property of " + nativeElement.tagName);
        }
        AttributeAppender.setValue(nativeElement, 'src', value);
    },
    href: function(nativeElement, value) {
        if (!isequal('A', nativeElement.tagName)) {
            errorBuilder("href is not a valid property of " + nativeElement.nativeElement.tagName);
        }
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
    }
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
    if (propValue === undefined || !nativeElement || nativeElement.nodeType !== Node.ELEMENT_NODE) return;
    if (AttributeAppender.helpers[propName]) {
        return AttributeAppender.helpers[propName](nativeElement, propValue, template);
    }

    if (propName in nativeElement) {
        nativeElement[propName] = propValue;
    } else {
        AttributeAppender.setValue(nativeElement, propName, propValue);
    }
};