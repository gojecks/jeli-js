Service({
    name: 'lowercase'
}, lowerCaseFilter);

function lowerCaseFilter() {
    this.compile = function(value) {
        return value.toLowerCase();
    };
}