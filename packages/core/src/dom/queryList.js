import { Subject } from '../rx/subject';
import { removeFromArray, addToArray } from '@jeli/helpers';

export class QueryList extends Array {
    constructor() {
        super();
        this.onChanges = new Subject();
        Object.defineProperties(this, {
            first: {
                get: function () {
                    return this[0];
                }
            },
            last: {
                get: function () {
                    return this[this.length - 1];
                }
            }
        });
    }
    static from(iterable) {
        if (!Array.isArray(iterable)) throw new Error(typeof iterable + ' ' + iterable + ' is not iterable');
        var instance = new QueryList(iterable);
        // push all values
        iterable.forEach(it => instance.push(it));
        return instance;
    }
    static is(instance) {
        return instance instanceof QueryList;
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
        var index = this.indexOf(from);
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
            return this.find(function (ele) {
                return ele === element;
            });
        }

        return this;
    }
    getByIndex(index) {
        return this[index];
    }
    destroy() {
        while (this.length) {
            var element = this.pop();
            if (element) removeElement(element);
        }
        this.onChanges.destroy();
    }
    remove(element) {
        var index = this.indexOf(element);
        return this.removeByIndex(index);
    }
    hasIndex(index) {
        return this.length - 1 > index;
    }
    removeByIndex(index) {
        if (0 > index) return null;
        var element = removeFromArray(this, index);
        this.onChanges.next({
            value: element,
            index: index,
            type: 'detached'
        });

        return element;
    }
}