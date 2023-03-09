import { isfunction } from 'js-helpers/helpers';

export var LifeCycleConst = {
    willObserve: 0,
    didChange: 1,
    didInit: 2,
    viewDidLoad: 3,
    viewDidDestroy: 4
};

var LifeCycleKeys = Object.keys(LifeCycleConst);

/**
 * Jeli Component lifeCycle
 * didInit()
 * viewDidLoad()
 * viewDidDestroy()
 * willObserve()
 * didChange()
 */
export function LifeCycle(componentInstance) {
    var _cycleState = {
        didInit: !!componentInstance.didInit,
        viewDidLoad: !!componentInstance.viewDidLoad,
        viewDidDestroy: !!componentInstance.viewDidDestroy,
        willObserve: !!componentInstance.willObserve,
        didChange: !!componentInstance.didChange
    };

    /**
     * 
     * @param {*} cycle 
     * @returns 
     */
    this.has = function(cycle) {
        return _cycleState[cycle] && isfunction(componentInstance[cycle]);
    };

    /**
     * 
     * @param {*} cycle 
     * @param {*} args 
     */
    this.trigger = function(cycle, args) {
        var cycleId = LifeCycleKeys[cycle];
        if (this.has(cycleId)) {
            componentInstance[cycleId](args);
        }
    }
}