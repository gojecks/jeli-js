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
export class AttributeAppender {
    static set(nativeElement, prop, value) {
        if (11 === nativeElement.nodeType) return;
        if (isobject(prop)) {
            for (var name in prop) {
                this.byType(name, nativeElement, prop[name]);
            }
        } else {
            this.setValue(nativeElement, prop, value);
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
    static setValue(nativeElement, prop, value, canRemoveAttr) {
        var elementValue = nativeElement.getAttribute(prop);
        if (elementValue === value) return;
        if (canRemoveAttr && !value) {
            nativeElement.removeAttribute(prop);
        } else {
            nativeElement.setAttribute(prop, value);
        }
    }

    static byType(type, nativeElement, value, template) {
        var types = {
            style: () => {
                if (isobject(value)) {
                    ElementStyle(nativeElement, value);
                } else if (template && template.type) {
                    ElementStyle.set(nativeElement, template.type, value, template.suffix);
                } else {
                    nativeElement.setAttribute('style', value);
                }
            },
            innerhtml: () => this.setValue(nativeElement, 'innerHTML', sce.trustAsHTML(value)),
            src: () => {
                if (!['IMG', 'IFRAME', 'SOURCE', 'SCRIPT'].includes(nativeElement.tagName))
                    return errorBuilder("src is not a valid property of " + nativeElement.tagName);
                this.setValue(nativeElement, 'src', value);
            },
            href: () => {
                if (!isequal('A', nativeElement.tagName))
                    return errorBuilder("href is not a valid property of " + nativeElement.nativeElement.tagName);
                this.setValue(nativeElement, 'href', value);
            },
            class: () => ElementClassList.add(nativeElement, value),
            list: () => this.setValue(nativeElement, 'list', value),
            readonly: () => this.setValue(nativeElement, 'readonly', value, true),
            aria: () => this.singleOrMultipeUpdate(nativeElement, 'aria-', value),
            data: () => this.singleOrMultipeUpdate(nativeElement, 'data-', value)
        };

        if (types[type]) {
            types[type]();
        } else if (type in nativeElement) {
            nativeElement[type] = value;
        } else {
            this.setValue(nativeElement, type, value);
        }
    }

    /**
     * 
     * @param {*} nativeElement 
     * @param {*} propName 
     * @param {*} propValue 
     * @param {*} template 
     * @returns 
     */
    static setProp(nativeElement, propName, propValue, template) {
        try {
            if (propValue !== undefined && nativeElement && nativeElement.nodeType === 1){
                this.byType(propName, nativeElement, propValue, template);
            }   
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * 
     * @param {*} nativeElement 
     * @param {*} prop 
     * @param {*} value 
     */
    static singleOrMultipeUpdate(nativeElement, prop, value) {
        if (isobject(value)) {
            for (var name in value) {
                nativeElement.setAttribute(prop + name, value[name]);
            }
        } else {
            nativeElement.setAttribute(prop, value);
        }
    }
}