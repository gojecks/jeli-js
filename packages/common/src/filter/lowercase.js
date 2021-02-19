Service({
    name: 'lowercase'
})
export function lowerCaseFilter() {
    this.compile = function(value) {
        return (value || '').toLowerCase();
    };
}