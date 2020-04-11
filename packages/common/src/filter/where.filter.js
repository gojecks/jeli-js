/**
 * Where filter
 * @usage: (DEFINITION, "id === 'a'")
 * 
 */
Service({
    name: 'where'
})
export function whereFilterFn() {
    this.compile = function(model, query) {
        return new $query(model).where(query);
    }
}