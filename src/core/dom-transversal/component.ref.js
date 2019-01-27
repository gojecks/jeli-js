/**
 * 
 * @param {*} element 
 * @param {*} instance 
 * @param {*} context 
 */
function ComponentRef(instance, context) {
    this.componentRefId = getUID();
    this.componentInstance = instance;
    this.observables = new Subject();
    this.child = [];
    this.context = context || instance;
    this.parent = null;
    this.isChild = false;
    this.jModelInstance = new Map();
    /**
     * set the component instance for change detection
     */
    ComponentRef.instance.set(this.componentRefId, this);
    /**
     * @method tick
     * @param {*} ignoreChild
     * @param {*} ignoreParent
     * trigger all subscribers
     */
    this.tick = function(ignoreChild, ignoreParent) {
        this.observables.notifyAllObservers(this.context);
        if (!ignoreChild) {
            this.child.forEach(function(ComponentRef) {
                ComponentRef.tick(false, true);
            });
        }

        /**
         * trigger parent
         */
        if (this.parent && !ignoreParent) {
            this.parent.tick(true);
        }
    };
}

ComponentRef.prototype.removeChild = function(refId) {
    this.child = this.child.filter(function(instance) {
        return refId !== instance.componentRefId;
    });
};

ComponentRef.prototype.evaluate = function(expr) {
    return maskedEval(expr, this.context);
};

ComponentRef.prototype.updateModel = function(propName, value) {
    setModelValue(propName, this.context, value);
    return this;
};

/**
 * @param {*} ComponentRef
 */
ComponentRef.prototype.new = function(context) {
    var childInstance = new ComponentRef(this.componentInstance, context);
    childInstance.parent = this;
    childInstance.isChild = true;
    this.child.push(childInstance);

    return childInstance;
};


ComponentRef.prototype.destroy = function() {
    // destroy observables
    this.observables.destroy();
    this.parent && this.parent.removeChild(this.componentRefId);
    ComponentRef.instance.delete(this.componentRefId);
    this.componentInstance = null;
    this.observables = null;
    this.parent = null;
    this.child.length = 0;
};

/**
 * ComponentRef Static properties
 * for internal use only
 */
ComponentRef.instance = new Map();
ComponentRef.detectChanges = function() {
    ComponentRef.instance.forEach(function(instance) {
        instance.tick();
    });
};