Service({
    name: 'capitalize'
})
export function capitalizeFilter() {
    this.compile = function(value) {
        if (!value) return "";
        return value.charAt(0).toUpperCase() + value.slice(1);
    };
}