import { RegisterInterceptors } from './config';
import { HttpInterceptor } from './http.interceptor';
import { HttpService } from './http.core';
import { INITIALIZERS, ProviderToken } from '@jeli/core';

export var INTERCEPTORS = new ProviderToken('interceptors', true);
jModule({
    services: [
        HttpInterceptor,
        HttpService,
        {
            name: INITIALIZERS,
            factory: RegisterInterceptors
        }
    ]
})

export function HttpModule() {}