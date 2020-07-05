import { getDays } from '../helpers';

/**
 * 
 * @param {*} firstDay 
 * @param {*} lastDate 
 * @param {*} date 
 */
function CalendarObject(firstDay, lastDate, date) {
    this.monthName = now.flags.MMMM;
    this.year = now.flags.YYYY
    this.weekDays = dateTimeDayHalf;
    this.weeks = [];
    // declaration and initialization of two variables to help with tables
    var digit = 1
    var curCell = 1

    for (var row = 1; row <= Math.ceil((lastDate + firstDay - 1) / 7); ++row) {
        var weekDays = [];
        for (var col = 1; col <= 7; ++col) {
            if (digit > lastDate) {
                break
            }

            if (curCell < firstDay) {
                weekDays.push({ date: null, current: false });
                curCell++
            } else {
                weekDays.push({ date: digit, current: (digit == date) });
                digit++
            }
        }

        this.weeks.push(weekDays);
    }
}

/**
 * 
 * @param {*} year 
 * @param {*} month 
 */
export function CalendarService(year, month) { // standard time attributes
    var date = new Date().getDate();

    if (year < 1000) {
        year += 1900
    }
    //set now to null so we don't have a reference of it 

    // create instance of first day of month, and extract the day on which it occurs
    var firstDayInstance = new Date(year, month, 1),
        firstDay = firstDayInstance.getDay();

    //set firstDayInstance to null so we don't have a reference of it    
    firstDayInstance = null

    // number of days in current month
    var days = getDays(month, year)
        // call function to draw calendar
    return new CalendarObject(firstDay + 1, days, date);
}