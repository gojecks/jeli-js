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

/*
@Function DateStringConverter
convert String to Date
@Param : String

@return (Object) DateTime
*/

export var DateStringConverter = function(str) {
    //Function setMonth
    function setDay(d) {
        return (Number(d) < 10) ? parseInt(d) : Number(d);
    }

    if (typeof str === 'string') {
        var arr = str.match(/(\d+)-(\d+)-(\d+) (\d+):(\d+):(\d+)/);
        if (arr) {
            arr.shift();
            return new Date(arr[0], (arr[1] - 1), setDay(arr[2]), arr[3] || 0, arr[4] || 0, arr[5] || 0);
        } else if (/(\d+)-(\d+)-(\d+)/.test(str)) {
            return new Date(str);
        }
    }

    return new Date();
}

export var setText = function(text, future) {
    return text + ((future) ? ' from now' : ' ago');
};