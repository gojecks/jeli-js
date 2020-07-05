import { HttpInterceptor } from './http.interceptor'
Service({
    DI: [HttpInterceptor]
})

export function RegisterInterceptors(httpInterceptors) {
    httpInterceptors.register();
}