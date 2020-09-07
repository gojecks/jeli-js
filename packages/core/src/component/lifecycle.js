import { isfunction } from 'js-helpers/helpers';
/**
 * Jeli Component lifeCycle
 * didInit()
 * viewDidLoad()
 * viewDidMount()
 * viewDidDestroy()
 * willObserve()
 * didChange()
 */
function LifeCycle(componentInstance) {
    var _cycleState = {
        didInit: !!componentInstance.didInit,
        viewDidLoad: !!componentInstance.viewDidLoad,
        viewDidMount: !!componentInstance.viewDidMount,
        viewDidDestroy: !!componentInstance.viewDidDestroy,
        willObserve: !!componentInstance.willObserve,
        didChange: !!componentInstance.didChange
    };

    this.has = function(cycle) {
        return _cycleState[cycle] && isfunction(componentInstance[cycle]);
    };

    this.trigger = function(cycle, args) {
        if (this.has(cycle)) {
            componentInstance[cycle](args);
        }
    };
};