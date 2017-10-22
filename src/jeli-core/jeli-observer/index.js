//background model Watcher

function $backgroundModelWatcher() {
    findInList.call($modelMapping.$getAll(), function(idx, obj) {
        obj.$consume();
    });
}

//customStringify Fn
function customStringify(obj, ignoreList) {
    var cache = [],
        _custom = JSON.stringify(obj, function(key, value) {
            if ($isObject(value) && !$isNull(value)) {
                if ($inArray(value, cache)) {
                    // Circular reference found, discard key
                    return;
                }
                // Store value in our collection
                cache.push(value);
            }

            if ($inArray(key, ignoreList)) {
                return;
            }

            return value;
        });

    cache = null;

    return _custom;
}

//Object Checker
function getDirtySnapShot(watchObj, _currentWatch) {
    var cdata = JSON.parse(watchObj),
        cnt = 0;

    function snapshot() {
        var out = { changes: [], insert: [], deleted: [] };
        //search through the object
        function profiler(obj1, obj2, reProfile, path) {
            path = path || [];
            var tp;
            expect(obj1).search(null, function(obj, prop) {
                //addd new path
                if (obj2 && obj2.hasOwnProperty(prop) && !reProfile) {
                    tp = path.concat(prop);
                    if (obj && typeof obj === 'object' && [Date, RegExp].indexOf(obj.constructor) == -1) {
                        profiler(obj1[prop], obj2[prop], reProfile, path.concat(prop));
                    } else {
                        if (obj1[prop] !== obj2[prop]) {
                            out.changes.push({
                                oldValue: obj2[prop],
                                newValue: obj1[prop],
                                path: tp.join('.')
                            });

                            //set the record
                            obj2[prop] = obj1[prop];
                        }
                    }
                } else {
                    //new record found
                    tp = path.concat(prop);
                    var pushData = ({
                        newValue: obj1[prop],
                        oldValue: (obj2) ? obj2[prop] : obj2,
                        path: tp.join('.')
                    });

                    if (!reProfile) {
                        out.insert.push(pushData);
                        //reset new value on latest object
                        setNewValue(obj2, obj1, prop, path);
                    } else {
                        out.deleted.push(pushData);

                        delete obj1[prop];
                    }
                }
            });
        }

        //Observer Value setter
        function setNewValue(diff, against, prop, path) {
            try {
                diff[prop] = against[prop];
            } catch (e) {
                var last = path.pop(),
                    paths = path,
                    context = _currentWatch;
                paths.forEach(function(cprop) {
                    context = context[cprop];
                });
                context[last] = against;
            }

        }

        //start profiler
        profiler(cdata, _currentWatch);
        //check for deletedObj
        if (JSON.stringify(_currentWatch).length > watchObj.length) {
            profiler(_currentWatch, cdata, true);
        }

        // free up memory
        cdata = null;
        //return changes
        return out;
    }

    return snapshot();
}

//generic WatcherObject
var _ObserverCount = 0;

function jObserver(ignoreList, callback) {
    var _stat = {
        _Id: _ObserverCount++,
        lastCount: 0,
        _watchObj: {}, // hold list of object to watch
        _ignoreList: ignoreList || []
    };

    //WatchChanges
    function WatchChanges() {
        for (var watch in _stat._watchObj) {
            performCheck(_stat._watchObj[watch]);
        }

        function performCheck(_current) {
            var watchObj = customStringify(_current._main, _current._ignoreList),
                profile = getDirtySnapShot(watchObj, _current._clone),
                changesFound = (profile.changes.length || profile.insert.length || profile.deleted.length);

            if (profile) {
                if (changesFound > _stat.lastCount) {
                    _current.callback.call(_current._main, profile);

                }
            }

            watchObj = profile = null;
        }


        _stat._interval = setTimeout(WatchChanges, _stat.timer);
    }

    // ignoreList And Callback are OPTIONAL
    // fallback to parent arguments

    this.add = function(obj, refid, _ignoreList, _callback) {
        // check if Object have been added
        if (_stat._watchObj[refid]) {
            return;
        }
        //if Watch obj is an Array or Obj
        if (typeof obj !== 'object') {
            errorBuilder('Invalid Observer');
        }

        //build watch list
        var cdata = JSON.parse(customStringify(obj, ignoreList));

        // add our watch obj
        _stat._watchObj[refid] = ({
            _main: obj,
            _clone: cdata,
            callback: _callback || callback || noop,
            _ignoreList: _ignoreList || ignoreList
        });
    };

    //Observer Start
    this.start = function(timer) {
        //set timer
        _stat.timer = timer || 10;

        //setTimeInterval
        WatchChanges();
    };


    this.$destroy = function() {
        if (_stat._interval) {
            _stat.isDestroyed = true;
            _ObserverCount--;
        }
    };

    this.removeWatch = function(_id) {
        delete _stat._watchObj[_id];
    };
}

var ignoreList = ["$mId", "$$isIsolated", "$$asyncQueue", "$$subscribers", "$previous", "$next", "$$watchList", "$$phase", "$child", "$$broadcast", "$parent", "$$childModel", "$$unObserve", "$self"];

//disgest from changes
function digestFromChanges(changes) {

    if (!this.$$phase) {
        this.$consume();
    }

    //disgest other binding
    var _childReference = $modelChildReferenceList.$get(this.$mId);
    _childReference.forEach(function(idx) {
        var current = $modelMapping.$get(idx);
        //only perform digest if current state is available
        if (current && current.$consume) {
            digestFromChanges.call(current);
        }
    });

    _childReference = null

}


//Observer for complete change in Object
var _modelObserver = new jObserver(ignoreList, digestFromChanges);

function $observe(model, watch) {
    // add to our observer
    _modelObserver.add(model, model.$mId);

    if (!_modelObserver.started) {
        //start observer
        _modelObserver.start(10);
        _modelObserver.started = true;
    }

    watch(model);
}