// upperCaseFilter
function upperCaseFilter() {
    this.compile = function(value) {
        return value.toUpperCase();
    };
}

// lowerCaseFilter
function lowerCaseFilter() {
    this.compile = function(value) {
        return value.toLowerCase();
    };
}

function capitalizeFilter() {
    this.compile = function(value) {
        return value.charAt(0).toUpperCase() + value.substr(1, value.length);
    };
}