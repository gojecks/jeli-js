Service({
    name: 'lowercase'
})
export class lowerCaseFilter {
    constructor() {}
    compile(value) {
        return (value || '').toLowerCase();
    }
}