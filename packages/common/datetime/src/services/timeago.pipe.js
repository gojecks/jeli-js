import { DatetimeService } from './datetime.service';
Pipe({
    name: 'timeAgo',
    DI: [DatetimeService]
})

//timeAgoFilterFn
//@result converts date to timeago
export function TimeAgoFilterFn(dateTimeFactory) {
    this.compile = function(dateTime, fallback) {
        if (!dateTime && fallback) return fallback;
        return dateTimeFactory.timeConverter(dateTime).timeago;
    };
}