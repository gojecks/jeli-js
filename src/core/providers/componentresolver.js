/**
 * 
 * @param {*} selector 
 * @param {*} element 
 * @param {*} callback 
 */
function ComponentFactoryResolver(selector, element, callback) {
    var component,
        controller;
    if (!$compileTracker.compiledModule._factories.has(selector)) {
        $compileTracker.compiledModule.options.requiredModules.forEach(function(moduleName) {
            var _module = ModuleService._factories.get(moduleName);
            if (_module._factories.has(selector)) {
                controller = _module._factories.get(selector);
            }
        });
    } else {
        controller = $compileTracker.compiledModule._factories.get(selector);
    }

    if (controller) {
        component = new ElementRef(document.createElement(selector));
        ElementCompiler(controller, component, function(componentInstance) {
            if (element.isDetachedElem) {
                component.parent = element.parent;
                component.insertAfter(component.nativeElement, element.nativeNode);
            } else {
                component.parent = element;
                element.nativeElement.appendChild(component.nativeElement);
            }

            component.parent.children.push(component);
            callback(component, componentInstance);
        });
    } else {
        throw new Error('Unable to resolve component: ' + selector);
    }
}