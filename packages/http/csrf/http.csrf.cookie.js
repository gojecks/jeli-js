import { HttpCookieManager } from "./cookie-manager";

export var csrfCookieConfig = {
    cookieName: 'X-CSRF-TOKEN',
    headerName: 'X-CSRF-TOKEN'
};

Service({
    DI: [HttpCookieManager]
})
export class CSRFCookieHeaderService {
    constructor(cookieManager) {
        this.cookieManager = cookieManager;
    }

    resolve(httpRequest, next) {
        var cookie = this.cookieManager.get(csrfCookieConfig.cookieName);
        if (cookie) {
            var tokenHeader = {};
            tokenHeader[csrfCookieConfig.headerName] = cookie;
            httpRequest.setHeaders(tokenHeader);
        }

        next();
    }
}
