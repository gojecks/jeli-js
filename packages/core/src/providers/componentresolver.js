/**
 * 
 * @param {*} selector 
 * @param {*} element 
 * @param {*} callback 
 */
export function ComponentFactoryResolver(selector, element, callback) {
    var component,
        controller;
    if (!CoreBootstrapContext.compiledModule.annotations.exports.has(selector)) {
        CoreBootstrapContext.compiledModule.requiredModules.forEach(function(moduleName) {
            var _module = ModuleService._factories.get(moduleName);
            if (_module.annotations.exports.has(selector)) {
                controller = _module.annotations.exports.get(selector);
            }
        });
    } else {
        controller = CoreBootstrapContext.compiledModule.annotations.exports.get(selector);
    }

    if (controller && element) {
        component = new ElementRef(document.createElement(selector), element, {
            name: selector,
            type: 'element',
            isc: true
        });
        ElementCompiler(controller, component, function(componentInstance) {
            component.parent.children.add(component);
            callback(component, componentInstance);
        });
    } else {
        throw new Error('Unable to resolve component: ' + selector);
    }
}