# @jeli/core

The runtime for [jeli](https://github.com/gojecks/jeli-js) — bootstrap, change detection, dependency injection, the DOM renderer, and reactive primitives (`Subject`, `rxWatch`, ...). Components are compiled ahead-of-time by [`@jeli/compiler-cli`](https://github.com/gojecks/jeli-cli); this package is what the compiled output runs against.

## Install

```sh
npm install @jeli/core
```

Scaffolding a new project? Use the CLI instead — it wires this up for you:

```sh
npm install -g @jeli/cli
jeli create my-app
```

## Usage

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

```js
import { bootStrapApplication } from '@jeli/core';
import { AppModule } from './app/app.module';

bootStrapApplication(AppModule);
```

## What's in here

- `Element` / `Directive` / `Service` / `Provider` / `Pipe` / `jModule` — component/DI decorators (compiled by `jeli-cli`, not real TC39 decorators).
- `bootStrapApplication`, `ChangeDetector`, per-component `changeDetector` (`markAsManual`/`manualCheck`/`onlySelf`) — see the [change detection guide](https://gojecks.github.io/jeli-js/guide/#change-detection).
- `Subject`, `rxWatch`, `debounce`, and a small hand-rolled reactive layer.
- `animate` / `createAnimation` — an imperative + declarative animation API.
- `global.jeli.devtools` — a component-tree walker and DI inspector, available in any console once this package loads.
- Ships with TypeScript types (`index.d.ts`) — see the [TypeScript notes](https://gojecks.github.io/jeli-js/guide/#typescript).

Full reference: **[API docs](https://gojecks.github.io/jeli-js/api/#element)** · **[Guide](https://gojecks.github.io/jeli-js/guide/)**

## License

MIT
