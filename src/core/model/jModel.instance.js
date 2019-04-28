/**
 * self Function
 *  @return ModelInstance
 **/

function ModelInstance(checker) {
    /**
      Model Event Listener
    **/
    var self = this;
    this.$$totalBinding = 0;
    this.modelValue = undefined;
    this.oldValue = undefined;
    this.$$views = [];
    this.key = checker;
    this.$eventListener = new CustomEventHandler('register', function(ev, instance) {
        // instance.isValid();
        if (instance.element.nativeElement.checkValidity()) {
            instance.element.context.updateModel(checker, self.modelValue);
        }
        ev.value = self.modelValue;
        self.update.notifyAllObservers(ev);
        instance.element.context.tick();
    });

    /**
     * create onUpdate listener
     */
    this.update = new Subject();
    // getView Function
    this.getView = function(ele) {
        if (!ele) { return null; }

        return this.$$views.filter(function(ins) {
            return ins.elem === ele;
        })[0];
    };

    this.setView = function(options) {
        var cVal = ModelSetterGetter(checker, options.element.context.context, true),
            eleVal = this.getElementValue(options.element);
        /*
         * update the viewModel if default value is set
         */
        if ($isDefined(eleVal) && !$isEqual(cVal, eleVal) && !cVal) {
            options.element.context.updateModel(checker, eleVal);
            this.modelValue = eleVal;
        }

        this.$$views.push(options);
        this.$$totalBinding++;
        this.__registerEvents(options);
        // updateView if model has value
        if (cVal && !eleVal) {
            this.$$setViewValue(cVal);
        }

        // set oldValue
        this.oldValue = this.modelValue;
    };
}

/*
  instance setViewValue Method
*/
ModelInstance.prototype.$$setViewValue = function(val) {
    this.oldValue = this.modelValue;
    this.modelValue = val;
    var oldVal = this.oldValue;
    this.$$views.forEach(function(viewInstance) {
        ModelInstance.setViewValue.call(viewInstance, val, oldVal);
    });
};

/**
 * instance remove view from collector
 */
ModelInstance.prototype.removeFromView = function(viewIndex) {
    this.$$views = this.$$views.filter(function(instance) {
        return instance.instanceViewReferenceIndex != viewIndex;
    });

    return this;
};


/*
  instance Listener
*/
ModelInstance.prototype.inputListener = function(instance) {
    var self = this;
    return function(ev) {
        self.oldValue = self.modelValue;
        self.modelValue = self.getElementValue(instance.element);
        self.$eventListener.$broadcast(":" + ev.type, instance);
    }
};

/**
 * 
 * @param {*} instance 
 */
ModelInstance.prototype.__registerEvents = function(instance) {
    var self = this;
    instance.modelOptions.$events.split(/\s/).forEach(registerListener);

    function registerListener(evName) {
        var $bindingName = $isEqual(evName, 'default') ? instance.eventName : evName;
        instance.$$eventRegistryIdx = self.$eventListener.register(':' + $bindingName,
            debounce(self.updateViews.bind(self), instance.modelOptions.debounce[evName] || 0)
        );

        instance.element.events.push({
            name: $bindingName,
            handler: self.inputListener(instance)
        });
    }
    return this;
};

/**
 * 
 * @param {*} instance 
 */
ModelInstance.prototype.__unregisterEvents = function(instance, one) {
    var self = this;
    instance.modelOptions.$events.split(/\s/).forEach(function(evName) {
        var $bindingName = ':' + ($isEqual(evName, 'default') ? instance.eventName : evName);
        if (one) {
            self.$eventListener.$removeOne($bindingName, instance.$$eventRegistryIdx);
        } else {
            self.$eventListener.$destroy($bindingName);
        }
    });
    return this;
};

/**
 * 
 * @param {*} instance
 */
ModelInstance.prototype.updateViews = function(ev, target) {
    //model was modified
    var self = this;
    this.$$views.forEach(function(instance) {
        if (target.$$eventRegistryIdx !== instance.$$eventRegistryIdx) {
            ModelInstance.setViewValue.call(instance,
                instance.element.context.evaluate(self.key),
                self.oldValue
            );
        }
    });
};


/**
 * 
 * @param {*} element 
 */
ModelInstance.prototype.getElementValue = function(elementRef) {
    if ($isEqual(elementRef.nativeElement.type, "checkbox")) {
        return elementRef.nativeElement.checked;
    } else if ($isEqual(elementRef.nativeElement.localName, 'select')) {
        if (!elementRef.children.length || elementRef.nativeElement.options.length > elementRef.children.length) {
            return elementRef.nativeElement.value;
        }

        return elementRef.children[elementRef.nativeElement.selectedIndex].getAttribute('value');
    } else {
        if (elementRef.nativeElement.type) {
            return jSonParser(elementRef.nativeElement.value);
        } else {
            return elementRef.nativeElement.innerHTML;
        }
    }
};

/**
 * 
 * @param {*} newVal 
 * @param {*} oldVal 
 * 
 * Method is triggered each time 
 * there is an update in model or DOM element
 */
ModelInstance.setViewValue = function(newVal, oldVal) {
    if (!$isEqual(newVal, oldVal)) {
        if (this.canSetValue) {
            //set the new value
            this.element.nativeElement.value = newVal || '';
            this.isProcessed = true;
        } else {
            switch (this.element.nativeElement.localName) {
                case ('select'):
                    ModelInstance.selectType(this, newVal, oldVal);
                    break;
                case ('input'):
                    ModelInstance.checkType(this, newVal, oldVal)
                    break;
                default:
                    this.element.nativeElement.innerHTML = newVal;
                    break;
            }
        }
    }
};

/**
 * 
 * @param {*} context 
 * @param {*} checked 
 */
ModelInstance.checkType = function(context, checked) {
    switch (context.element.nativeElement.type.toLowerCase()) {
        case ('checkbox'):
            context.element.nativeElement[checked ? 'setAttribute' : 'removeAttribute']('checked', true);
            context.element.nativeElement.checked = checked || false;
            break;
        case ('radio'):
            context.element.nativeElement.setAttribute('checked', true);
            break;
    }
};

/**
 * 
 * @param {*} context 
 * @param {*} newVal 
 */
ModelInstance.selectType = function(context, newVal) {
    newVal = JSON.stringify(newVal);
    if (newVal) {
        newVal = newVal.toLowerCase();
        [].forEach.call(context.element.nativeElement.options, function(options) {
            if ($isEqual(JSON.stringify(options.value).toLowerCase(), newVal)) {
                options.selected = true;
            }
        });
    }
};