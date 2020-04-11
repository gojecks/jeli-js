Service({
    DI: ['__httpInterceptor__']
})

export function RegisterInterceptors(httpInterceptors) {
    httpInterceptors.register();
}