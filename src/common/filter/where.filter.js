Service({
    name: 'where'
}, whereFilterFn);
/**
 * Where filter
 * @usage: (DEFINITION, "id === 'a'")
 * 
 */
function whereFilterFn() {
    this.compile = function(model, query) {
        return new $query(model).where(query);
    }
}