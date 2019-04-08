/**
 * query : item.label for item in items
 */
commonModule
    .directive({
        selector: ':select',
        DI: ['ElementRef'],
        props: [{
            name: 'binding',
            value: ':select'
        }, {
            name: 'modelInstance',
            value: 'jModel'
        }]
    }, SelectDirective);

function SelectDirective(elementRef) {
    var valueRef, valueKey, select, groupBy, labelAs;
    this.cacheValue = [];
    this.binding = '';
    this.didInit = function() {
        var collectionExp = this.binding.match(/^\s*(.+)\s+for+\s+(.*?)\s+in\s+(.*?)\s*(\s+track\s+by\s+(.+)\s*)?$/);
        if ($isUndefined(collectionExp[3])) {
            errorBuilder("invalid condition received in j-select, expecting _item_ in _condition_ or (_idx_, _item_) in _condition_");
        }

        var _spltValue = collectionExp[2].split(/\W/g).filter(function(key) { return key.length > 1; });
        valueRef = _spltValue.pop();
        valueKey = _spltValue.pop();
        select = collectionExp[1];
        groupBy;
        labelAs;

        if ($inArray("group by", collectionExp[1])) {
            var gby = collectionExp[1].split(/\s+group+\s+by+\s/);
            collectionExp[1] = gby.shift();
            select = collectionExp[1];
            groupBy = gby.pop();
        }

        if ($inArray(" as ", collectionExp[1])) {
            var lAs = collectionExp[1].split(/\s+as+\s/);
            labelAs = lAs.pop();
            select = lAs.pop();
        } else {
            labelAs = select;
        }

        this.selectObserver(elementRef.context.evaluate(collectionExp[3]));
    };
    /**
     * auto Select an option 
     * only if modelInstance is defined
     */
    this.isSelected = function(optValue) {
        if (this.modelInstance && this.modelInstance.modelValue) {
            if ($isObject(optValue)) {
                return JSON.stringify(optValue) === JSON.stringify(this.modelInstance.modelValue);
            } else {
                return $isEqual(optValue, this.modelInstance.modelValue);
            }
        }
    };


    /**
     * 
     * @param {*} collection 
     */
    this.selectObserver = function(collection) {
        var fragment = document.createDocumentFragment(),
            nCollection = new Map(),
            self = this;
        collection.forEach(function(value, key) {
            var nModel = {};
            nModel[valueRef] = value;
            if (valueKey) {
                nModel[valueKey] = key;
            }

            var optValue = ModelSetterGetter(select, nModel),
                label = ModelSetterGetter(labelAs, nModel);
            var opt = new ElementRef(document.createElement('option'));
            opt.setProp('value', optValue);
            opt.text(label);
            if (self.isSelected(optValue)) {
                opt.setProp('selected', true);
            }
            /**
             * attach child to parent
             */
            elementRef.children.push(opt);
            if (groupBy) {
                var ref = ModelSetterGetter(groupBy, nModel);
                if (!nCollection.has(ref)) {
                    var optgroup = document.createElement('optgroup');
                    optgroup.innerText = ref;
                    nCollection.set('ref', optgroup);
                    fragment.appendChild(optgroup);
                }
                nCollection.get(ref).appendChild(opt);
            } else {
                fragment.appendChild(opt.nativeElement);
            }
        });
        /**
         * append the content
         */
        elementRef.html(fragment);
        nCollection = null;
    }
}