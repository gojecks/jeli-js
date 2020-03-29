Service({
    name: 'capitalize'
}, capitalizeFilter);

function capitalizeFilter() {
    this.compile = function(value) {
        return value.charAt(0).toUpperCase() + value.substr(1, value.length);
    };
}