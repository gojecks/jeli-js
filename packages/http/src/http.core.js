Service({
    name: '$http',
    DI: ['__httpInterceptor__', 'changeDetector?']
})

export function HttpService(interceptor, changeDetector) {
    return AjaxSetup(interceptor, changeDetector);
}