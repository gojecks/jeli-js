import { ForDirective } from './directives/for';
import { IfDirective } from './directives/jIf.directive';
import { SwitchDirective, SwitchCaseDirective, SwitchDefaultDirective } from './directives/switch.directive';
import { ClassDirective } from './directives/class.directive';
import { capitalizeFilter } from './filter/capitalize';
import { CurrencyFilter } from './filter/currency';
import { jsonFilterFn } from './filter/json';
import { lowerCaseFilter } from './filter/lowercase';
import { NumberFilter } from './filter/number.filter';
import { orderByFilterFn } from './filter/orderby.filter.service';
import { upperCaseFilter } from './filter/uppercase';
import { whereFilterFn } from './filter/where.filter';
import { QueryFactory } from './services/query.service';
import { FilterPipe } from './filter/filter';
import { ReversePipe } from './filter/reverse';
/**
 * set up common Module
 * that other Module could inject
 * ModuleName jeli
 */
jModule({
    services: [
        NumberFilter,
        capitalizeFilter,
        jsonFilterFn,
        upperCaseFilter,
        lowerCaseFilter,
        orderByFilterFn,
        whereFilterFn,
        CurrencyFilter,
        QueryFactory,
        FilterPipe,
        ReversePipe
    ],
    selectors: [
        ForDirective,
        IfDirective,
        ClassDirective,
        SwitchDirective,
        SwitchCaseDirective,
        SwitchDefaultDirective
    ]
})

export function CommonModule() {}