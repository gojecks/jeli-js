import { HttpCookieManager } from "./cookie-manager";

export var csrfCookieConfig = {
    cookieName: 'X-CSRF-TOKEN',
    headerName: 'X-CSRF-TOKEN'
};

Service({
    DI: [HttpCookieManager]
})
export function CSRFCookieHeaderService(cookieManager) {
    this.resolve = function(httpRequest, next) {
        var cookie = cookieManager.get(csrfCookieConfig.cookieName);
        if (cookie) {
            var tokenHeader = {};
            tokenHeader[csrfCookieConfig.headerName] = cookie;
            httpRequest.setHeaders(tokenHeader);
        }

        next();
    }
}