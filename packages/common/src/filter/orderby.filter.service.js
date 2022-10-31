import { QueryFactory } from "../services/query.service";

Service({
    name: 'orderBy'
})
export function orderByFilterFn() {
    this.compile = function(value, propertyName) {
        if (value.length < 2) {
            return value;
        }

        // model, propertyName, reverse
        var _queryApi = new QueryFactory(value);
        var newList;
        var reverse;

        /**
         * set reverse options if defined
         * only when been used as filter options in expressions
         */
        var splitedProps = propertyName.split(":");
        if (splitedProps.length > 1) {
            reverse = splitedProps.pop();
        }

        propertyName = splitedProps.pop();

        /**
         * sort option accepts multiple property
         * split the properties into array
         * as method params
         */
        newList = _queryApi.sortBy.apply(_queryApi, propertyName.split(","));
        if (reverse) {
            return newList.reverse()
        }

        return value;
    }
}