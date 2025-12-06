import { Subject } from '../rx/subject';
import { removeFromArray, addToArray } from '@jeli/helpers';

export class QueryList extends Array {
    constructor() {
        super();
        this.onChanges = new Subject();
    }

    static from(iterable) {
        if (!Array.isArray(iterable)) throw new Error(typeof iterable + ' ' + iterable + ' is not iterable');
        const instance = new QueryList(iterable);
        // push all values
        iterable.forEach(it => instance.push(it));
        return instance;
    }

    static is(instance) {
        return instance instanceof QueryList;
    }

    get first() {
        return this[0];
    }

    get last(){
        return this[this.length - 1];
    }

    add(element, index, emitEvent) {
        addToArray(this, element, index);
        if (emitEvent) {
            this.onChanges.next({
                value: element,
                index: index,
                type: 'add'
            });
        }
    }

    replace(from, to, emitEvent) {
        const index = this.indexOf(from);
        if (index > -1) {
            this[index] = to;
        }

        if (emitEvent) {
            this.onChanges.next({
                value: to,
                index: index,
                type: 'replace'
            });
        }
    }

    get(element) {
        if (element) {
            return this.find(ele => (ele === element));
        }

        return this;
    }
    getByIndex(index) {
        return this[index];
    }
    destroy() {
        while (this.length) {
            const element = this.pop();
            if (element) removeElement(element);
        }
        this.onChanges.destroy();
    }
    /**
     * 
     * @param {*} element 
     * @param {*} deep 
     * @returns 
     */
    remove(element, deep = false) {
        let index = this.indexOf(element);
        if (0 > index && deep && this.length){
            for(let i=0; i<this.length; i++){
                if (!this[i].children) continue;
                const remChild = this[i].children.remove(element);
                if (remChild) return remChild;
            }
        }

        return this.removeByIndex(index);
    }
    hasIndex(index) {
        return this.length - 1 > index;
    }
    removeByIndex(index) {
        if (0 > index) return null;
        const element = removeFromArray(this, index);
        this.onChanges.next({
            value: element,
            index: index,
            type: 'detached'
        });

        return element;
    }
}