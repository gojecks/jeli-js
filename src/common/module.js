/**
 * set up common Module
 * that other Module could inject
 * ModuleName jeli
 */
var commonModule = JModule('jeli', {})
    .service('number', numberFilter)
    .service('capitalize', capitalizeFilter)
    .service('json', jsonFilterFn)
    .service('uppercase', upperCaseFilter)
    .service('lowercase', lowerCaseFilter)
    .service('currency', ['number', CurrencyFilter])
    .service('orderBy', orderByFilterFn)
    .service('where', whereFilterFn)
    .service('$timeout', $timeoutService)
    .service('Event', CustomEventHandler)
    .service('query', QueryFactory);