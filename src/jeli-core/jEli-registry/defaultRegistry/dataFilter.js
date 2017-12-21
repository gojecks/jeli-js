/**
 * OrderBy filter
 * @usage: (DEFINITION, 'propertyNames', reverse)
 * propertyNames can be separated with comma
 */

function orderByFilterFn() {
    return function(model, propertyName, reverse) {
        var _queryApi = new $query(model),
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
    return function(model, query) {
        return new $query(model).where(query);
    }
}

_defaultRegistry('j-eli', '$jFilterProvider', 'orderBy')(orderByFilterFn);
_defaultRegistry('j-eli', '$jFilterProvider', 'where')(whereFilterFn);