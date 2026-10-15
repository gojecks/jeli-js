/**
 * A minimal XMLHttpRequest-compatible adapter backed by `fetch()`.
 *
 * Implements only the surface `HttpRequest`/`HttpTransport`/`HttpResponse`
 * actually consume on `xhrInstance` (confirmed by grepping every
 * `xhrInstance.*` access across the package): `open`, `setRequestHeader`,
 * `send`, `addEventListener('load'|'timeout'|'error'|'abort'|'progress')`,
 * `getResponseHeader`, `status`, `readyState`, `responseText`,
 * `withCredentials`. Because that's the entire surface, none of those three
 * classes need to change at all to support a fetch-based transport - they
 * only ever see "an xhrInstance-shaped object."
 *
 * Known limitations vs real XHR:
 * - No upload progress (fetch has no native equivalent to XHR's
 *   `upload.onprogress`).
 * - Download 'progress' only fires when the response has a `Content-Length`
 *   header - otherwise the total size is unknown and progress can't be
 *   computed, so no events fire (callers relying on upload or
 *   unknown-length download progress should stay on the default XHR
 *   transport).
 * - No native request timeout (XHR's `.timeout` property isn't set anywhere
 *   in this codebase today, so this isn't a regression in practice - nothing
 *   currently relies on it).
 */
export class FetchXHRAdapter {
    constructor() {
        this.readyState = 0; // UNSENT
        this.status = 0;
        this.responseText = '';
        this.withCredentials = false;
        this._method = 'GET';
        this._url = '';
        this._headers = {};
        this._listeners = {};
        this._responseHeaders = null;
        this._abortController = new AbortController();
    }

    addEventListener(type, listener) {
        (this._listeners[type] = this._listeners[type] || []).push(listener);
    }

    _emit(type, event) {
        (this._listeners[type] || []).forEach(function (fn) { fn(event); });
    }

    open(method, url /*, async - fetch has no synchronous mode; every real
        caller in this codebase passes true, so this argument is accepted
        for XHR-signature compatibility but intentionally not honored */) {
        this._method = method;
        this._url = url;
        this.readyState = 1; // OPENED
    }

    setRequestHeader(name, value) {
        this._headers[name] = value;
    }

    getResponseHeader(name) {
        return this._responseHeaders ? this._responseHeaders.get(name) : null;
    }

    send(body) {
        fetch(this._url, {
            method: this._method,
            headers: this._headers,
            body: body || undefined,
            credentials: this.withCredentials ? 'include' : 'same-origin',
            signal: this._abortController.signal
        }).then((response) => this._handleResponse(response))
          .catch((err) => this._handleError(err));
    }

    async _handleResponse(response) {
        this.status = response.status;
        this._responseHeaders = response.headers;

        var total = Number(response.headers.get('Content-Length')) || 0;
        if (total && response.body && response.body.getReader) {
            var reader = response.body.getReader();
            var loaded = 0;
            var chunks = [];
            var read;
            while (!(read = await reader.read()).done) {
                chunks.push(read.value);
                loaded += read.value.length;
                this._emit('progress', { loaded: loaded, total: total, lengthComputable: true });
            }
            this.responseText = new TextDecoder().decode(concatChunks(chunks, loaded));
        } else {
            this.responseText = await response.text();
        }

        this.readyState = 4; // DONE
        this._emit('load', {});
    }

    _handleError(err) {
        if (err && err.name === 'AbortError') {
            this._emit('abort', err);
        } else {
            this._emit('error', err);
        }
    }

    abort() {
        this._abortController.abort();
    }
}

function concatChunks(chunks, totalLength) {
    var out = new Uint8Array(totalLength);
    var offset = 0;
    for (var i = 0; i < chunks.length; i++) {
        out.set(chunks[i], offset);
        offset += chunks[i].length;
    }
    return out;
}
