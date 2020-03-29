import { RegisterInterceptors } from './config';
import { HttpInterceptor } from './http.interceptor';
import { HttpService } from './index';

export var INTERCEPTORS = new ProviderToken('interceptors');
jModule({
    services: [
        HttpInterceptor,
        HttpService,
        {
            name: INITIALIZERS,
            factory: RegisterInterceptors
        }
    ]
}, jEliHttpModule);

function jEliHttpModule() {}