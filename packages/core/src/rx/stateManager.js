/**
 * 
 * @param {*} current 
 * @param {*} callback 
 * @returns 
 */
export function StateManager(current, callback, states) {
    this.current = current;
    this.states = states || [];
    this.lastStateIndex = this.states.indexOf(current);
    this.set = function(name) {
        trigger.call(this, name);
        this.current = name;
        this.lastStateIndex = this.states.indexOf(name);
    };

    function trigger(name) {
        (callback || function() {})(this.current, name);
    }

    Object.defineProperty(this, 'isLast', {
        get: function() {
            return this.lastStateIndex === this.states.length - 1;
        }
    });
}

StateManager.prototype.next = function() {
    var next = this.lastStateIndex + 1;
    if (this.states.length - 1 >= next) {
        this.set(this.states[next]);
    }
};

StateManager.prototype.previous = function() {
    if (this.lastStateIndex) {
        this.set(this.states[this.lastStateIndex - 1]);
    }
};

StateManager.prototype.isState = function(state) {
    return state === this.current;
};

StateManager.prototype.setClass = function(state) {
    return this.isState(state) ? 'active' : '';
}