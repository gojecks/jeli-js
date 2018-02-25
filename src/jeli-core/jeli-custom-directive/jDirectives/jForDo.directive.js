/**
 * @Directive <j-for> <j-do>
 * Compiles the required element based on the item provided
 * elements are removed from the DOM if condition is not met
 * @Usage :
 * allowed type Attirbute and Element
 */
var $hashKey = 0

function jDoForDirective() {
    var conf = this.checker.match(/^\s*(.+)\s+in\s+(.*?)\s*(\s+track\s+by\s+(.+)\s*)?$/),
        repeater;
    /**
     * throw error with invalid configuration
     */
    if ($isUndefined(conf[2])) {
        errorBuilder("invalid condition received in " + this.cSelector + ", expecting _item_ in _condition_ or (_idx_, _item_) in _condition_");
    }

    function checkDuplicateRepeater(repeater) {
        if (repeater && !conf[4] && $isArray(repeater)) {
            if (noDubs(repeater).length < repeater.length) {
                errorBuilder("Duplicate values are not allowed in repeaters. Use 'track by' expression to specify unique keys");
            }
        }
    }

    function getRepeaters(model) {
        if (!isNaN(parseInt(conf[2]))) {
            return element(new Array(parseInt(conf[2]))).map(function(_, idx) { return idx + 1; }).get(0);
        }


        return setTemplateValue(conf[2], model);
    }

    //proceed with the checker
    if (!this.inProgress) {
        this.inProgress = true;
        /**
         * removed bind from unprocessed obj
         * usefull when using same obj for multiple repeaters
         */
        if (!this.isProcessed) {
            this.parentNode.removeChild(this.elem);
            this.cache = [];
            this.elem = null;
            // set isProcessed status
            this.isProcessed = true;
            this.$debounce = debounce(function($self) {
                repeater = getRepeaters($self.$model);
                checkDuplicateRepeater(repeater);
                var profile = getDirtySnapShot(customStringify({ repeater: repeater }, []), { repeater: $self.lastProcessedValue }),
                    changes = ((profile.changes.length || profile.insert.length || profile.deleted.length));
                if (changes) {
                    $self.lastProcessedValue = copy(repeater, true);
                    listenerFn.call($self, profile);
                } else {
                    $self.inProgress = false;
                }
            }, 5)
        }

        this.$debounce(this);
    }

    /**
     * inherits model instance
     */
    function listenerFn() {
        var cache = this.cache || [],
            $self = this,
            name,
            $index = '$index',
            trackBy = conf[4] || this.$attr.getAttribute(':key'),
            whileExpr = this.$attr.getAttribute('while'),
            $compilerListFn = [],
            setTempScope = function(item, i) {
                var temp = $self.$model.$new();
                temp[name] = item;
                //set the Object key
                //trackBy can only be set when its declared in configuration
                temp[$index] = !isNaN(Number(i)) ? Number(i) : i;

                curHash = getHash(temp, i);
                if ($isObject(item) && !item.hasOwnProperty('$$obj:id')) {
                    item['$$obj:id'] = curHash;
                }

                return temp;
            },
            getHash = function(item, prop) {
                var hash = item['$$obj:id'] || ($hashKey + ":" + prop);
                if (trackBy) {
                    hash = item.$evaluate(trackBy) + ":" + prop;
                }

                $hashKey++;

                return hash;
            },
            configureTrackByAndOrderBy = function() {
                var nsplit = $removeWhiteSpace(conf[1]).split(/\W/g);
                if (nsplit.length > 1) {
                    nsplit.pop();
                    nsplit.shift();
                    $index = nsplit.shift();
                }

                name = nsplit.pop();
            },
            elementAppender = function(nModel, type) {
                var nElement = element($self.$createElement()).data({ ignoreProcess: [type] })[0];
                $self.parentNode.insertBefore(nElement, $self.cENode);
                $templateCompiler(nElement, true)(nModel);
                /**
                 * store to our cache
                 */
                cache.push({
                    ele: nElement,
                    $$trackId: curHash,
                    $$index: cache.length,
                    $$model: nModel.$mId
                });

                //Observe the element
                $observeElement(nElement, nModel.$mId);
                nElement = null;
            };

        // cleanUp our reference
        function cleanUp() {
            repeater = cache = $self = null;
        }

        /**
         * 
         * @param {*} list 
         */
        function removeCacheElement(force) {
            cache = cache.filter(function(cacheObj) {
                if (!checkCacheObj(cacheObj.$$trackId)) {
                    var _model = $modelMapping.$get(cacheObj['$$model']);
                    if ($isObject(_model)) {
                        _model.$$destroy();
                        _model = null;
                    }
                    element(cacheObj.ele).remove();
                    return false;
                }

                return true;
            });
        }

        /**
         * 
         * @param {*} trackID 
         */
        function trackIDExistsInCache(trackID) {
            return $self.cache.some(function(cacheObj) {
                return cacheObj.$$trackId === trackID;
            });
        }

        /**
         * 
         * @param {*} trackId 
         */
        function checkCacheObj(trackId) {
            return expect(repeater).search(null, function(item) {
                return trackId === item['$$obj:id'];
            });
        }


        /**
         * 
         * @param {*} idx 
         */
        function updateCacheModel(prop, idx) {
            var curModel = $modelMapping.$get(cache[idx]['$$model']);
            if ($isObject(curModel) && !$isEqual(curModel[$index], prop)) {
                curModel[$index] = prop;
                setTimeout(function() {
                    curModel.$consume()
                }, 0);
            }
        }

        function finishedRendering() {
            var _finishRendering = hasAnyAttribute($self.cloneNode, ['on-finish-rendering', ':finish-rendering']);
            // evaluate the _finishedRendering
            if (_finishRendering) {
                var _trigger = (_finishRendering === '&') ? 'finishRendering()' : _finishRendering;
                $self.$model.$evaluate(_trigger);
            }
            $self.inProgress = false;
            $self.cache = cache.concat();
            // cleanUp
            cleanUp();
        }

        //initialize configureTrackByAndOrderBy()
        configureTrackByAndOrderBy();
        //j-Do Element require while condition to function
        //Make sure all requirement are met
        //else throw an error
        if ($isEqual(this.type, 'do')) {
            if (!whileExpr) {
                errorBuilder('jDo requires while condition to function');
            } else {
                whileExpr = this.$model.$evaluate(whileExpr);
                if ($isFunction(whileExpr)) {
                    whileExpr = whileExpr();
                }

                repeater = new $query(repeater).where(whileExpr);
            }
        }

        //remove cache element and free up memory
        removeCacheElement(false);
        //render
        expect(repeater).each(function(item, prop, idx) {
            if (!item.hasOwnProperty('$$obj:id') || !trackIDExistsInCache(item['$$obj:id'])) {
                //check if expression has a while
                elementAppender(setTempScope(item, prop), $self.cSelector);
            } else {
                updateCacheModel(prop, idx);
            }
        });

        // trigger rendering FN
        finishedRendering();
    }
};


$defaultDirectiveProvider.push({
    selector: "j-for",
    priority: 10,
    transplace: true,
    isDefault: true,
    sample: "user in users | orderBy:property:reverse | where:'user.id === 1'"
});

$defaultDirectiveProvider.push({
    selector: "j-do",
    priority: 10,
    transplace: true,
    isDefault: true,
    where: "id == 1"
});

defaultElementInitializer.prototype['for'] = jDoForDirective;
defaultElementInitializer.prototype['do'] = jDoForDirective;