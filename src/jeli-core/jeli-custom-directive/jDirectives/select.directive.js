$defaultDirectiveProvider.push({
    selector: "j-select",
    priority: 4,
    isDefault: true,
    $allowType: 'AE'
});
/**
 * query : item.name for item in items
 */
defaultElementInitializer.prototype['select'] = function() {
    var collectionExp = this.checker.match(/^\s*(.+)\s+for+\s+(.*?)\s+in\s+(.*?)\s*(\s+track\s+by\s+(.+)\s*)?$/);
    if ($isUndefined(collectionExp[3])) {
        errorBuilder("invalid condition received in " + this.cSelector + ", expecting _item_ in _condition_ or (_idx_, _item_) in _condition_");
    }

    var _spltValue = collectionExp[2].split(/\W/g).filter(function(key) { return key.length > 1; }),
        valueRef = _spltValue.pop(),
        valueKey = _spltValue.pop(),
        select = collectionExp[1],
        groupBy,
        labelAs;

    if ($inArray("group by", collectionExp[1])) {
        var gby = collectionExp[1].split(/\s+group+\s+by+\s/);
        collectionExp[1] = gby.shift();
        groupBy = gby.pop();
    } else if ($inArray(" as ", collectionExp[1])) {
        var lAs = collectionExp[1].split(/\s+as+\s/);
        labelAs = lAs.pop();
        select = lAs.pop();
    }
    var selectElement = this.elem;

    function selectObserver(collection) {
        var html = '',
            nCollection = {};
        expect(collection).each(function(value, key) {
            var nModel = {};
            nModel[valueRef] = value;
            if (valueKey) {
                nModel[valueKey] = key;
            }

            var opt = '<option value="' + $modelSetterGetter(select, nModel) + '">' + $modelSetterGetter((labelAs || select), nModel) + '</option>';
            if (groupBy) {
                var ref = $modelSetterGetter(groupBy, nModel);
                if (!nCollection.hasOwnProperty(ref)) {
                    nCollection[ref] = []
                }
                nCollection[ref].push(opt);
            } else {
                html += opt;
            }
        });

        if (groupBy) {
            expect(nCollection).each(function(value, key) {
                html += '<optgroup label="' + key + '">\n';
                html += value.join("\n");
                html += '</optgroup>';
            });
        }

        selectElement.innerHTML = html;
        html = '';
        nCollection = null;
    }

    selectObserver(setTemplateValue(collectionExp[3], this.$model));
    this.$model.$watchCollection(collectionExp[3], selectObserver);
    this.$unWatch();
};