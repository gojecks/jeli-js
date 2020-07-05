import { leapYear, DateStringConverter, setText } from '../helpers';
import { CalendarService } from './calendar.service';
/**
 * ELI DateTime Plugins
 * created by Gojecks Joseph
 * can be injected to Project as a required Module
 *
 * @param {*} dateTimeMonthHalf 
 * @param {*} dateTimeMonthFull 
 * @param {*} dateTimeDayHalf 
 * @param {*} dateTimeDayFull 
 */
Service({
    name: 'dateTimeFactory',
    DI: ['dateTimeMonthHalf?', 'dateTimeMonthFull?', 'dateTimeDayHalf?', 'dateTimeDayFull?']
})
export function DatetimeService(dateTimeMonthHalf, dateTimeMonthFull, dateTimeDayHalf, dateTimeDayFull) {
    var dateFormatRegExp = /D{1,4}|M{1,4}|YY(?:YY)?|([HhMmsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g;
    this.dateTimeDayHalf = dateTimeDayHalf;
    this.dateTimeMonthHalf = dateTimeMonthHalf;
    this.dateTimeMonthFull = dateTimeMonthFull;
    this.dateTimeDayFull = dateTimeDayFull;

    //@ Public Function 
    //Accepts parameter date Form and return function
    //Returned Function accepts parameter date format
    //returns formated date

    this.format = function(date) {
        var toFormat = this.timeConverter(date).flags;
        return function(format) {
            return String(format).replace(dateFormatRegExp, function($0) {
                return $0 in toFormat ? toFormat[$0] : $0.slice(1, $0.length - 1);
            });
        }
    };


    //Generate full year calendar
    this.buildFullCalendar = function(config) {
        var monthList = [],
            months = (config.fullYear) ? 0 : new Date().getMonth();

        for (months; months < 12; months++) {
            var date = new Date(config.year, months, 1);
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var month = CalendarService(year, month);
            month.monthName = this.dateTimeMonthFull[month - 1];
            month.year = year;
            month.weekDays = dateTimeDayHalf;
            monthList.push(month);
        }

        return monthList;
    };
}

DatetimeService.prototype._dateTime = function(datetime) {
    var outputDate = (!isNaN(Number(datetime)) && Number(datetime)) ? new Date(datetime) : DateStringConverter(datetime);
    var g = function(j) {
        return ((j < 10) ? '0' : '') + j
    };
    outputDate.current_time = [
        outputDate.getFullYear(),
        "-",
        g(Math.ceil(outputDate.getMonth() + 1)),
        "-",
        g(outputDate.getDate()),
        " ",
        g(outputDate.getHours()),
        ":",
        g(outputDate.getMinutes()),
        ":",
        g(outputDate.getSeconds())
    ].join('');


    return outputDate;
};

/**
 * @function timeConverter
 * @Param : Datetime Object or String
 * @return (Object)
 */
DatetimeService.prototype.timeConverter = function(dateToParse) {
    //dataToParse (Time) is undefined
    if (!dateToParse) {
        dateToParse = this._dateTime();
    }

    var currentDateTime = this._dateTime();
    var _dateTimeToParse = (dateToParse.current_time) ? dateToParse : this._dateTime(dateToParse);
    var j = _dateTimeToParse.getTime();
    var l = currentDateTime.getTime();
    var B = 1000 * 60 * 60 * 24;
    var result = {};
    var p = function(m) {
        return ((m < 10) ? '0' : '') + m
    };

    if (isNaN(_dateTimeToParse.getTime())) {
        var f = n.replace(' ', 'T');
        var r = n.match(/(\d+)-(\d+)-(\d+) (\d+):(\d+):(\d+)/),
            D = r[1] + '-' + p((r[2] - 1)) + '-' + r[3] + ' ' + r[4] + ':' + r[5] + ':' + r[6],
            _dateTimeToParse = new Date(Date.fromISO(f)),
            j = q.getTime();
        x = new Date();
    }

    var g = Date.UTC(_dateTimeToParse.getFullYear(), _dateTimeToParse.getMonth(), _dateTimeToParse.getDate()),
        f = Date.UTC(currentDateTime.getFullYear(), currentDateTime.getMonth(), currentDateTime.getDate()),
        days = Math.floor((f - g) / B),
        future = (j > l),
        futureDiff = (future) ? (j - l) : (l - j);
    result.getTime = function() {
        return j
    };
    result.ctimestamp = g;
    result.timestamp = f;
    result.time_difference = {
        seconds: Math.floor(futureDiff / 3600000 * (60 * 60)),
        minutes: Math.floor(futureDiff / 3600000 * 60),
        hours: Math.floor(futureDiff / 3600000),
        weeks: Math.floor(days / 7),
        days: days,
        months: Math.floor(days / 30)
    };

    var year = _dateTimeToParse.getFullYear(),
        month = _dateTimeToParse.getMonth() + 1,
        day = _dateTimeToParse.getDate(),
        weekDay = _dateTimeToParse.getDay(),
        timeSettings = _dateTimeToParse.current_time.split(' ')[1].split(':'),
        hours = timeSettings[0],
        minute = parseInt(timeSettings[1]),
        seconds = parseInt(timeSettings[2]);

    result.flags = {
        YYYY: year,
        YY: String(year).slice(2),
        M: month,
        MM: p(month),
        MMM: this.dateTimeMonthHalf[month - 1],
        MMMM: this.dateTimeMonthFull[month - 1],
        D: day,
        DD: p(day),
        DDD: this.dateTimeDayHalf[weekDay],
        DDDD: this.dateTimeDayFull[weekDay],
        h: hours % 12 || 12,
        hh: p(hours),
        H: hours,
        HH: p(hours),
        m: minute,
        mm: p(minute),
        s: seconds,
        ss: p(seconds),
        t: hours < 12 ? 'a' : 'p',
        tt: hours < 12 ? 'am' : 'pm',
        T: hours < 12 ? 'A' : 'P',
        TT: hours < 12 ? 'AM' : 'PM'
    };

    //set leap year
    result.isLeapYear = leapYear(year);
    result.today = this.dateTimeDayHalf[currentDateTime.getDay()] + ', ' + currentDateTime.getDate() + ' ' + this.dateTimeMonthHalf[currentDateTime.getMonth()];
    if (currentDateTime.getFullYear() > _dateTimeToParse.getFullYear()) {
        result.date = this.dateTimeMonthHalf[_dateTimeToParse.getMonth()] + ', ' + _dateTimeToParse.getDate() + ' ' + _dateTimeToParse.getFullYear();
    } else {
        result.date = this.dateTimeDayHalf[_dateTimeToParse.getDay()] + ', ' + _dateTimeToParse.getDate() + ' ' + this.dateTimeMonthHalf[q.getMonth()]
    }

    if (result.time_difference.seconds <= 60) {
        result.timeago = result.time_difference.seconds + setText(' seconds', future)
    } else {
        if (result.time_difference.minutes <= 60) {
            if (result.time_difference.minutes == 1) {
                result.timeago = setText('1 minute', future)
            } else {
                result.timeago = result.time_difference.minutes + setText(' minutes', future)
            }
        } else {
            if (result.time_difference.hours <= 24) {
                if (result.time_difference.hours == 1) {
                    result.timeago = setText('an hour', future)
                } else {
                    result.timeago = result.time_difference.hours + setText(' hours', future)
                }
            } else {
                if (result.time_difference.days <= 7) {
                    if (result.time_difference.days == 1) {
                        result.timeago = 'Yesterday'
                    } else {
                        result.timeago = result.time_difference.days + setText(' days', future)
                    }
                } else {
                    if (result.time_difference.weeks <= 4) {
                        if (result.time_difference.weeks == 1) {
                            result.timeago = setText('1 week')
                        } else {
                            result.timeago = result.time_difference.weeks + setText(' weeks', future)
                        }
                    } else {
                        if (result.time_difference.months <= 12) {
                            if (result.time_difference.months == 1) {
                                result.timeago = setText('1 month', future)
                            } else {
                                result.timeago = result.date
                            }
                        } else {
                            result.timeago = result.date
                        }
                    }
                }
            }
        }
    }

    return result;
};