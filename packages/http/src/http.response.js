import { isobject } from '@jeli/helpers';

/**
 * Core HttpResponse
 */
export class HttpResponse {
    /**
     * @param {*} httpRequest
     */
    constructor(httpRequest) {
        this.status = httpRequest.xhrInstance.status;
        this.readyState = httpRequest.xhrInstance.readyState;
        this.url = httpRequest.url;
        this.data = null;
        this.success = (
            (httpRequest.xhrInstance.status >= 200 && httpRequest.xhrInstance.status < 300) ||
            httpRequest.xhrInstance.status == 304 || (httpRequest.xhrInstance.status == 0 && httpRequest.xhrInstance.responseText)
        );
        this.headers = {
            getResponseHeader: function(name) {
                if (!isobject(name)) {
                    return httpRequest.xhrInstance.getResponseHeader(name);
                } else {
                    return name.map((headerName) => httpRequest.xhrInstance.getResponseHeader(headerName));
                }
            }
        };
    }
}
