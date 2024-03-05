/**
 * 
 * @param {*} year 
 */
export var leapYear = function(year) {
    return ((year % 4 == 0) ? 1 : 0);
};

/**
 * 
 * @param {*} month 
 * @param {*} year 
 */
export var getDays = function(month, year) {
    var ar = [31, ((leapYear(year)) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    // return number of days in the specified month (parameter)
    return ar[month];
};


/**
 * Converts a given string to dateTome Object
 * e.g YYYY.MM.DD YYYY/MM/DD YYYY-MM-DD
 * e.g YYYY.MM.DD HH:MM:SS YYYY/MM/DD HH:MM:SS YYYY-MM-DD HH:MM:SS
 * @param {*} dateString 
 * @returns Date
 */
export var DateStringConverter = function(dateString) {
    var str2Date = null;
    if (typeof dateString === 'string') {
        str2Date = new Date(dateString);
        if (isNaN(str2Date.getTime())) {
            var dateRegEx = dateString.match(/(\d+)[-./](\d+)[-./](\d+)(\s(\d+):(\d+):(\d+)|)/);
            if (dateRegEx) {
                dateRegEx.shift();
                str2Date = new Date(dateRegEx[0], dateRegEx[1], dateRegEx[2], dateRegEx[3] || 0, dateRegEx[4] || 0, dateRegEx[5] || 0);
            }
        }
    }

    return str2Date || new Date();
}

export var setText = function(text, future) {
    return text + ((future) ? ' from now' : ' ago');
};