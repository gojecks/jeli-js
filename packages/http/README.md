# @jeli/http

HTTP client for [jeli](https://github.com/gojecks/jeli-js) — `HttpService`, an interceptor chain, and CSRF cookie handling. XHR-based by default, with an opt-in `fetch()` transport.

## Install

```sh
npm install @jeli/http
```

## Usage

```js
import { HttpModule } from '@jeli/http';

jModule({
    requiredModules: [HttpModule],
    ...
})
export class AppModule {}
```

```js
import { HttpService } from '@jeli/http';

Service({ DI: [HttpService] })
export class UsersService {
    constructor(http) { this.http = http; }
    getUsers() { return this.http.get('/api/users'); }
}
```

`HttpService` methods return a `Subject`, not a Promise — `.subscribe(onSuccess, onError)`. Register a class against `HTTP_INTERCEPTORS` to intercept every request/response; call `useFetchTransport()` to switch the underlying transport from XHR to `fetch()`.

Full reference: **[API docs](https://gojecks.github.io/jeli-js/api/#http)** · **[Guide](https://gojecks.github.io/jeli-js/guide/#http)**

## License

MIT
