import { HTTP_INTERCEPTORS } from "../src/xhr/utils";
import { HttpCookieManager } from "./cookie-manager";
import { csrfCookieConfig, CSRFCookieHeaderService } from "./http.csrf.cookie";

jModule({
    services: [
        HttpCookieManager,
        {
            name: HTTP_INTERCEPTORS,
            useClass: CSRFCookieHeaderService
        }
    ]
})
export function HttpCSRFModule() {}
HttpCSRFModule.setCookieValue = function(config) {
    Object.assign(csrfCookieConfig, config);
}