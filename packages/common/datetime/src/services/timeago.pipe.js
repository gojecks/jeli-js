import { DatetimeService } from './datetime.service';
Pipe({
    name: 'timeAgo',
    DI: [DatetimeService]
})

//timeAgoFilterFn
//@result converts date to timeago
//timeAgoFilterFn
//@result converts date to timeago
export class TimeAgoFilterFn {
    constructor(dateTimeFactory) {
        this.dateTimeFactory = dateTimeFactory;
    }

    compile(dateTime, fallback) {
            if (!dateTime && fallback) return fallback;
            return this.dateTimeFactory.timeConverter(dateTime).timeago;
    }
}