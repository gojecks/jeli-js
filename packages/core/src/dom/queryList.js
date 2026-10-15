import { Subject } from '../rx/subject';
import { removeFromArray, addToArray } from '@jeli/helpers';

// composition, not `extends Array` - keeps add/remove/replace as the only way to mutate, so onChanges never gets bypassed
export class QueryList {
    constructor() {
        this._items = [];
        this.onChanges = new Subject();
    }

    static from(iterable) {
        if (!Array.isArray(iterable)) throw new Error(typeof iterable + ' ' + iterable + ' is not iterable');
        const instance = new QueryList();
        // explicit index - add(it) with no index would insert at 0 every time, reversing order
        iterable.forEach(it => instance.add(it, instance.length));
        return instance;
    }

    static is(instance) {
        return instance instanceof QueryList;
    }

    get length() {
        return this._items.length;
    }

    get first() {
        return this._items[0];
    }

    get last() {
        return this._items[this._items.length - 1];
    }

    add(element, index, emitEvent) {
        addToArray(this._items, element, index);
        if (emitEvent) {
            this.onChanges.next({
                value: element,
                index: index,
                type: 'add'
            });
        }
    }

    replace(from, to, emitEvent) {
        const index = this._items.indexOf(from);
        if (index > -1) {
            this._items[index] = to;
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
            return this._items.find(ele => (ele === element));
        }

        return this._items;
    }
    getByIndex(index) {
        return this._items[index];
    }
    destroy() {
        while (this._items.length) {
            const element = this._items.pop();
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
        let index = this._items.indexOf(element);
        if (0 > index && deep && this._items.length){
            for(let i=0; i<this._items.length; i++){
                if (!this._items[i].children) continue;
                const remChild = this._items[i].children.remove(element);
                if (remChild) return remChild;
            }
        }

        return this.removeByIndex(index);
    }
    hasIndex(index) {
        return this._items.length - 1 > index;
    }
    removeByIndex(index) {
        if (0 > index) return null;
        const element = removeFromArray(this._items, index);
        this.onChanges.next({
            value: element,
            index: index,
            type: 'detached'
        });

        return element;
    }

    // read/iteration surface - deliberately no push/pop/splice/sort/etc, see class comment
    forEach(fn, thisArg) {
        this._items.forEach(fn, thisArg);
    }
    map(fn, thisArg) {
        return this._items.map(fn, thisArg);
    }
    filter(fn, thisArg) {
        return this._items.filter(fn, thisArg);
    }
    find(fn, thisArg) {
        return this._items.find(fn, thisArg);
    }
    some(fn, thisArg) {
        return this._items.some(fn, thisArg);
    }
    every(fn, thisArg) {
        return this._items.every(fn, thisArg);
    }
    indexOf(element) {
        return this._items.indexOf(element);
    }
    includes(element) {
        return this._items.includes(element);
    }
    toArray() {
        return this._items.slice();
    }
    [Symbol.iterator]() {
        return this._items[Symbol.iterator]();
    }
}
