import { DatetimeService } from './datetime.service';
Pipe({
    name: 'dateTime',
    DI: [DatetimeService]
})

export function dateTimeFilterFN(dateTimeFactory) {
    this.compile = function(text, replacer) {
        return dateTimeFactory.format(dateTimeFactory.$dateTime(text))(replacer);
    };
}