import { DatetimeService } from '../services/datetime.service';
Element({
    selector: 'jx-calendar',
    DI: [DatetimeService],
    props: ['config']
})
export function calendarFN($dateTimeFactory) {
    var defaultConfig = {
        fullYear: !1,
        year: new Date().getFullYear()
    };
    this.config = '';
    this.didInit = function() {
        var config = extend(defaultConfig, this.config);
        this.calendar = $dateTimeFactory.buildFullCalendar(config);
    };
}