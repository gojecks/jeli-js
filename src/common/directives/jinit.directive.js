/**
 * jInit Directive
 */
commonModule
    .directive({
        selector: ':init',
        priority: 10,
        DI: ['ElementRef'],
        props: [{
            name: 'initValue',
            value: ':init'
        }]
    }, InitDirective);

function InitDirective(elementRef) {
    this.didInit = function() {
        var opts = getFunctionsFromString(this.initValue);
        triggerArrayFnWithParams(opts, [null, elementRef]);
    };
}