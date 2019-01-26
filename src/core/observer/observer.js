function Observer() {
    this['[[entries]]'] = {};
    this.get = function(id) {
        return this['[[entries]]'][id];
    };
}

Observer.prototype.remove = function(id) {
    this['[[entries]]'][id].emit('$destroy', 1);
    this['[[entries]]'][id] = null;
};

Observer.prototype.add = function(id) {
    if (!this['[[entries]]'].hasOwnProperty(id)) {
        this['[[entries]]'][id] = new Subject(id);
    }

    return this.get(id);
};

Observer.prototype.notify = function(subjectId) {
    if (!$isUndefined(subjectId)) {
        var subject = this.get(subjectId);
        if (subject) {
            // subject.notifyAllObservers();
        }
    }
};

Observer.prototype.notifyAllSubjects = function() {
    for (var subjectId in this['[[entries]]']) {
        this['[[entries]]'][subjectId].notifyAllObservers(
            // get the subjectID
        );
    };
};