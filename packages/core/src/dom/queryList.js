function QueryList() {
    this._list = [];
    Object.defineProperties(this, {
        length: {
            get: function() {
                return this._list.length;
            }
        },
        first: {
            get: function() {
                return this._list[0];
            }
        },
        last: {
            get: function() {
                return this._list[this.length - 1];
            }
        }
    });
}

QueryList.prototype.add = function(element, emitEvent) {
    this._list.push(element);
    if (emitEvent) {
        this.onChanges.next({
            value: element,
            type: 'add'
        });
    }
};

QueryList.prototype.get = function(element) {
    if (element) {
        return this._list.find(function(ele) {
            return ele === element
        });
    }

    return this._list;
};

QueryList.prototype.filter = function(callback) {
    this._list.filter(callback);
};

QueryList.prototype.forEach = function(callback) {
    this._list.forEach(callback);
};

QueryList.prototype.reduce = function(callback, accumulator) {
    return this._list.reduce(callback, accumulator);
};

QueryList.prototype.some = function(callback) {
    return this._list.some(callback);
};

QueryList.prototype.map = function(callback) {
    return this._list.map(callback);
};

QueryList.prototype.findByIndex = function(index) {
    return this._list[index];
};

QueryList.prototype.find = function(callback) {
    return this._list.find(callback);
};

QueryList.prototype.toString = function() {
    return JSON.stringify(this._list);
};

QueryList.prototype.destroy = function() {
    while (this._list.length) {
        this._list.pop().remove();
    }
    this.onChanges.destroy();
};

QueryList.prototype.reset = function(newItem, emitEvent) {
    this.destroy();
    for (var i = 0; i < newItem.length; i++) {
        this.add(newItem[i], emitEvent);
    }
}

QueryList.prototype.remove = function(element) {
    var index = this._list.findIndex(function(ele) {
        return ele === element;
    });

    return this.removeByIndex(index);
};

QueryList.prototype.removeByIndex = function(index) {
    var element = this._list.splice(index, 1)[0];
    this.onChanges.next({
        value: element,
        type: 'detached'
    });

    return element;
};

QueryList.prototype.onChanges = new SimpleSubject();