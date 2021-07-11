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
            nativeElement.setAttribute(name, prop[name]);
        }
    } else {
        nativeElement.setAttribute(prop, value);
    }
}

AttributeAppender.helpers = {
    style: function(nativeElement, value, template) {
        if (isobject(value)) {
            ElementStyle(nativeElement, value);
        } else {
            ElementStyle.set(nativeElement, template.props, value, template.suffix);
        }
    },
    innerhtml: function(nativeElement, value) {
        nativeElement.innerHTML = sce.trustAsHTML(value);
    },
    src: function(nativeElement, value) {
        if (!['IMG', 'IFRAME'].includes(nativeElement.tagName)) {
            errorBuilder("src is not a valid property of " + nativeElement.tagName);
        }
        nativeElement.setAttribute('src', value);
    },
    href: function(nativeElement, value) {
        if (!isequal('A', nativeElement.tagName)) {
            errorBuilder("href is not a valid property of " + nativeElement.nativeElement.tagName);
        }

        nativeElement.setAttribute('href', value);
    },
    class: function(nativeElement, value) {
        ElementClassList.add(nativeElement, value);
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
    if (propValue === undefined || !nativeElement) return;
    if (AttributeAppender.helpers[propName]) {
        return AttributeAppender.helpers[propName](nativeElement, propValue, template);
    }

    if (propName in nativeElement) {
        nativeElement[propName] = propValue;
    } else {
        nativeElement.setAttribute(propName, propValue);
    }
};