/**
 * 
 * @param {*} current 
 * @param {*} callback 
 * @returns 
 */
export function StateManager(current, callback, states) {
    this.current = (current || '');
    this.states = states || [];
    this.set = function(name) {
        if (!validateAction(this.current, name) && this.states.length) {
            this.current = name;
            this.lastStateIndex = this.states.indexOf(name);
        }
    };

    /**
     * 
     * @param {*} current 
     * @param {*} next 
     * @returns 
     */
    function validateAction(current, next) {
        return (callback || function() { return false; })(current, next);
    }

    Object.defineProperties(this, {
        isLast: {
            get: function() {
                return this.lastStateIndex === this.states.length - 1;
            }
        },
        isFirst: {
            get: function() {
                return this.lastStateIndex < 1;
            }
        }
    });
    /**
     * trigger the set method
     */
    this.set(current);
}

StateManager.prototype.pushStates = function(states) {
    this.states.push.apply(this.states, states);
    if (this.current && !this.lastStateIndex){
        this.lastStateIndex = this.states.indexOf(name);
    }
};

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