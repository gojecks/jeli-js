import { ProviderToken } from '@jeli/core';
export var HTTP_INTERCEPTORS = new ProviderToken('interceptors', true);
/**
 * parseJson and throw error if found
 * @param {*} response 
 * @returns 
 */
function parseJSON(response) {
    var content;
    var tError = !!response;
    try {
        content = JSON.parse(response);
    } catch (e) {
        if (tError) {
            throw new Error(e);
        } else {
            content = response;
        }
    }

    return content
}