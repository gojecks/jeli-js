Service({
    name: 'reverse'
})
export class ReversePipe {
    constructor() { }
    compile(data) {
        if (!Array.isArray(data)) {
            console.error('Reverse pipe expected array but got ', typeof data);
            return;
        }

        return data.reverse();
    }
}