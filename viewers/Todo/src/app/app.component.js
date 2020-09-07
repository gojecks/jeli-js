import { HttpService } from '@jeli/http';
Element({
    selector: 'app-root',
    templateUrl: './app-root.html',
    styleUrl: './app-root.css',
    viewChild: ["testPlace=#testPlace", "model:jModel=#input"],
    DI: [HttpService]
})
export function AppRootElement(http) {
    this.test = true;
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
        console.log(this);
    }

    this.print = function(list) {
        console.log(list);
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