/**
 * JSON Filter FN
 */
Service({
    name: 'json'
})
export class jsonFilterFn {
    compile(value, spacing) {
        return ((value && typeof value === "object") ? JSON.stringify(value, null, parseInt(spacing || '0')) : value);
    }
}