import { CompileNativeElement } from './custom.dom';
/**
 * This method generates a class that will be used to register element 
 * to native customElement.define
 * @param {*} elementConstructor
 * @param {*} attributes
 */
export function createCustomElement(elementConstructor, attributes) {
    if (typeof elementConstructor !== 'function')
        throw new Error(`Parameter should be a funtion ${typeof elementConstructor} provided`);

    class jlCustomElement extends HTMLElement {
        static get observedAttributes() {
            return Object.keys(attributes);
        }

        get nativeStrategyCompiler() {
            if (!this._nativeStrategyCompiler) {
                this._nativeStrategyCompiler = new NativeStrategyCompiler(elementConstructor);
            }

            return this._nativeStrategyCompiler;
        }

        constructor() {
            super();
            this._nativeStrategyCompiler = null;
        }

        connectedCallback() {
            this.nativeStrategyCompiler.connect(this);
        }

        disconnectedCallback() {
            this.nativeStrategyCompiler.disconnect();
        }

        attributeChangedCallback(name, oldValue, newValue) {
            this.nativeStrategyCompiler.setPropValue(attributes[name], newValue);
        }
    };

    // assign attributes to class
    Object.values(attributes).forEach(props => {
        Object.defineProperty(jlCustomElement.prototype, props[1], {
            get: function () {
                return this.nativeStrategyCompiler.getPropValue(props[1])
            },
            set: function (value) {
                this.nativeStrategyCompiler.setPropValue(props[1], value);
            },
            configurable: true,
            enumerable: true,
        })
    });

    return jlCustomElement;
}

/**
 * 
 * @param {*} elementConstructor 
 */
class NativeStrategyCompiler {
    constructor(elementConstructor) {
        var _elementRef = null;
        this._inputValues = {};
        this.connect = function(context) {
            CompileNativeElement(elementConstructor, context, (elementRef) => {
                _elementRef = elementRef;
            });
        };
    
        this.disconnect = function() {
            cleanupElementRef(_elementRef);
            _elementRef = this._inputValues =  null;
        };
    }
    


    setPropValue(attrProp, value) {
        if (typeof value == 'string')
            value = this._parseAttrValue(attrProp[0], value);
        this._inputValues[attrProp[1]] = value;
    };

    getPropValue(name) {
        return this._inputValues[name];
    };

    _parseAttrValue(type, value) {
        try {
            switch ((type || '').toLowerCase()) {
                case ('array'):
                case ('object'):
                    if (!value || value == '-') return null;
                    
                    if (!'{['.includes(value.trim().charAt(0)) && value.includes(':')){
                        return  value.split(',').reduce((accum, key) => {
                            key = key.split(':');
                            accum[key[0].trim()] = key[1].trim();
                            return accum;
                        }, type == 'array' ? [] : {});
                    }
                        
                    try {
                        value = JSON.parse(value);
                    } catch(e) {
                        value = value.split(',');
                    }

                    return value;
                break;
                case ('boolean'):
                case ('number'):
                    return JSON.parse(value);
                break;
            }
        } catch (e) {  }

        return value;
    }
}