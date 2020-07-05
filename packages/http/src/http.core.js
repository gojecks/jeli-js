import { HttpInterceptor } from './http.interceptor';
import { ChangeDetector } from '@jeli/core';
Service({
    DI: [HttpInterceptor, ChangeDetector]
})

export function HttpService(interceptor, changeDetector) {
    return AjaxSetup(interceptor, changeDetector);
}