import { DatetimeService } from './datetime.service';
Pipe({
    name: 'dateTime',
    DI: [DatetimeService]
})

export class dateTimeFilterFN {
    constructor(dateTimeFactory) {
        this.dateTimeFactory = dateTimeFactory;
    }

    compile(text, replacer) {
        return this.dateTimeFactory.format(text, replacer);
    }
}