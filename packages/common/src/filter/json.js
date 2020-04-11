/**
 * JSON Filter FN
 */
Service({
    name: 'json'
})
export function jsonFilterFn() {
    this.compile = function(value, spacing) {
        return typeof value === "object" ? JSON.stringify(value, null, parseInt(spacing || '0')) : value;
    };
}