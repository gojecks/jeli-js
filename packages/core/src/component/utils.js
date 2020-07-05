/**
 * 
 * @param {*} localVariables 
 * @param {*} componentContext 
 */
function createLocalVariables(localVariables, componentContext) {
    var context = {};
    if (localVariables) {
        for (var propName in localVariables) {
            if (localVariables[propName].match(/\s/)) {
                context[propName] = localVariables[propName];
            } else if (componentContext) {
                context[propName] = evaluateExpression(localVariables[propName], componentContext);
            }
        }
    }

    return context;
}

/**
 * 
 * @param {*} element 
 * @param {*} observers 
 */
function setupAttributeObservers(element, attrObservers) {
    var observerStarted = false;
    element.observer(SubscribeObservables(element.hostRef.refId, observe));

    function observe() {
        for (var propName in attrObservers) {
            /**
             * remove the config
             */
            if (attrObservers[propName].once && observerStarted) {
                break;
            }
            attributeEvaluator(propName, attrObservers[propName]);
        }

        /**
         * 
         * @param {*} propName 
         * @param {*} template 
         */
        function attributeEvaluator(propName, template) {
            compileTemplate(template, element.context, function(value) {
                if (AttributeAppender[propName]) {
                    AttributeAppender[propName](element.nativeElement, value, template);
                } else {
                    element.setProp(propName, value, true);
                }
            });
        }

        observerStarted = true;
    }
}