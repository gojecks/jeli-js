import { FormControlDirective, FormControlNameDirective } from './directives/form-control.directive';
import { FormControlService } from './form-control.service';
import { FormFieldControlDirective } from './directives/form-field-control.directive';
import { FormFieldControlService } from './form-field-control.service';
import { FormFieldDirective } from './directives/form-field.directive';
import { DefaultEventBinder } from './directives/default.event.accessor';
import { CheckboxEventBinder } from './directives/checkbox.event.accessor';
import { RadioEventBinder, RadioEventContainer } from './directives/radio.event.accessor';
import { OptionDirective, SelectEventBinder } from './directives/select.event.accessor';
import { ModelDirective } from './directives/model.directive';
import './utils';
import { NumberEventBinder } from './directives/number.event.accessor';
import { RangeEventBinder } from './directives/range.event.accessor';
import { FormRepeaterService } from './form-repeater.service';

/**
 * JeliFromModule
 */
jModule({
    services: [
        FormControlService,
        FormFieldControlService,
        FormRepeaterService,
        RadioEventContainer
    ],
    selectors: [
        FormControlDirective,
        FormControlNameDirective,
        FormFieldControlDirective,
        FormFieldDirective,
        DefaultEventBinder,
        ModelDirective,
        CheckboxEventBinder,
        RadioEventBinder,
        SelectEventBinder,
        NumberEventBinder,
        RangeEventBinder,
        OptionDirective
    ]
})

export function FormModule() {}