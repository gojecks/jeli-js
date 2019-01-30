/**
 * @Directive <j-for> <j-do>
 * Compiles the required element based on the item provided
 * elements are removed from the DOM if condition is not met
 * @Usage :
 * allowed type Attirbute and Element
 */
commonModule
    .directive({
        selector: ':for',
        transplace: "element",
        DI: ['ElementRef', 'Observables'],
        props: [{
                name: 'binding',
                value: ':for'
            },
            {
                name: 'trackBy',
                value: 'key'
            }
        ]
    }, ForDirective);

function ForDirective(elementRef, Observables) {
    this.binding = '';
    this.name = '';
    this.trackBy;
    this.$index = '$index';
    this.cache = [];
    this.fragment = document.createDocumentFragment();
    this.unsubscribe = null;
    this.didInit = function() {
        /**
         * removed bind from unprocessed obj
         * usefull when using same obj for multiple repeaters
         */
        this.conf = this.binding.match(/^\s*(.+)\s+in\s+(.*?)\s*(\s+track\s+by\s+(.+)\s*)?$/);
        this.trackBy = this.trackBy || this.conf[4];
        /**
         * throw error with invalid configuration
         */
        if ($isUndefined(this.conf[2])) {
            errorBuilder("invalid condition received in jFor, expecting _item_ in _condition_ or (_idx_, _item_) in _condition_");
        }

        var nsplit = $removeWhiteSpace(this.conf[1]).split(/\W/g);
        if (nsplit.length > 1) {
            nsplit.pop();
            nsplit.shift();
            this.$index = nsplit.shift();
        }

        this.name = nsplit.pop();
        /**
         * register listener
         */
        this.unsubscribe = Observables
            .observeForCollection(this.conf[2], this.listenerFn.bind(this));
    };

    this.listenerFn = function(result) {
        //remove cache element and free up memory
        this.removeCacheElement(result.deleted);
        // update cache
        this.updateCacheModel(result.changes);
        //render
        var len = result.insert.length,
            inc = 0,
            cacheLen = this.cache.length;
        while (len > inc) {
            this.elementAppender(result.insert[inc]);
            inc++;
        }
        /**
         * Insert our element
         */
        elementRef.insertAfter(this.fragment, this.getLastCompiledElement(cacheLen));
    };

    this.getLastCompiledElement = function(cacheLen) {
        if (cacheLen) {
            return this.cache[cacheLen - 1].nativeElement;
        } else {
            return elementRef.nativeNode;
        }
    }

    this.elementAppender = function(item) {
        var context = elementRef.context.new({}),
            clone = elementRef.clone(context, true);

        //set the Object key
        //trackBy can only be set when its declared in configuration
        context
            .updateModel(this.name, item.value)
            .updateModel(this.$index, item.key);
        HtmlParser.transverse(clone);
        /**
         * store to our cache
         */
        this.cache.push(clone);
        this.fragment.appendChild(clone.nativeElement);
    };

    this.checkDuplicateRepeater = function(repeater) {
        if (repeater && !conf[4] && $isArray(repeater)) {
            if (noDubs(repeater).length < repeater.length) {
                errorBuilder("Duplicate values are not allowed in repeaters. Use 'track by' expression to specify unique keys");
            }
        }
    };


    /**
     * 
     * @param {*} list 
     */
    this.removeCacheElement = function(deleted) {
        this.cache = this.cache.filter(function(cacheItem, key) {
            var exists = $inArray(key, deleted);
            if (exists) {
                cacheItem.context.destroy();
                cacheItem.remove();
            }

            return !exists;
        });
    };

    /**
     * 
     * @param {*} prop 
     * @param {*} idx 
     */
    this.updateCacheModel = function(changes) {
        var self = this;
        changes.forEach(function(key) {
            var cacheElementRef = self.cache[key];
            if (!$isEqual(cacheElementRef.context.evaluate(self.$index), key)) {
                cacheElementRef.context.updateModel(self.$index, key);
                cacheElementRef.context.tick();
            }
        });
    };

    /**
     * viewDidDestroy
     */
    this.viewDidDestroy = function() {
        this.unsubscribe && this.unsubscribe();
        while (this.cache.length) {
            var cacheItem = this.cache.pop();
            cacheItem.context.destroy();
            cacheItem.remove();
        }
    };
}