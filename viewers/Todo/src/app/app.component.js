const STORAGE_KEY = 'jeli-todo-example';

Element({
    selector: 'app-root',
    templateUrl: './app-root.html',
    styleUrl: './app-root.css'
})
export class AppRootElement {
    constructor() {
        this.pageHeading = 'jeli Todos';
        this.todos = loadTodos();
        this.description = '';
        this.filter = 'all'; // 'all' | 'active' | 'completed'
        this.editingIndex = -1;
        this.editingText = '';
    }

    addTodo() {
        const description = this.description.trim();
        if (!description) return;
        this.todos.push({ description, done: false });
        this.description = '';
        this.persist();
    }

    removeTodo(index) {
        this.todos.splice(index, 1);
        this.persist();
    }

    toggleDone(index) {
        this.todos[index].done = !this.todos[index].done;
        this.persist();
    }

    startEdit(index) {
        this.editingIndex = index;
        this.editingText = this.todos[index].description;
    }

    saveEdit(index) {
        const text = this.editingText.trim();
        if (text) this.todos[index].description = text;
        this.editingIndex = -1;
        this.persist();
    }

    cancelEdit() {
        this.editingIndex = -1;
    }

    onEditKeyUp(event, index) {
        if (event.key === 'Enter') this.saveEdit(index);
        if (event.key === 'Escape') this.cancelEdit();
    }

    setFilter(filter) {
        this.filter = filter;
    }

    clearCompleted() {
        this.todos = this.todos.filter((todo) => !todo.done);
        this.persist();
    }

    get visibleTodos() {
        if (this.filter === 'active') return this.todos.filter((todo) => !todo.done);
        if (this.filter === 'completed') return this.todos.filter((todo) => todo.done);
        return this.todos;
    }

    get remaining() {
        return this.todos.filter((todo) => !todo.done).length;
    }

    persist() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.todos));
        } catch (e) { /* localStorage unavailable (e.g. private browsing) - not fatal */ }
    }
}

function loadTodos() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : defaultTodos();
    } catch (e) {
        return defaultTodos();
    }
}

function defaultTodos() {
    return [
        { description: 'Learn jeli', done: true },
        { description: 'Build something with @if / @for blocks', done: false },
        { description: 'Ship it', done: false }
    ];
}
