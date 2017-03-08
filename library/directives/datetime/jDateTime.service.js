(function(){

	/*
        ELI DateTime Plugins
        created by Gojecks Joseph
        can be injected to Project as a required Module

        @Function Type :  Object Prototype
        @Return Type : Object
       
    */
		
	'use strict';


	jEli
	.jModule('jEli.Date.Time')
	.jFactory('dateTimeFactory',['dateTimeMonthHalf','dateTimeMonthFull','dateTimeDayHalf','dateTimeDayFull',bndateTimeFactoryFN]);



	function bndateTimeFactoryFN( dateTimeMonthHalf,dateTimeMonthFull,dateTimeDayHalf,dateTimeDayFull)
	{
	    var dateFormatRegExp = /D{1,4}|M{1,4}|YY(?:YY)?|([HhMmsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g;

	    //@ Public Function 
	    //Accepts parameter date Form and return function
	    //Returned Function accepts parameter date format
	    //returns formated date

	    this.format = function(date)
	    {
	        var toFormat = this.$timeConverter(date).flags;
	        return function(format)
	        {
	            return String(format).replace(dateFormatRegExp,function($0)
	            {
	                return $0 in toFormat ? toFormat[$0] : $0.slice(1, $0.length-1);
	            });
	        }
	    };

	    /*check if year is a leapyear*/
	    function leapYear(year) 
	    {
	        return ((year % 4 == 0)?1:0); 
	    }

	    // create array to hold number of days in each month
	    function getDays(month, year) 
	    {
	        var ar = [31,((leapYear(year)) ? 29 : 28),31,30,31,30,31,31,30,31,30,31];
	        // return number of days in the specified month (parameter)
	        return ar[month];
	    }

	    //function draw calendar
	    function drawCal(firstDay, lastDate, date, now)
	    {
	        this.monthName = now.flags.MMMM;
	        this.year = now.flags.YYYY
	        this.weekDays = dateTimeDayHalf;
	        this.weeks = [];

	        // declaration and initialization of two variables to help with tables
	        var digit = 1
	        var curCell = 1

	        for (var row = 1; row <= Math.ceil((lastDate + firstDay - 1) / 7); ++row) 
	        {
	            var weekDays = [];
	            for (var col = 1; col <= 7; ++col) 
	            {
	                if (digit > lastDate)
	                {
	                    break
	                }

	                if (curCell < firstDay) 
	                {
	                    weekDays.push({date:null,current:false});
	                    curCell++
	                }else 
	                {
	                    weekDays.push({date:digit,current:(digit == date)}); 
	                    digit++
	                }
	            }

	            this.weeks.push( weekDays );
	        }
	    }

	    this.createCalendar = function(date)
	    {
	        // standard time attributes
	        var now = this.$timeConverter(date),
	            year = now.flags.YYYY,
	            month = now.flags.M-1,
	            date = new Date().getDate();

	            if (year < 1000)
	            {
	                year+=1900
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
	        return new drawCal(firstDay + 1, days, date, now);
	    };


	    //Generate full year calendar
	    this.buildFullCalendar = function(config)
	    {
	        var monthList = [],
	        months = (config.fullYear)?0:new Date().getMonth();

	        for(months; months < 12; months++)
	        {
	            monthList.push( this.createCalendar( new Date(config.year,months,1).getTime()) );
	        }

	        return monthList;
	    };

	        /*
	            @Function DateStringConverter
	            convert String to Date
	            @Param : String

	            @return (Object) DateTime
	        */

	    function DateStringConverter(str)
	    {
	        //Function setMonth
	        function setDay(d)
	        {
	            return (Number(d) < 10)?parseInt(d):Number(d);
	        }

	        if(jEli.$isString(str))
	        {
	             var arr = str.match(/(\d+)-(\d+)-(\d+) (\d+):(\d+):(\d+)/);
	            if(!jEli.$isNull(arr) && arr)
	            {
	                arr.shift();

	                return new Date( arr[0], ( arr[1] - 1 ), setDay( arr[2] ), arr[3] || 0, arr[4] || 0, arr[5] || 0);
	            }
	        }

	        return new Date();
	    }

	    this.$dateTime = function(f) 
	    {
	        var h = (!isNaN(Number(f)) && Number(f)) ? new Date(f) : DateStringConverter(f),
	        g = function (j) {
	        return ((j < 10) ? '0' : '') + j
	        },
	        date = g(h.getDate()),
	        month = g(Math.ceil(h.getMonth() + 1)),
	        year = h.getFullYear(),
	        hour = g(h.getHours()),
	        min = g(h.getMinutes()),
	        sec = g(h.getSeconds());

	        h.current_time = year + '-' + month + '-' + date + ' ' + hour + ':' + min + ':' + sec;
	        return h;
	    };


	    /*
	        @Function $timeConverter
	        @Param : Datetime Object or String

	        @return (Object)
	    */

	    this.$timeConverter = function(n)
	    {
	        //n (Time) is undefined
	        if(jEli.$isUndefined(n))
	        {
	            n = this.$dateTime();
	        }

	        var x = this.$dateTime(),
	        A = dateTimeMonthHalf, 
	        v = dateTimeDayHalf,
	        q = (n.current_time)?n:this.$dateTime(n),
	        z = q.getDate(),
	        j = q.getTime(),
	        l = x.getTime(),
	        B = 1000 * 60 * 60 * 24,
	        w = {},
	        p = function (m) {
	        return ((m < 10) ? '0' : '') + m
	        };
	        if (isNaN(j)) 
	        {
	            var f = n.replace(' ', 'T');
	            var r = n.match(/(\d+)-(\d+)-(\d+) (\d+):(\d+):(\d+)/),
	            D = r[1] + '-' + p((r[2] - 1)) + '-' + r[3] + ' ' + r[4] + ':' + r[5] + ':' + r[6],
	            q = new Date(Date.fromISO(f)),
	            j = q.getTime();
	            x = new Date();
	        }

	        var g = Date.UTC(q.getFullYear(), q.getMonth(), q.getDate()),
	        f = Date.UTC(x.getFullYear(), x.getMonth(), x.getDate()),
	        o = Math.floor((f - g) / B),
	        h = o,
	        i = Math.floor(h / 7),
	        k = Math.floor(o / 30),
	        u = Math.floor(k / 12),
	        future = (j > l),
	        e = (future)?(j - l) : (l - j),
	        y = Math.floor(e / 3600000 * (60 * 60)),
	        s = Math.floor(e / 3600000 * 60),
	        C = Math.floor(e / 3600000),
	        setText = function(text)
	        {
	            return text + ((future)?' from now': ' ago');
	        };
	        w.getTime = function () {
	        return j
	        };
	        w.ctimestamp = g;
	        w.timestamp = f;
	        w.time_difference = { seconds: y,minutes: s,hours: C , weeks: i, days: h, months: k};
	        var year = q.getFullYear(),
	            month = q.getMonth() + 1,
	            day = q.getDate(),
	            weekDay = q.getDay(),
	            timeSettings = q.current_time.split(' ')[1].split(':'),
	            hours = timeSettings[0],
	            minute = parseInt( timeSettings[1] ),
	            seconds = parseInt( timeSettings[2] );

	        w.flags = {
	        YYYY : year,
	        YY : String(year).slice(2),
	        M : month,
	        MM : p(month),
	        MMM : dateTimeMonthHalf[month-1],
	        MMMM : dateTimeMonthFull[month-1],
	        D: day,
	        DD : p(day),
	        DDD : dateTimeDayHalf[weekDay],
	        DDDD : dateTimeDayFull[weekDay],
	        h : hours % 12 || 12,
	        hh : p(hours),
	        H : hours,
	        HH : p(hours),
	        m : minute,
	        mm : p(minute),
	        s : seconds,
	        ss : p(seconds),
	        t : hours < 12?'a':'p',
	        tt : hours < 12 ? 'am':'pm',
	        T : hours < 12?'A':'P',
	        TT: hours < 12 ? 'AM' : 'PM'
	        };

	        //set leap year
	        w.isLeapYear = leapYear(year);

	        w.today = v[x.getDay()] + ', ' + x.getDate() + ' ' + A[x.getMonth()];
	        if (x.getFullYear() > q.getFullYear()) 
	        {
	            w.msgday = A[q.getMonth()] + ', ' + q.getDate() + ' ' + q.getFullYear()
	        } else {
	            w.msgday = v[q.getDay()] + ', ' + q.getDate() + ' ' + A[q.getMonth()]
	        }

	        if (y <= 60) 
	        {
	        w.timeago = y + setText(' seconds')
	        } else {
	        if (s <= 60) {
	          if (s == 1) {
	            w.timeago = setText('1 minute')
	          } else {
	            w.timeago = s + setText(' minutes')
	          }
	        } else {
	          if (C <= 24) {
	            if (C == 1) {
	              w.timeago = setText('an hour')
	            } else {
	              w.timeago = C + setText(' hours')
	            }
	          } else {
	            if (h <= 7) {
	              if (h == 1) {
	                w.timeago = 'Yesterday'
	              } else {
	                w.timeago = o + setText(' days')
	              }
	            } else {
	              if (i <= 4) {
	                if (i == 1) {
	                  w.timeago = setText('1 week')
	                } else {
	                  w.timeago = i + setText(' weeks')
	                }
	              } else {
	                if (k <= 12) {
	                  if (k == 1) {
	                    w.timeago = setText('1 month')
	                  } else {
	                    w.timeago = w.msgday
	                  }
	                } else {
	                  w.timeago = w.msgday
	                }
	              }
	            }
	          }
	        }
	        }

	        return w
	    };

	    return this;
	}


})();