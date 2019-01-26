/**
 * JSON Filter FN
 */
function jsonFilterFn() {
    this.compile = function(value, spacing) {
        return $isObject(value) ? JSON.stringify(value, null, spacing) : value;
    };
}