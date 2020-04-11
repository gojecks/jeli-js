import { isundefined, inarray } from 'js.helpers/helpers';
/**
 * query : item.label for item in items
 */
Directive({
    selector: 'select',
    DI: ['ElementRef?'],
    props: ['select', 'optionsLabel']
})
export function SelectDirective(elementRef) {
    var valueRef, valueKey, select, groupBy, labelAs;
    this.cacheValue = [];
    this.optionsLabel = null;
    this.optionsData = [];

    this.didInit = function() {
        this.createSelectOptions();
    };
    /**
     * 
     * @param {*} collection 
     */
    this.createSelectOptions = function() {
        var fragment = document.createDocumentFragment(),
            nCollection = new Map(),
            _this = this;
        /**
         * 
         * @param {*} value 
         * @param {*} key 
         */
        function createCollection(value, key) {
            var nModel = {};
            nModel[valueRef] = value;
            if (valueKey) {
                nModel[valueKey] = key;
            }

            var optValue = ModelSetterGetter(select, nModel),
                label = ModelSetterGetter(labelAs, nModel);
            // check for optionsLabel
            if (_this.optionsLabel) {
                label = _this.optionsLabel[label];
            }

            var opt = new ElementRef(document.createElement('option'), elementRef, {});
            opt.setProp('value', optValue);
            opt.text(label);

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

            /**
             * attach child to parent
             */
            elementRef.children.add(opt);
        }

        /**
         * create collection
         * append the content
         */
        this.optionsData.forEach(createCollection);
        elementRef.html(fragment);
        nCollection = null;
    }

    Object.defineProperties(this, {
        select: {
            set: function(binding) {
                var collectionExp = binding.match(/^\s*(.+)\s+for+\s+(.*?)\s+in\s+(.*?)\s*(\s+track\s+by\s+(.+)\s*)?$/);
                if (isundefined(collectionExp[3])) {
                    errorBuilder("invalid condition received in select, expecting _item_ in iteratable or (_idx_, _item_) in iteratable");
                }

                var _spltValue = collectionExp[2].split(/\W/g).filter(function(key) { return key.length > 1; });
                valueRef = _spltValue.pop();
                valueKey = _spltValue.pop();
                select = collectionExp[1];
                groupBy;
                labelAs;

                if (inarray("group by", collectionExp[1])) {
                    var gby = collectionExp[1].split(/\s+group+\s+by+\s/);
                    collectionExp[1] = gby.shift();
                    select = collectionExp[1];
                    groupBy = gby.pop();
                }

                if (inarray(" as ", collectionExp[1])) {
                    var lAs = collectionExp[1].split(/\s+as+\s/);
                    labelAs = lAs.pop();
                    select = lAs.pop();
                } else {
                    labelAs = select;
                }

                this.optionsData = elementRef.context.evaluate(collectionExp[3]);
            }
        }
    });
}