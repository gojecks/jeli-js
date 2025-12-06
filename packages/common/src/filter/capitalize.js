Service({
    name: 'capitalize'
})
export class capitalizeFilter {
    constructor() {}
    compile(value) {
        if (!value) return '';
        if (typeof value !== 'string') return value;
        return `${value.charAt(0).toUpperCase()}${value.slice(1).toLowerCase()}`;
    }
}