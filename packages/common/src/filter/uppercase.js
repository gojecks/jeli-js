Service({
    name: 'uppercase'
})
export class upperCaseFilter {
    constructor() { }
    compile(value) {
        if (typeof value !== 'string') return value;
        return (value || '').toUpperCase();
    }
}