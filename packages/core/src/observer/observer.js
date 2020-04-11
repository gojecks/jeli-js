function Observer() {
    this._entries = {};
    this.get = function(id) {
        return this._entries[id];
    };
}

Observer.prototype.remove = function(id) {
    this._entries[id].emit('$destroy', 1);
    this._entries[id] = null;
};

Observer.prototype.add = function(id) {
    if (!this._entries.hasOwnProperty(id)) {
        this._entries[id] = new Subject(id);
    }

    return this.get(id);
};

Observer.prototype.notify = function(subjectId) {
    if (subjectId) {
        var subject = this.get(subjectId);
        if (subject) {
            // subject.notifyAllObservers();
        }
    }
};

Observer.prototype.notifyAllSubjects = function() {
    for (var subjectId in this._entries) {
        this._entries[subjectId].notifyAllObservers(
            // get the subjectID
        );
    };
};