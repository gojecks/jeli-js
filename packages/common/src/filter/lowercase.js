Service({
    name: 'lowercase'
})
export class lowerCaseFilter {
    constructor() {}
    compile(value) {
        if (typeof value !== 'string') return value;
        return (value || '').toLowerCase();
    }
}