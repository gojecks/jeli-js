import assert from 'node:assert/strict';
import { http } from './support/mount-http.mjs';

/**
 * Verifies the fetch-based transport (packages/http/src/fetch/) has
 * behavior parity with the default XMLHttpRequest transport: both must
 * round-trip a request through the interceptor chain and emit identically
 * via CoreHttp's Subject (data + HttpResponse-shaped second argument to
 * `.subscribe(onSuccess, onError, onCompleted)`), for both the success and
 * error paths. Since @jeli/http's own classes (HttpRequest/HttpTransport/
 * HttpResponse) only ever touch an "xhrInstance-shaped" object - never
 * XMLHttpRequest directly - these tests provide minimal fake XHR/fetch
 * globals to exercise each transport under controlled conditions, matching
 * exactly the surface those classes actually read (see
 * fetch-xhr-adapter.js's own doc comment for the enumerated surface).
 */

class FakeXHR {
    constructor() {
        this.readyState = 0;
        this.status = 0;
        this.responseText = '';
        this.withCredentials = false;
        this._listeners = {};
        this._headers = {};
    }
    addEventListener(type, fn) {
        (this._listeners[type] = this._listeners[type] || []).push(fn);
    }
    _emit(type) {
        (this._listeners[type] || []).forEach((fn) => fn({}));
    }
    open(method, url) {
        this._method = method;
        this._url = url;
        this.readyState = 1;
    }
    setRequestHeader(name, value) {
        this._headers[name] = value;
    }
    getResponseHeader(name) {
        return name === 'Content-Type' ? 'application/json' : null;
    }
    send() {
        // simulate the server synchronously, matching the fixture this
        // suite installs on globalThis.__fakeXhrFixture before each call
        var fixture = globalThis.__fakeXhrFixture;
        queueMicrotask(() => {
            this.status = fixture.status;
            this.responseText = fixture.body;
            this.readyState = 4;
            if (fixture.status >= 200 && fixture.status < 300) {
                this._emit('load');
            } else {
                this._emit('error');
            }
        });
    }
}

function installFakeFetch(fixture) {
    globalThis.fetch = async () => ({
        status: fixture.status,
        headers: { get: (name) => (name === 'Content-Type' ? 'application/json' : null) },
        text: async () => fixture.body,
        body: null
    });
}

function subscribeOnce(subject) {
    return new Promise((resolve, reject) => {
        subject.subscribe(
            (data, response) => resolve({ data, response }),
            (err) => reject(err)
        );
    });
}

describe('@jeli/http transport parity (XHR vs fetch)', () => {
    afterEach(() => {
        http.useXhrTransport();
        delete globalThis.__fakeXhrFixture;
        delete globalThis.fetch;
    });

    it('XHR transport: a successful GET emits parsed JSON data and a response object', async () => {
        globalThis.XMLHttpRequest = FakeXHR;
        globalThis.__fakeXhrFixture = { status: 200, body: JSON.stringify({ hello: 'world' }) };

        var result = await subscribeOnce(http.CoreHttp('/api/test', { type: 'get' }, () => {}));
        assert.deepEqual(result.data, { hello: 'world' });
        assert.equal(result.response.success, true);
        assert.equal(result.response.status, 200);
    });

    it('fetch transport: the same successful GET emits identically shaped data and response', async () => {
        http.useFetchTransport();
        installFakeFetch({ status: 200, body: JSON.stringify({ hello: 'world' }) });

        var result = await subscribeOnce(http.CoreHttp('/api/test', { type: 'get' }, () => {}));
        assert.deepEqual(result.data, { hello: 'world' });
        assert.equal(result.response.success, true);
        assert.equal(result.response.status, 200);
    });

    it('XHR transport: an error status is delivered on the error channel', async () => {
        globalThis.XMLHttpRequest = FakeXHR;
        globalThis.__fakeXhrFixture = { status: 500, body: 'server error' };

        await assert.rejects(subscribeOnce(http.CoreHttp('/api/test', { type: 'get' }, () => {})));
    });

    it('fetch transport: an error status is delivered on the error channel identically', async () => {
        http.useFetchTransport();
        installFakeFetch({ status: 500, body: 'server error' });

        await assert.rejects(subscribeOnce(http.CoreHttp('/api/test', { type: 'get' }, () => {})));
    });
});
