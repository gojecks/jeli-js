import { ProviderToken } from '@jeli/core';
export var HTTP_INTERCEPTORS = new ProviderToken('interceptors', true);

var JSON_CONTENT_TYPE = /json/i;

/**
 * true when the response's Content-Type indicates JSON (or the header is
 * missing entirely, preserving the previous always-parse-as-JSON default) -
 * per RFC 9110 8.3, Content-Type is what governs how a payload should be
 * interpreted, not just the request's own Accept header.
 * @param {*} xhrInstance
 * @returns
 */
export function isJSONResponse(xhrInstance) {
    var contentType = xhrInstance.getResponseHeader('Content-Type');
    return !contentType || JSON_CONTENT_TYPE.test(contentType);
}

/**
 * parseJson and throw error if found
 * @param {*} response
 * @returns
 */
export function parseJSON(response) {
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