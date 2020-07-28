import { FormControlService } from '@jeli/form'
Element({
    selector: 'app-root',
    templateUrl: './app-root.html',
    DI: [FormControlService],
    styleUrl: './app-root.css',
    viewChild: ["testPlace=#testPlace", "model=:model"]
})
export function AppRootElement(formControlService) {
    this.test = true;
    this.testForm = new formControlService({
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

    this.error = false;
    this.keys = [2];
    this.removeKey = function(key) {
        this.keys.splice(key, 1);
    };

    this.selectItemTest = [];
    for (var i = 0; i < 100; i++) {
        this.selectItemTest.push({
            label: "test_" + i,
            value: i
        });
    }

    this.selectedItem = this.selectItemTest[30];

    this.pageHeading = "My First Todo App";
    this.todos = [];
    this.removeItemCount = 0;
    this.counter = 0;
    this.todoDescription = "";

    this.range = function(start, end) {
        var value = [];
        while (end > start) {
            value.push(start);
            start++;
        }

        return value;
    };

    this.didInit = function() {
        this.testForm.patchValue({
            number: 10
        });
        this.testForm.addField('personalInfo', new formControlService({
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
        // this.testForm.valueChanges.subscribe(console.log)
        console.log(this.testForm)
    }
}

AppRootElement.prototype.addTodo = function() {
    if (this.todoDescription) {
        this.todos.push({
            description: this.todoDescription,
            details: "",
            done: false
        });
        this.todoDescription = "";
    }
};

AppRootElement.prototype.removeTodo = function(index) {
    console.log('removing Todo:', index);
    if (this.todos[index]) {
        this.todos.splice(index, 1);
    }
};

AppRootElement.prototype.markAsRemoved = function(done, todo) {
    todo.done = done;
    if (done) {
        this.removeItemCount++;
    } else if (this.removeItemCount > 0) {
        this.removeItemCount--;
    }
};

AppRootElement.prototype.generateMock = function(total) {
    var data = [];
    for (var i = 0; i < total; i++) {
        data.push({
            description: "Test_From_" + this.counter++,
            done: false,
            details: ""
        });
    }

    this.todos = data;
    data = null;
};