Service({
    name: 'capitalize'
})
export function capitalizeFilter() {
    this.compile = function(value) {
        if (!value) return '';
        if (typeof value !== 'string') return value;
        return value.charAt(0).toUpperCase() + value.slice(1);
    };
}