/*
 * jModel Core Function
 * Directive Name: j-Model
 */
commonModule
    .directive({
        selector: ':model',
        priority: 2,
        DI: ['ElementRef'],
        props: [{
            name: 'binding',
            value: ":model"
        }]
    }, ModelDirective);

function ModelDirective(elementRef) {
    this.binding = '';
    this.checker = '';
    this.options;
    this.modelInstance;
    this.didInit = function() {
        // change checker for ArrayCase
        this.checker = generateArrayKeyType(this.binding, elementRef.context.context);
        var evName = EventType(elementRef.nativeElement);
        if (!elementRef.context.jModelInstance.has(this.checker)) {
            elementRef.context.jModelInstance.set(this.checker, new ModelInstance(this.checker));
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
    };

    this.viewWillDestroy = function() {
        // perform cleanUp
        // observe the element change
        this.modelInstance.$$totalBinding--;
        if (!this.modelInstance.$$totalBinding) {
            elementRef.context.jModelInstance.remove(this.checker);
            this.modelInstance.__unregisterEvents(this.options);
        } else {
            this.modelInstance
                .removeFromView(this.options.jModelViewReferenceIndex)
                .__unregisterEvents(this.options, true);
        }

        this.options = this.jModelInstance = null;
    };
}