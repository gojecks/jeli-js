Service({
    name: 'reverse'
})
export function ReversePipe() {
    this.compile = function(data) {
        if (!Array.isArray(data)) {
            console.error('Reverse pipe expected array but got ', typeof data);
            return;
        }

        return data.reverse();
    }
}