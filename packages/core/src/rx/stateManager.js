/**
 * 
 * @param {*} current 
 * @param {*} callback 
 * @returns 
 */
export class StateManager {
    constructor(current, callback, states) {
        this.current = (current || '');
        this.states = states || [];
        this.set = function (name) {
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
            return (callback || function () { return false; })(current, next);
        }

        /**
         * trigger the set method
         */
        this.set(current);
    }

    get isLast() {
        return this.lastStateIndex === this.states.length - 1;
    }

    get isFirst() {
        return this.lastStateIndex < 1;
    }
    
    pushStates(states) {
        this.states.push.apply(this.states, states);
        if (this.current && !this.lastStateIndex) {
            this.lastStateIndex = this.states.indexOf(name);
        }
    }
    next() {
        var next = this.lastStateIndex + 1;
        if (this.states.length - 1 >= next) {
            this.set(this.states[next]);
        }
    }
    previous() {
        if (this.lastStateIndex) {
            this.set(this.states[this.lastStateIndex - 1]);
        }
    }
    isState(state) {
        return state === this.current;
    }
    setClass(state) {
        return this.isState(state) ? 'active' : '';
    }
}





