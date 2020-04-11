Service({
    name: 'uppercase'
})
export function upperCaseFilter() {
    this.compile = function(value) {
        return value.toUpperCase();
    };
}