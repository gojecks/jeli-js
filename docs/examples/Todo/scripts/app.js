(function() {
    'use strict';
    jeli('Todo', {
            delimiter: ['${', '}'],
            requiredModules: ['jeli']
        })
        .element({
            selector: 'app-root',
            templateUrl: './app-root.html',
            DI: ['testService']
        }, appRootElement)
        .element({
            selector: 'test-place',
            template: '<h4>I am a place Component</h4><j-place #testContent context={todos:todos}></j-place><j-place #testContent2 context={text:text}></j-place>'
        }, testPlace)
        .element({
            selector: 'test-element',
            props: ['userId', 'clickEvent'],
            template: "<div>user input ${userId} <button @click='remove(userId)'> Remove </button></div>\
                <j-place></j-place>"
        }, testElement)
        .service('testService', function($http) {
            // console.log('$http:', $http);
        })
        .service('Test', ['ElementRef', function(elementRef) {
            this.viewWillDestroy = function() {
                console.log('destroying');
            }
        }]);

    function testElement() {
        this.userId;
        this.clickEvent;
    }

    testElement.prototype.didInit = function() {
        console.log(this);
    };

    function testPlace() {
        this.todos = [];
        for (var i = 0; i < 5; i++) {
            this.todos.push(i);
        }

    }

    testPlace.prototype.onInit = function() {
        console.log('Test Place init');
    }

    function appRootElement(testService) {
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
        this.addTodo = function() {
            if (this.todoDescription) {
                this.todos.push({ description: this.todoDescription, done: false });
                this.todoDescription = "";
            }
        };

        this.removeTodo = function(index) {
            console.log('removing Todo:', index);
            if (this.todos[index]) {
                this.todos.splice(index, 1);
            }
        };

        this.markAsRemoved = function(done) {
            if (done) {
                this.removeItemCount++;
            } else {
                this.removeItemCount--;
            }
        };

        this.generateMock = function(total) {
            var data = [];
            for (var i = 0; i < total; i++) {
                data.push({ description: "Test_From_" + i, done: false });
            }

            this.todos = data;
            data = null;
        };

        this.todoDescription = "";

        this.range = function(start, end) {
            var value = [];
            while (end > start) {
                value.push(start);
                start++;
            }

            return value;
        };
    }
})();

jeli.app.bootstrapWith('Todo', 'app-root');