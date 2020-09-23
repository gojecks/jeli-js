import { QueryFactory } from '../services/query.service';
/**
 * Where filter
 * @usage: (DEFINITION, "id === 'a'")
 * 
 */
Service({
    name: 'whereFilter'
})
export function whereFilterFn() {
    this.compile = function(model, query) {
        return new QueryFactory(model).where(query);
    }
}