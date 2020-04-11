import { calendarFN } from './calendar.element';
import { dateTimeFilterFN } from './date.time.pipe';
import { DatetimeService } from './jDateTime.service';
import { TimeAgoFilterFn } from './timeage.pipe';
import './tokens';

/*
    ELI DateTime Plugins
    created by Gojecks Joseph
    can be injected to Project as a required Module

    @Function Type :  Object Prototype
    @Return Type : Object
    
    Updated October 04,2015 7:10:24 pm

    added a new function format(date)(format)

*/


jModule({
    name: 'jeli.date.time',
    services: [
        DatetimeService,
        dateTimeFilterFN,
        TimeAgoFilterFn
    ],
    selectors: [
        calendarFN
    ]
})

export function jEliDateTimeModule() {}