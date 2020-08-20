import { HttpInterceptor } from './http.interceptor';
import { HttpService } from './http.core';

jModule({
    services: [
        HttpInterceptor,
        HttpService
    ]
})
export function HttpModule() {}