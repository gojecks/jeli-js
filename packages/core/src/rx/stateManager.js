/**
 * 
 * @param {*} current 
 * @param {*} callback 
 * @returns 
 */
export class StateManager {
    constructor(current, validator, states) {
        this.current = (current || '');
        this.states = states || [];
        this.validator = validator || (() => false);

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

    set(state) {
        const stateIndex = this.states.indexOf(state);
        if (this.states.length && !this.validator(this.current, state, stateIndex > -1)) {
            this.current = state;
            this.lastStateIndex = stateIndex;
        }
    }
    
    pushStates(states) {
        this.states.push.apply(this.states, states);
        if (this.current && !this.lastStateIndex) {
            this.lastStateIndex = this.states.indexOf(name);
        }
    }
    next() {
        const next = this.lastStateIndex + 1;
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
