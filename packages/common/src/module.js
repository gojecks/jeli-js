import { ForDirective } from './directives/for';
import { IncludeDirective } from './directives/include.directive';
import { IfDirective } from './directives/jIf.directive';
import { ModelDirective } from './directives/jModel.directive';
import { SelectDirective } from './directives/select.directive';
import { SwitchDirective, SwitchCaseDirective, SwitchDefaultDirective } from './directives/switch.directive';
import { ClassDirective } from './directives/class.directive';
import { capitalizeFilter } from './filter/capitalize';
import { CurrencyFilter } from './filter/currency';
import { jsonFilterFn } from './filter/json';
import { lowerCaseFilter } from './filter/lowercase';
import { NumberFilter } from './filter/number.registry';
import { orderByFilterFn } from './filter/orderby.filter.service';
import { upperCaseFilter } from './filter/uppercase';
import { whereFilterFn } from './filter/where.filter';
import { IterableProfiler } from './services/iterable_profiler';
import { QueryFactory } from './services/query.service';
import { TimeoutService, IntervalService } from './services/timeout';
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
        TimeoutService,
        IntervalService,
        QueryFactory,
        IterableProfiler
    ],
    selectors: [
        ForDirective,
        IncludeDirective,
        IfDirective,
        ModelDirective,
        SelectDirective,
        ClassDirective,
        SwitchDirective,
        SwitchCaseDirective,
        SwitchDefaultDirective
    ]
})

export function CommonModule() {}