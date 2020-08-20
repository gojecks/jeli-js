import { ProviderToken } from '@jeli/core';
var MONTHS_HALF = new ProviderToken('dateTimeMonthHalf', false, {
    value: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
});
var MONTHS_FULL = new ProviderToken('dateTimeMonthFull', false, {
    value: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
});
var DAYS_HALF = new ProviderToken('dateTimeDayHalf', false, {
    value: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
});
var DAYS_FULL = new ProviderToken('dateTimeDayFull', false, {
    value: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
});

export {
    MONTHS_HALF,
    MONTHS_FULL,
    DAYS_HALF,
    DAYS_FULL
};