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
        var par = this.parentNode,
            cache = [],
            $self = this,
            name,
            trackBy = '$index',
            whileExpr = $self.cloneNode.getAttribute('while'),
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
                return (($isObject(obj)) ? Object.keys(obj) : obj || []).length;
            },
            elementAppender = function(nModel, type) {
                var nElement = element($self.$createElement()).data({ ignoreProcess: [type] })[0];
                par.insertBefore(nElement, $self.cENode);
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
            obj = setTemplateValue(conf[2], this.$model),
            objLength = determineLength();

        // cleanUp our reference
        function cleanUp() {
            obj = par = cache = $self = null;
        }

        /**
         * 
         * @param {*} list 
         */
        function removeCacheElement(list) {
            expect(list).search(null, function(cacheObj) {
                if (!checkCacheObj(cacheObj.$$trackId)) {
                    cacheObj.ele.parentNode.removeChild(cacheObj.ele);
                    element(cacheObj.ele).triggerHandler('remove');
                }
            });
        }

        /**
         * 
         * @param {*} trackID 
         */
        function trackIDExistsInCache(trackID) {
            return expect($self.cache).search(null, function(cacheObj) {
                return cacheObj.$$trackId === trackID;
            });
        }

        /**
         * 
         * @param {*} trackId 
         */
        function checkCacheObj(trackId) {
            return Object.keys(obj).filter(function(key) {
                return $isEqual(trackId, obj[key]['$$obj:id']);
            }).length;
        }

        function finishedRendering() {
            var _finishRendering = hasAnyAttribute($self.cloneNode, ['on-finish-rendering', ':finish-rendering']);
            // evaluate the _finishedRendering
            if (_finishRendering) {
                var _trigger = (_finishRendering === '&') ? 'finishRendering()' : _finishRendering;
                $self.$model.$evaluate(_trigger);
            }
            $self.inProgress = false;
            // cleanUp
            cleanUp();
        }

        function checkForNewChanges() {
            return Object.keys(obj).filter(function(key) {
                if ($isObject(obj[key])) {
                    return !Object.hasOwnProperty.call(obj[key], '$$obj:id');
                }
                return false;
            });
        }

        /**
         * removed bind from unprocessed obj
         * usefull when using same obj for multiple repeaters
         */
        function checkUnProcessedRepeater() {
            if (!$self.isProcessed) {
                $self.parentNode.removeChild($self.elem);
                $self.cache = [];
                $self.elem = null;
                // set isProcessed status
                $self.isProcessed = true;
            }
        }

        checkUnProcessedRepeater();

        if (obj && (!$isEqual(this.cache.length, objLength) || checkForNewChanges().length)) {
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

                    obj = new $query(obj).where(whileExpr);
                }
            }


            //remove cache element and free up memory
            removeCacheElement(this.cache);

            //render
            expect(obj).each(function(item, idx) {
                if (!trackIDExistsInCache(item['$$obj:id'])) {
                    //check if expression has a while
                    elementAppender(setTempScope(item, idx), $self.cSelector);
                }
            });

            this.cache = cache.concat();

            // trigger rendering FN
            finishedRendering();
        } else {
            this.inProgress = false;
        }
    }
};

$defaultDirectiveProvider.push({
    selector: "j-for",
    priority: 10,
    canDetachElement: true,
    isDefault: true,
    sample: "user in users | orderBy:property:reverse | where:'user.id === 1'"
});

$defaultDirectiveProvider.push({
    selector: "j-do",
    priority: 10,
    canDetachElement: true,
    isDefault: true,
    where: "id == 1"
});

defaultElementInitializer.prototype['for'] = jDoForDirective;
defaultElementInitializer.prototype['do'] = jDoForDirective;