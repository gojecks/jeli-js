import { errorBuilder } from '../utils/errorLogger';
/**
 * 
 * @param {*} type 
 * @param {*} context 
 */
export function filterParser(type, context) {
    var filterFn = Inject(type);
    if (!filterFn) {
        errorBuilder(type + 'Provider was not found in FilterProvider');
    }

    return filterFn.compile.apply(filterFn, context);
};