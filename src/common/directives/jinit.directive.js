/**
 * jInit Directive
 */
commonModule
    .directive({
        selector: ':init',
        DI: ['ElementRef'],
        props: ['initValue=:init']
    }, InitDirective);

function InitDirective(elementRef) {
    this.didInit = function() {
        var opts = getFunctionsFromString(this.initValue);
        triggerArrayFnWithParams(opts, [null, elementRef]);
    };
}