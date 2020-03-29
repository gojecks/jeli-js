Service({
    name: 'uppercase'
}, upperCaseFilter);

function upperCaseFilter() {
    this.compile = function(value) {
        return value.toUpperCase();
    };
}