import { FormControlDirective } from './form-control.directive';
import { FormControlService } from './form-control.service';
import { FormFieldControlDirective } from './form-field-control.directive';
import { FormFieldControlService } from './form-field-control.service';
import { FormFieldDirective } from './form-field.directive';
import { FormValidatorService } from './form-validator.service';
import { DefaultEventBinder } from './default.event.accessor';
import './utils';

/**
 * JeliFromModule
 */
jModule({
    services: [
        FormControlService,
        FormFieldControlService,
        FormValidatorService
    ],
    selectors: [
        FormControlDirective,
        FormFieldControlDirective,
        FormFieldDirective,
        DefaultEventBinder
    ]
})

export function jEliFormModule() {}