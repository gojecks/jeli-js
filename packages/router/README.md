# @jeli/router

Client-side routing for [jeli](https://github.com/gojecks/jeli-js) — route configuration, hash or History-API navigation, guards/interceptors, and lazy-loaded route modules.

## Install

```sh
npm install @jeli/router
```

## Usage

```js
import { RouterModule } from '@jeli/router';

jModule({
    requiredModules: [RouterModule],
    ...
})
export class AppRouteModule {
    constructor() {
        RouterModule.setRoutes([
            { name: 'home', url: '/', component: HomeElement, fallback: true },
            { name: 'user', url: '/users/:id', component: UserElement }
        ]);
    }
}
```

Register a class against `ROUTE_INTERCEPTOR` (a `{ resolve(routeInstance, next, reject) }`-shaped guard) to run before a navigation completes — jeli has no per-route `canActivate`, so a guard applies globally and decides per-route inside itself. `getHref`/`getRoute` build URLs programmatically outside of a template.

Full reference: **[API docs](https://gojecks.github.io/jeli-js/api/#router)** · **[Guide](https://gojecks.github.io/jeli-js/guide/#router)**

## License

MIT
