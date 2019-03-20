/**
 * JSON Filter FN
 */
function jsonFilterFn() {
    this.compile = function(value, spacing) {
        return typeof value === "object" ? JSON.stringify(value, null, spacing) : value;
    };
}