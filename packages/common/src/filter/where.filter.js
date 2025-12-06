import { QueryFactory } from '../services/query.service';
/**
 * Where filter
 * @usage: (DEFINITION, "id === 'a'")
 * 
 */
Service({
    name: 'whereFilter'
})
export class whereFilterFn {
    constructor() { }
    compile(model, query) {
        return new QueryFactory(model).where(query);
    }
}