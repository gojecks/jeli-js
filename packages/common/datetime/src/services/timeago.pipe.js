import { DatetimeService } from './datetime.service';
Pipe({
    name: 'timeAgo',
    DI: [DatetimeService]
})

//timeAgoFilterFn
//@result converts date to timeago
export function TimeAgoFilterFn(dateTimeFactory) {
    this.compile = function(text) {
        return dateTimeFactory.format(text, 'timeago');
    };
}