import { isarray, isobject } from 'js.helpers/helpers';

Service({
        name: 'query'
    })
    /**
     * OrderBy filter
     * @usage: (DEFINITION, 'propertyNames', reverse)
     * propertyNames can be separated with comma
     */
export function QueryFactory(data) {
    this.sortBy = function() {
        var sortArguments = arguments;
        if (isarray(data) && isobject(data[0])) {
            return data.sort(function(obj1, obj2) {
                /*
                 * save the arguments object as it will be overwritten
                 * note that arguments object is an array-like object
                 * consisting of the names of the properties to sort by
                 */
                var props = sortArguments,
                    i = 0,
                    result = 0,
                    numberOfProperties = props.length,
                    compare = _compare(obj1, obj2);
                /* try getting a different result from 0 (equal)
                 * as long as we have extra properties to compare
                 */
                while (result === 0 && i < numberOfProperties) {
                    result = compare(props[i]);
                    i++;
                }

                return result;
            });
        }

        function _compare(a, b) {
            var sortOrder = 1;
            return function(property) {
                var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                return result * sortOrder;
            };
        }

        return data;
    };

    return this;
};