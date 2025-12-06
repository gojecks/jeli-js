Service({
    name: 'uppercase'
})
export class upperCaseFilter {
    constructor() { }
    compile(value) {
        return (value || '').toUpperCase();
    }
}