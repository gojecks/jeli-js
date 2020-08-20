import { FormControlService } from '@jeli/form'
Element({
    selector: "router-form-page",
    DI: [FormControlService],
    templateUrl: './route-form-page.html',
    exposeView: true
})
export function RouterPageElement() {
    this.testForm = new FormControlService({
        radio: {
            value: 1,
            validators: {
                required: true
            }
        },
        input: {
            value: undefined,
            disabled: true,
            validators: {
                required: true,
                minlength: 6
            }
        },
        textarea: {
            value: "Testing the default value",
            disabled: false,
            validators: {
                required: true,
                minLength: 6,
                maxLength: 100
            }
        },
        checkbox: {
            value: true,
            validators: {
                requiredTrue: true
            }
        },
        select: {
            value: ["select_2"],
            validators: {
                required: true
            }
        },
        file: {
            validators: {
                required: true
            }
        },
        range: {
            value: 50,
            eventType: 'blur',
            validators: {
                maxlength: 90
            }
        },
        number: {
            value: 500
        }
    });
}

RouterPageElement.prototype.didInit = function() {
    this.testForm.patchValue({
        number: 10
    });
    this.testForm.addField('personalInfo', new FormControlService({
        firstName: {
            value: null,
            validators: {
                required: true
            }
        },
        lastName: {
            value: null,
            validators: {
                required: true
            }
        },
        age: {
            value: null,
            validators: {
                required: true
            }
        }
    }));

    console.log(this.testForm)
}