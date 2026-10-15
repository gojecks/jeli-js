# @jeli/common

Structural directives and built-in pipes for [jeli](https://github.com/gojecks/jeli-js) — `*if`/`*for`/`*switch` (and the `@if`/`@for`/`@switch` block-syntax equivalents), class bindings, and template pipes like `json`, `currency`, `orderBy`.

## Install

```sh
npm install @jeli/common
```

## Usage

Register `CommonModule` in your app module:

```js
import { CommonModule } from '@jeli/common';

jModule({
    requiredModules: [CommonModule],
    ...
})
export class AppModule {}
```

```html
@if (todos.length) {
    <ul>
        @for (todo of todos; idx = index) {
            <li {class}="{done: todo.done}">${idx}: ${todo.description}</li>
        }
    </ul>
} @else {
    <p>No todos yet.</p>
}
```

Need date/time formatting too? `@jeli/common/datetime` ships a separate `DateTimeModule` (`dateTime`/`timeAgo` pipes, a `<jx-calendar>` element) — import it alongside `CommonModule`.

Full reference: **[API docs](https://gojecks.github.io/jeli-js/api/#common)** · **[Guide](https://gojecks.github.io/jeli-js/guide/#structural)**

## License

MIT
