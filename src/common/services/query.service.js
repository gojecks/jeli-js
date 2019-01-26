/**
 * OrderBy filter
 * @usage: (DEFINITION, 'propertyNames', reverse)
 * propertyNames can be separated with comma
 */
function QueryFactory(data) {
    this.sortBy = function() {
        var sortArguments = arguments;
        if ($isArray(data)) {
            return data.sort(function(obj1, obj2) {
                /*
                 * save the arguments object as it will be overwritten
                 * note that arguments object is an array-like object
                 * consisting of the names of the properties to sort by
                 */
                var props = sortArguments,
                    i = 0,
                    result = 0,
                    numberOfProperties = props.length;
                /* try getting a different result from 0 (equal)
                 * as long as we have extra properties to compare
                 */
                while (result === 0 && i < numberOfProperties) {
                    result = compare(props[i])(obj1, obj2);
                    i++;
                }

                return result;
            });
        }

        function compare(property) {
            var sortOrder = 1;
            return function(a, b) {
                var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                return result * sortOrder;
            };
        }

        return data;
    };

    this.where = function(data) {

    };

    return this;
};

function orderByFilterFn(query) {
    return function(model, propertyName, reverse) {
        var _queryApi = query(model),
            newList;

        /**
         * set reverse options if defined
         * only when been used as filter options in expressions
         */
        if (arguments.length === 2 && expect(propertyName).contains(':')) {
            reverse = propertyName.split(":")[1];
        }

        /**
         * sort option accepts multiple property
         * split the properties into array
         * as method params
         */
        newList = _queryApi.sortBy.apply(_queryApi, propertyName.split(":")[0].split(","));
        if (reverse) {
            return newList.reverse()
        }

        return newList;
    }
}

/**
 * Where filter
 * @usage: (DEFINITION, "id === 'a'")
 * 
 */
function whereFilterFn() {
    this.compile = function(model, query) {
        return new $query(model).where(query);
    }
}