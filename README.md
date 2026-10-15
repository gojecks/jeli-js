# jeli

jeli is a decorator-based JavaScript framework for building interactive web UIs — components, real dependency injection, and a compiler-driven template language (compiled ahead-of-time by [`jeli-cli`](https://github.com/gojecks/jeli-cli)), with routing, reactive forms, HTTP, and first-class TypeScript types as first-party packages.

```js
Element({
    selector: 'app-counter',
    template:
        '<button @click="decrement()">-</button>' +
        '<span>${count}</span>' +
        '<button @click="increment()">+</button>'
})
export class CounterElement {
    constructor() { this.count = 0; }
    increment() { this.count++; }
    decrement() { this.count--; }
}
```

📖 **[Guide](https://gojecks.github.io/jeli-js/guide/)** · 📚 **[API reference](https://gojecks.github.io/jeli-js/api/)**

## Packages

This is a monorepo (npm/yarn workspaces, `packages/*`). Each package is published independently under the `@jeli` npm scope:

| Package | Purpose |
|---|---|
| [`@jeli/core`](packages/core) | Runtime: bootstrap, change detection, dependency injection, the DOM renderer, reactive primitives |
| [`@jeli/common`](packages/common) | Structural directives (`*if`/`*for`/`*switch`), built-in pipes, `@jeli/common/datetime` |
| [`@jeli/form`](packages/form) | Reactive form controls, validators, value accessors |
| [`@jeli/http`](packages/http) | `HttpService` (XHR by default, opt-in `fetch()` transport), interceptors, CSRF handling |
| [`@jeli/router`](packages/router) | Client-side routing: location strategies, guards, lazy loading |

Compiled by [`@jeli/compiler-cli`](https://github.com/gojecks/jeli-cli) (part of the sibling `jeli-cli` toolchain), which also provides the `jeli` CLI (`create`/`build`/`serve`/`new`).

## Quick start

```sh
npm install -g @jeli/cli
jeli create my-app
cd my-app
jeli serve
```

See the [installation guide](https://gojecks.github.io/jeli-js/guide/#installation) for adding jeli to an existing project instead.

## Development (this repo)

```sh
npm install
npm test          # mocha, real jsdom-mounted component tests under test/
npm run build:all # builds every package into dist/<pkg>/
```

`viewers/Todo` is an in-repo example app; its build output is checked into `docs/examples/Todo/`. `jeli.json`'s `resolve.alias` expects a sibling `js-helpers` checkout at `../js-helpers` — clone [`gojecks/js-helpers`](https://github.com/gojecks/js-helpers) alongside this repo before building.

## Contributing

Issues and PRs welcome — [gojecks/jeli-js/issues](https://github.com/gojecks/jeli-js/issues). For the compiler/CLI itself, see [gojecks/jeli-cli](https://github.com/gojecks/jeli-cli).

## License

MIT
