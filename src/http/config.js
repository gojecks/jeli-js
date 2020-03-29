Service({
    DI: ['__httpInterceptor__']
}, RegisterInterceptors)

function RegisterInterceptors(httpInterceptors) {
    httpInterceptors.register();
}