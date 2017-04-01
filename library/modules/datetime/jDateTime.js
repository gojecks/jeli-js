(function()
{
    /*
        ELI DateTime Plugins
        created by Gojecks Joseph
        can be injected to Project as a required Module

        @Function Type :  Object Prototype
        @Return Type : Object
        
        Updated October 04,2015 7:10:24 pm

        added a new function format(date)(format)

    */

    'use strict';


    var moduleName = 'jEli.Date.Time',
        module;
    try{
        module = jEli.jModule(moduleName);
    }catch(e)
    {
        module = jEli.jModule(moduleName,{});
    }

module
.jValue('dateTimeMonthHalf', new Array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'))
.jValue('dateTimeMonthFull', new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'))
.jValue('dateTimeDayHalf', new Array('Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'))
.jValue('dateTimeDayFull', new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'))
.jFilter('dateTime',['dateTimeFactory',dateTimeFilterFN])
.jFilter('timeAgo',['dateTimeFactory',timeAgoFilterFn])
.jElement('calendar',['dateTimeFactory',calendarFN]);

function dateTimeFilterFN(dateTimeFactory)
{
    return function(text,replacer)
    {
        return dateTimeFactory.format(dateTimeFactory.$dateTime(text))(replacer);
    }
}

//timeAgoFilterFn
//@result converts date to timeago
function timeAgoFilterFn(dateTimeFactory){
    return function(text)
    {
        return dateTimeFactory.$timeConverter(text).timeago;
    }
}

function calendarFN($dateTimeFactory)
{
    var defaultConfig = {
            fullYear : !1,
            year : new Date().getFullYear()
        };

    return {
        allowType : 'AE',
        $init : function(ele,attr,model)
        {
           var config = jEli.$extend( defaultConfig , model.$evaluate(attr.config) );
                model.calendar = $dateTimeFactory.buildFullCalendar( config );
        }
    }
}



})();
