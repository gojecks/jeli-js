    //scope generator prototype
    //Eli Root Model
    //Prototype that controls all Model
    //@Private
    function $modelGenerator() {
        this.$mId = $mUID++;
        this.$$asyncQueue = [];
        this.$$subscribers = {};
        this.$self = this;
        this.$parent = this.$child = this.$$phase = this.$$watchList = this.$next = this.$previous = this.$$isIsolated = null;
    }

    //set model constructor here
    $modelGenerator.prototype.constructor = $modelGenerator;

    //creating a new instance of model
    $modelGenerator.prototype.$new = createNewModelInstance

    //$model Phase Setter
    $modelGenerator.prototype.$$beginPhase = function(phase) {
        if (this.$$phase) {
            throw this.$$phase + " phase is already in progress";
        }
        this.$$phase = phase;
    };

    //$model Phase destroy
    $modelGenerator.prototype.$$destroyPhase = function() {
        this.$$phase = null;
    };

    //$model Evaluate
    //@Public Function
    $modelGenerator.prototype.$evaluate = function(expr) {
        return $isFunction(expr) ? expr(this) : maskedEval(expr, this);
    };
    //$model apply
    $modelGenerator.prototype.$apply = function(fn) {
        try {
            this.$$beginPhase('$apply');
            return this.$evaluate(fn || function() {});
        } finally {
            this.$$destroyPhase();
            this.$consume();
        }
    };
    //$model Watcher
    $modelGenerator.prototype.$watch = $watch;
    // $model watchCollection
    $modelGenerator.prototype.$watchCollection = $watchCollection;
    //$model WatchList consumer
    $modelGenerator.prototype.$consume = $consume;
    //$model Equal Value checker
    $modelGenerator.prototype.$$areEqual = function(oldValue, newValue) {
        var changes = false;
        if ($isObject(newValue) || $isArray(newValue)) {
            changes = JSON.stringify(oldValue).length === JSON.stringify(newValue).length;
        } else if ($isNumber(newValue)) {
            changes = Number(oldValue) === Number(newValue);
        } else if ($isString(oldValue)) {
            changes = newValue.length === oldValue.length;
        }

        //return changes

        return changes;
    };

    //$rootModel $on event registery
    $modelGenerator.prototype.$on = function(eventName, fn) {
        var subscribers = this.$$subscribers[eventName],
            self = this;
        if (!subscribers) {
            this.$$subscribers[eventName] = subscribers = []
        }
        subscribers.push(fn);

        //return function to unsubscribe
        return function() {
            self.$$subscribers[eventName].pop();
        }
    };

    /* 
     $rootModel $model {$publish} event
     Loops through the Model child from top to bottom
     @Param {string}
     @return {FUNCTION}-@arguments {Object || String || Array}
     */

    /**
     * 
     * @param {*} name 
     * @param {*} once 
     */
    $modelGenerator.prototype.$publish = function(name, once) {
        var self = this;
        //initialize model subscribers
        function broadcastSubscribers(current, arg) {
            var child = $modelChildReferenceList.$get(current.$mId);
            if (name && current.$$subscribers[name]) {
                current.$$subscribers[name].forEach(function(fn) {
                    if (!fn.$$triggered) {
                        fn.apply(current, arg);
                        fn.$$triggered = once;
                    }
                });

                if (once) {
                    current.$$subscribers[name] = [];
                }
            }
            //loop through the child
            child.forEach(function(cur, idx) {
                //get the child model and subscribe it
                broadcastSubscribers($modelMapping.$get(child[idx]), arg);
            })
        }


        return function() {
            //broadCast the parent before the child
            broadcastSubscribers(self, arguments);
        }
    };

    /**
     * 
     * @param {*} name 
     */
    $modelGenerator.prototype.$emit = function(name) {
        var current = this,
            arg = [].concat.apply([], arguments).filter(function(a, i) { return i > 0; });
        do {
            if (name && current.$$subscribers[name]) {
                current.$$subscribers[name].forEach(function(fn) {
                    fn.apply(current, arg);
                });
            }
        } while (current = current.$parent);
    };

    //Model destroy function
    $modelGenerator.prototype.$$destroy = function() {
        this.$publish('$destroy', 1)([]);
        var id = this.$mId;
        $removeAllBinding(id);
        var parentModel = this.$parent;
        $modelChildReferenceList.$get(id).forEach(function(_id) {
            $removeAllBinding(_id);
        });

        //remove the watch list from parent model
        if (parentModel) {
            $modelChildReferenceList
                .$new(parentModel.$mId, $modelChildReferenceList
                    .$get(parentModel.$mId)
                    .filter(function(key) {
                        return key !== id;
                    }));
        }
        // free Memory
        parentModel = null;
    };

    //New Model Instance Creator
    function createNewModelInstance(isolate) {
        var childModel,
            child;

        if (isolate) {
            child = new $modelGenerator();
            child.$self = this;
        } else {
            if (this.$$isIsolated) {
                this.$$childModel = null;
            }

            if (!this.$$childModel) {
                this.$$childModel = function() {
                    this.$$watchList = [];
                    this.$$broadcast = [];
                    this.$mId = $mUID++;
                    this.$$subscribers = {};
                    this.$previous = this.$child;
                    this.$child = this.$$unObserve = this.$$childModel = null;
                    this.$$asyncQueue = [];

                    //delete observer for new model
                    delete this.$$isIsolated;
                };

                this.$$childModel.prototype = this;
            }

            child = new this.$$childModel();
            //set the child to the Parent Model
            this.$child = child;
            child.$parent = this;

            //track child Model
            if (!$modelChildReferenceList.$get(this.$mId).indexOf(child.$mId) > -1) {
                $modelChildReferenceList.$push(this.$mId, child.$mId);
            }

        }

        //reference to the watchList
        $modelMapping.$new(child.$mId, child);

        return child;
    }


    //Main Template Watcher 
    //@ref : Directive or controller to watch
    //@@Model : Scope to watch against

    function $atp($id) {
        //WatchList Functions
        $watchBlockFn($id);
        $digestAttr($id);
        $jElementProviderWatchListFn($id);
    }

    //@ElementObserver
    //Observe when an element is removed
    //from the DOM
    //remove all watchList
    //Destroy Model observer if any
    function $observeElement(ele, $id, fn) {
        if (fn) {
            $modelMapping.$get($id).$on('$destroy', fn);
        }

        _mutationObserver(ele, function() {
            var cmodel = $modelMapping.$get($id);
            if (cmodel && cmodel.$$destroy) {
                cmodel.$$destroy();
            }
        });
    }


    //@Method _MutationObserver
    // @param : HTMLELEMENT
    // @param : FUNCTION
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver,
        _mutationObserver = (function() {

            var _regsisteredEvents = [],
                observer,
                observerStarted = false;

            function triggerRemovedNodes() {
                _regsisteredEvents = _regsisteredEvents.filter(function(event) {
                    var removed = (!event.node.parentNode || (event.node.parentNode && !event.node.parentNode.parentNode));
                    if (removed) {
                        event._callback();
                    }

                    return !removed;
                });
            }

            function startObserver() {
                observer.observe(document.body, {
                    attributes: true,
                    childList: true,
                    characterData: true,
                    subtree: true
                });

                observerStarted = true;
            }

            if (MutationObserver) {
                observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        if (mutation.removedNodes.length) {
                            triggerRemovedNodes();
                        }
                    });
                });

                if (document.body) {
                    startObserver();
                }
            }



            return function(ele, CB) {
                if (!ele) {
                    return;
                }

                if (!MutationObserver) {
                    element(ele)
                        .bind('remove', CB);

                    return;
                }

                if (!observerStarted) {
                    startObserver();
                }

                _regsisteredEvents.push({
                    node: ele,
                    _callback: CB || noop
                });
            };
        })();

    /**
     * 
     * @param {*} expression 
     * @param {*} listener 
     */
    function $watchCollection(collectionExpression, listener) {
        this.$watch(collectionExpression, listener, function(newValue, oldValue) {
            var profile = getDirtySnapShot(newValue, oldValue);
            return (profile.changes.length || profile.insert.length || profile.deleted.length);
        });
    }

    /**
     * 
     * @param {*} expression 
     * @param {*} listner 
     * @param {*} core 
     */
    function $watch(expression, listener, core) {
        if ($isObject(this)) {
            var watchFn = buildWatchExpression(arguments),
                watchers = {
                    watchFn: watchFn,
                    listenerFn: listener || false,
                    core: buildCoreFn(),
                    lastValue: watchFn.call(this)
                };

            if (!this.$$watchList) {
                this.$$watchList = [];
            }
            //add the watchList
            this.$$watchList.push(watchers);
        }

        function buildCoreFn() {
            if (core && !$isFunction(core)) {
                return function(newValue, oldValue, model) {
                    return model.$$areEqual(newValue, oldValue);
                }
            }

            return core;
        }

        /**
         * 
         * @param {*} arg 
         */
        function buildWatchExpression() {
            if ($isString(expression)) {
                return function() {
                    var newValue = $modelSetterGetter(expression, this);
                    if ($isObject(newValue)) {
                        return customStringify(newValue, []);
                    }

                    return newValue;
                }
            }

            return expression;
        }
    }


    /**
     * 
     * @param {*} watch 
     * @param {*} obj 
     */
    function getWatchValue(watch, obj) {
        if ($isString(watch)) {
            return $modelSetterGetter(watch, obj);
        }

        return watch();
    }

    /**
     * 
     * @param {*}  $modelChanges
     */
    function $consume($modelChanges) {
        var watchers = this.$$watchList,
            self = this;
        self.$$beginPhase('$consume');
        if (watchers.length > 0) {
            watchers.forEach(function(obj, idx) {
                var newValue = obj.watchFn.call(self);
                if (!obj.listenerFn) {
                    return;
                }

                try {
                    if (!obj.core) {
                        obj.listenerFn(newValue, obj.lastValue, self);
                        obj.lastValue = newValue;
                    } else {
                        if (obj.core(newValue, obj.lastValue, self)) {
                            obj.listenerFn(newValue, obj.lastValue, self);
                            obj.lastValue = newValue;
                        }
                    }
                } catch (e) {
                    errorBuilder(e);
                }
            });
        }

        self.$$destroyPhase();

        /**
         * destroy watch state
         */
        return function() {
            this.$$watchList = null;
        };
    }

    //$remove All Binding
    function $removeAllBinding($id) {
        $modelMapping.$remove($id);
        $attrWatchList.$remove($id);
        $directivesProviderWatchList.$remove($id);
        //remove model Observer    
        $modelObserverList.$remove($id);
        $modelChildReferenceList.$remove($id);
        $watchBlockList.$remove($id);
    }

    /**
     * Add DigestCycle to watches
     */
    $modelMapping.$digestAll = function() {
        expect(this.$getAll()).each(function(model) {
            if (model.$$phase) {
                return;
            }

            model.$consume();
        })
    };

    $modelMapping.$digestParentAndChild = function(model) {
        digestFromChanges.call(model);
        var parent = model;
        do {
            parent.$consume();
        } while (parent = parent.$parent);
        parent = null;
    };