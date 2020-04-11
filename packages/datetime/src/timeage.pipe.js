Pipe({
    name: 'timeAgo',
    DI: ['dateTimeFactory']
})

//timeAgoFilterFn
//@result converts date to timeago
export function TimeAgoFilterFn(dateTimeFactory) {
    this.compile = function(text) {
        return dateTimeFactory.$timeConverter(text).timeago;
    };
}