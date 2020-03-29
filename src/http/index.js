Service({
    name: '$http',
    DI: ['__httpInterceptor__', 'changeDetector?']
}, HttpService);

function HttpService(interceptor, changeDetector) {
    return AjaxSetup(interceptor, changeDetector);
}