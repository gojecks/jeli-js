import { DatetimeService } from '../services/datetime.service';
Element({
    selector: 'jx-calendar',
    DI: [DatetimeService],
    props: ['config']
})
export class calendarFN {
    constructor(dateTimeFactory) {
        this.config = {};
        this.dateTimeFactory = dateTimeFactory;
    }

    didInit() {
        this.calendar = this. dateTimeFactory.buildFullCalendar(extend({
            fullYear: !1,
            year: new Date().getFullYear()
        }, this.config));
    }
}