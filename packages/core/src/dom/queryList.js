import { Subject } from '../rx/subject';
import { removeFromArray, addToArray } from 'js-helpers/helpers';

export function QueryList() {
    Object.defineProperties(this, {
        first: {
            get: function() {
                return this[0];
            }
        },
        last: {
            get: function() {
                return this[this.length - 1];
            }
        }
    });
}
// extend Array Method
QueryList.constructor = Array;
QueryList.prototype = Object.create(Array.prototype);

QueryList.prototype.add = function(element, index, emitEvent) {
    addToArray(this, element, index);
    if (emitEvent) {
        this.onChanges.next({
            value: element,
            index: index,
            type: 'add'
        });
    }
}

QueryList.prototype.replace = function(from, to, emitEvent) {
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

QueryList.prototype.get = function(element) {
    if (element) {
        return this.find(function(ele) {
            return ele === element;
        });
    }

    return this;
};

QueryList.prototype.getByIndex = function(index) {
    return this[index];
}

QueryList.prototype.destroy = function() {
    while (this.length) {
        var element = this.pop();
        if (element) removeElement(element);
    }
    this.onChanges.destroy();
};

QueryList.prototype.remove = function(element) {
    var index = this.indexOf(element);

    return this.removeByIndex(index);
};

QueryList.prototype.hasIndex = function(index) {
    return this.length - 1 > index;
}

QueryList.prototype.removeByIndex = function(index) {
    var element = removeFromArray(this, index);
    this.onChanges.next({
        value: element,
        index: index,
        type: 'detached'
    });

    return element;
};

QueryList.prototype.onChanges = new Subject();

QueryList.from = function(iterable){
    if (!Array.isArray(iterable)) throw new Error(typeof iterable + ' ' + iterable + ' is not iterable');
    var instance = new QueryList(iterable);
    // push all values
    iterable.forEach(it => instance.push(it));
    return instance;
}

QueryList.is = function(instance) {
    return instance instanceof QueryList;
}