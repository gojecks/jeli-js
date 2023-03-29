import { isobject, isfunction, isundefined } from "@jeli/helpers";

Service({
    name: 'filter'
})
export function FilterPipe() {
    this.compile = function(array, expression) {
        if (!Array.isArray(array)) {
            if (array == null)
                return array;
            console.error('expected Array type but got ' + typeof(array));
        }

        var expressionType = expression !== null ? typeof(expression) : 'null';
        var predicateFn = null;
        var matchAny;
        switch (expressionType) {
            case ('function'):
                predicateFn = expression;
                break;
            case 'boolean':
            case 'null':
            case 'number':
            case 'string':
                matchAny = true;
            case ('object'):
                predicateFn = createPredicator(expression, matchAny);
                break;
            default:
                return array;
        }

        return Array.prototype.filter.call(array, predicateFn);
    }

    function createPredicator(expression, matchAny) {
        return function(item) {
            if (isobject(expression)) {
                for (var key in expression) {
                    var expectedValue = expression[key];
                    if (isfunction(expectedValue) || isundefined(expectedValue)) {
                        continue;
                    }

                    if (expectedValue != item[key]) {
                        return false;
                    }
                }

                return true;
            }
        }
    }
}