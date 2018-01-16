/**
 * @Directive <j-for> <j-do>
 * Compiles the required element based on the item provided
 * elements are removed from the DOM if condition is not met
 * @Usage :
 * allowed type Attirbute and Element
 */
var $hashKey = 0

function jDoForDirective() {
    var conf = this.checker.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)?\s*$/);
    /**
     * throw error with invalid configuration
     */
    if (conf.length < 2) {
        errorBuilder("invalid condition received in " + this.cSelector + ", expecting _item_ in _condition_ or (_idx_, _item_) in _condition_");
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
        }

        var repeater = setTemplateValue(conf[2], this.$model),
            profile = getDirtySnapShot({ repeater: repeater }, { repeater: this.lastProcessedValue });
        if (profile.changes.length || profile.insert.length || profile.deleted.length) {
            this.lastProcessedValue = copy(repeater, true);
            listenerFn.call(this, profile);
        } else {
            this.inProgress = false;
        }

    }

    /**
     * inherits model instance
     */
    function listenerFn() {
        var cache = this.cache || [],
            $self = this,
            name,
            trackBy = '$index',
            whileExpr = this.$attr.getAttribute('while'),
            $compilerListFn = [],
            setTempScope = function(item, i) {
                var temp = $self.$model.$new();
                temp[name] = item;
                curHash = (item['$$obj:id'] || $hashKey + ":" + i);
                $hashKey++;

                if ($isObject(item) && !item.hasOwnProperty('$$obj:id')) {
                    item['$$obj:id'] = curHash;
                }
                //set the Object key
                //trackBy can only be set when its declared in configuration
                temp[trackBy] = !isNaN(Number(i)) ? Number(i) : i;

                return temp;
            },
            configureTrackByAndOrderBy = function() {
                var nsplit = $removeWhiteSpace(conf[1]).split(/\W/g);
                if (nsplit.length > 1) {
                    nsplit.pop();
                    nsplit.shift();
                    trackBy = nsplit.shift();
                }

                name = nsplit.pop();
            },
            determineLength = function() {
                return (($isObject(repeater)) ? Object.keys(repeater) : repeater || []).length;
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
                    $$index: cache.length
                });

                //Observe the element
                $observeElement(nElement, nModel.$mId);
                nElement = null;
            },
            objLength = determineLength();

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
        expect(repeater).each(function(item, idx) {
            if (!item['$$obj:id'] || !trackIDExistsInCache(item['$$obj:id'])) {
                //check if expression has a while
                elementAppender(setTempScope(item, idx), $self.cSelector);
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