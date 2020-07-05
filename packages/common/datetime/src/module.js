import { calendarFN } from './elements/calendar.element';
import { dateTimeFilterFN } from './services/date.time.pipe';
import { DatetimeService } from './services/datetime.service';
import { TimeAgoFilterFn } from './services/timeago.pipe';
import './tokens';


/**
 * ELI DateTime Plugins
 * can be injected to Project as a required Module
 */

jModule({
    services: [
        DatetimeService,
        dateTimeFilterFN,
        TimeAgoFilterFn
    ],
    selectors: [
        calendarFN
    ]
})

export function DateTimeModule() {}