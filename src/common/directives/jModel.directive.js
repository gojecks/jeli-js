/*
 * jModel Core Function
 * Directive Name: j-Model
 */
commonModule
    .directive({
        selector: ':model',
        DI: ['ElementRef', 'Observables'],
        props: ['binding=:model']
    }, ModelDirective);

function ModelDirective(elementRef, observables) {
    this.binding = '';
    this.checker = '';
    this.options;
    this.modelInstance;
    this.unSubscription = null;
    this.didInit = function() {
        var _this = this;
        // change checker for ArrayCase
        this.checker = generateArrayKeyType(this.binding, elementRef.context.context);
        var evName = EventType(elementRef.nativeElement);
        if (!elementRef.context.jModelInstance.has(this.checker)) {
            elementRef.context.jModelInstance.set(this.checker, new ModelInstance(this.checker));
            /**
             * attach observer
             */
            this.unSubscription = observables.observeForKey(this.checker, function() {
                _this.modelInstance && _this.modelInstance.updateViews(null, {});
            });
        }

        this.modelInstance = elementRef.context.jModelInstance.get(this.checker);
        var modelOptions = extend(true, {
            $events: 'default',
            debounce: {
                default: 0
            }
        }, elementRef.context.evaluate(elementRef.getAttribute('model-options')) || {});
        this.options = ({
            element: elementRef,
            modelOptions: modelOptions,
            eventName: evName,
            //Check for setting Value
            //onChange Input Types shouldn't change Value
            canSetValue: $isEqual('input', evName),
            error: null,
            validators: null
        });

        /**
         * register changeEvent
         * only if it exists
         */
        var changeEvent = elementRef.getEvent('change');
        if (changeEvent) {
            this.modelInstance.update.subscribe(function(ev) {
                triggerArrayFnWithParams(changeEvent.value, [null, elementRef, ev]);
            });
        }

        /**
         * set the view to the model instance
         * set the viewReferenceIndex
         * used to remove Object from the collector when element is removed from DOM
         **/
        this.modelInstance.setView(this.options);
        modelOptions = null;
    };

    this.viewDidDestroy = function() {
        // perform cleanUp
        // observe the element change
        this.modelInstance.$$totalBinding--;
        this.modelInstance
            .removeFromView(this.options.jModelViewReferenceIndex)
            .__unregisterEvents(this.options, !this.modelInstance.$$totalBinding);
        if (!this.modelInstance.$$totalBinding) {
            elementRef.context.jModelInstance.delete(this.checker);
            this.unSubscription && this.unSubscription();
        }
        this.options = this.modelInstance = null;
    };
}