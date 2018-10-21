/**
 * 
 * @param {*} obj 
 * @param {*} ignoreList 
 */
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

/**
 * 
 * @param {*} watchObj 
 * @param {*} _currentWatch 
 * @param {*} ignoreList 
 */
function getDirtySnapShot(watchObj, _currentWatch, ignoreList) {
    var cdata,
        cnt = 0;
    ignoreList = ignoreList || [];

    try {
        cdata = JSON.parse(watchObj)
    } catch (e) {
        cdata = watchObj;
    }

    var isObjectType = $isObject(cdata);

    function forceout(out) {
        if (cdata) {
            out.insert.push(cdata);
            out.$index.insert = Object.keys(cdata);
            cdata = null;
        }
        return out;
    }

    function snapshot() {
        var out = {
            changes: [],
            insert: [],
            deleted: [],
            $index: {
                changes: [],
                insert: [],
                deleted: []
            }
        };

        /**
         * 
         * @param {*} obj1 
         * @param {*} obj2 
         * @param {*} reProfile 
         * @param {*} path 
         */
        function profiler(obj1, obj2, reProfile, path) {
            path = path || [];
            var tp;
            expect(obj1).each(function(obj, prop) {
                if (ignoreList.length && $inArray(prop, ignoreList)) {
                    return;
                }

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
                            out.$index.changes.push(prop);
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
                        // only insert index of parent object
                        if (cdata.hasOwnProperty(prop)) {
                            out.$index.insert.push(prop);
                        }
                        out.insert.push(pushData);
                        //reset new value on latest object
                        setNewValue(obj2, obj1, prop, path);
                    } else {
                        out.deleted.push(pushData);
                        out.$index.deleted.push(prop);
                        delete obj1[prop];
                    }
                }
            });
        }

        /**
         * 
         * @param {*} diff 
         * @param {*} against 
         * @param {*} prop 
         * @param {*} path 
         */
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

        // _cache doesn't exists
        if (!_currentWatch) {
            return forceout(out);
        }

        // cdata is Array and cache length is greater than cdata
        // case: when property is removed from ArrayList 
        //check for deletedObj
        var cdataLen = Object.keys(cdata),
            curWtachLen = Object.keys(_currentWatch);
        if (curWtachLen.length > cdataLen.length) {
            expect(_currentWatch).each(function(item, prop) {
                var isdeleted;
                if (isObjectType) {
                    isdeleted = !cdata.hasOwnProperty(prop);
                } else {
                    isdeleted = watchObj.indexOf(JSON.stringify(item)) < 0;
                }

                if (isdeleted) {
                    out.$index.deleted.push(prop);
                    out.deleted.push(item);
                }
            });

            if (curWtachLen.length > (cdataLen.length + out.$index.deleted.length) && !isObjectType.length) {
                out.deleted = _currentWatch.splice(cdataLen.length);
                out.$index.deleted = curWtachLen.splice(cdataLen.length);
            }

            if ($isEqual(curWtachLen.length, out.$index.deleted.length)) {
                return forceout(out);
            }
        }

        //start profiler
        profiler(cdata, _currentWatch);

        // free up memory
        cdata = null;
        //return changes
        return out;
    }

    return snapshot();
}

//generic WatcherObject
var _ObserverCount = 0;
var ignoreList = ["$mId", "$$isIsolated", "$$asyncQueue", "$$subscribers", "$previous", "$next", "$$watchList", "$$phase", "$child", "$$broadcast", "$parent", "$$childModel", "$$unObserve", "$self"];

/**
 * 
 * @param {*} ignoreList 
 * @param {*} callback 
 */
function jObserver(ignoreList, callback) {
    var _stat = {
        _Id: _ObserverCount++,
        lastCount: 0,
        _watchObj: {}, // hold list of object to watch
        _ignoreList: ignoreList || [],
        inProgress: false,
        _count: 0
    };

    //WatchChanges
    function WatchChanges() {
        if (_stat.inProgress) {
            return;
        }

        _stat.inProgress = true;
        var idx = 0,
            totalWatch = _stat._count;

        expect(_stat._watchObj).each(performCheck);

        function performCheck(_current) {
            var watchObj = customStringify(_current._main, _current._ignoreList),
                profile = getDirtySnapShot(watchObj, _current._clone),
                changesFound = (profile.changes.length || profile.insert.length || profile.deleted.length);

            if (profile) {
                if (changesFound > _stat.lastCount) {
                    _current.callback.call(_current._main, profile);

                }
            }

            idx++;
            watchObj = profile = null;
            if (idx === totalWatch) {
                _stat.inProgress = false;
                _stat._interval = setTimeout(WatchChanges, _stat.timer);
            }
        }
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

        _stat._count++;
    };

    //Observer Start
    this.start = function(timer) {
        //set timer
        _stat.timer = timer || 100;

        //setTimeInterval
        WatchChanges();
    };

    /**
     * Trigger the watch changes
     */
    this.digest = WatchChanges;


    this.$destroy = function() {
        if (_stat._interval) {
            _stat.isDestroyed = true;
            _ObserverCount--;
        }
    };

    this.removeWatch = function(_id) {
        delete _stat._watchObj[_id];
        _stat._count--;
    };
}

//disgest from changes
function digestFromChanges(changes) {

    if (this.$$phase) {
        return;
    }

    //disgest other binding
    this.$consume(changes);
    var _childReference = $modelChildReferenceList.$get(this.$mId);
    _childReference.forEach(function(idx) {
        var current = $modelMapping.$get(idx);
        //only perform digest if current state is available
        if (current) {
            digestFromChanges.call(current, changes);
        }
    });

    _childReference = null

}