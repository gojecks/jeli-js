/**
 * 
 * @param {*} year 
 */
export function leapYear(year) {
    return ((year % 4 == 0) ? 1 : 0);
}

/**
 * 
 * @param {*} month 
 * @param {*} year 
 */
export function getDays(month, year) {
    var ar = [31, ((leapYear(year)) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    // return number of days in the specified month (parameter)
    return ar[month];
}


/**
 * Converts a given string to dateTome Object
 * e.g YYYY.MM.DD YYYY/MM/DD YYYY-MM-DD
 * e.g YYYY.MM.DD HH:MM:SS YYYY/MM/DD HH:MM:SS YYYY-MM-DD HH:MM:SS
 * @param {*} dateString 
 * @returns Date
 */
export function DateStringConverter(dateString) {
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

export function setText(text, future) {
    return text + ((future) ? ' from now' : ' ago');
}

/**
 * 
 * @param {*} obj 
 * @param {*} future 
 */
export function generateTimeAgo(obj, future) {
    const setters = {
        hours: () => {
            if (obj.time_difference.hours == 1) {
                obj.timeago = setText('an hour', future);
            } else {
                obj.timeago = obj.time_difference.hours + setText(' hours', future);
            }
        },
        minutes: () => {
            if (obj.time_difference.minutes == 1) {
                obj.timeago = setText('1 minute', future);
            } else {
                obj.timeago = setText(`${obj.time_difference.minutes} minutes`, future);
            }
        },
        weeks: () => {
            if (obj.time_difference.weeks == 1) {
                obj.timeago = setText('1 week');
            } else {
                obj.timeago = setText(`${obj.time_difference.weeks} weeks`, future);
            }
        },
        days: () => {
            if (obj.time_difference.days == 1) {
                obj.timeago = future ? 'Tomorrow' : 'Yesterday';
            } else {
                obj.timeago = + setText(`${obj.time_difference.days} days`, future);
            }
        },
        months: () => {
            const months = obj.time_difference.months;
            if (months <= 12) {
                if (months == 1) {
                    obj.timeago = setText('1 month', future);
                } else {
                    obj.timeago = setText(`${months} months`, future);
                }
            } else {
                let diff = '' + (months / 12).toFixed(1);
                diff = diff.split('.').map(Number);
                obj.timeago = setText(`${diff[0]} years ${(diff[1] > 0 ? ', ' + diff[1] + ' months' : '')}`, future);
            }
        },
        seconds: () => {
            obj.timeago = obj.time_difference.seconds + setText(' seconds', future);
        }
    };

    if (future) {
        const days = obj.time_difference.days;
        if (days > 30) {
            setters.months();
        } else if (days){
            setters.days();
        } else if (obj.time_difference.hours <= 24 && obj.time_difference.minutes > 60) {
            setters.hours();
        } else if (obj.time_difference.minutes <= 60) {
            setters.minutes();
        } else if (obj.time_difference.seconds <= 60) {
            setters.seconds();
        }

    } else {
        if (obj.time_difference.seconds <= 60) {
            setters.seconds();
        } else if (obj.time_difference.minutes <= 60) {
            setters.minutes();
        } else {
            if (obj.time_difference.hours <= 24) {
                setters.hours();
            } else {
                if (obj.time_difference.days <= 7) {
                    setters.days();
                } else {
                    if (obj.time_difference.weeks <= 4) {
                        setters.weeks();
                    } else {
                        setters.months();
                    }
                }
            }
        }
    }
}
