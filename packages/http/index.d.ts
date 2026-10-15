/**
 * Type declarations for @jeli/http
 *
 * Hand-authored from the actual runtime source. Covers every symbol
 * reachable from `public.api.js` -> `src/http.module.js`, `src/xhr/utils.js`,
 * and `csrf/http.csrf.module.js` (jeli's compiler flattens the whole
 * reachable import graph's exports into one package surface - see
 * @jeli/compiler-cli/lib/core/compiler.js). This also picks up the fetch()
 * transport opt-in (`useFetchTransport`/`useXhrTransport`/`FetchXHRAdapter`)
 * reachable transitively through `http.module.js` -> `http.core.js` ->
 * `xhr/http.js` -> `http.request.js`, which is newer than the ~9-symbol
 * estimate in the task brief.
 *
 * OUT OF SCOPE: `Service({...})`/`jModule({...})` decorator option objects
 * (see packages/core/index.d.ts header for the full rationale).
 */

/// <reference path="../core/index.d.ts" />

import { ProviderToken, Subject } from '@jeli/core';

export declare class HttpModule {}

/** Multi-provider token for registered HTTP request interceptors (`{ resolve(request, next, reject) }`). */
export declare const HTTP_INTERCEPTORS: ProviderToken<any[]>;

/** True when the XHR response's Content-Type indicates JSON (or the header is absent). */
export declare function isJSONResponse(xhrInstance: XMLHttpRequest | any): boolean;
/** Parse `response` as JSON; throws if `response` is truthy and invalid JSON. */
export declare function parseJSON(response: string): any;

/** Adds CSRF-cookie-to-header forwarding (`HttpCookieManager` + an `HTTP_INTERCEPTORS` registration). */
export declare class HttpCSRFModule {
    static setCookieValue(config: Partial<{ cookieName: string; headerName: string }>): void;
}

/** Switch @jeli/http's transport to a `fetch()`-backed adapter (no upload/unknown-length progress, no native timeout). */
export declare function useFetchTransport(): void;
/** Switch @jeli/http's transport back to the default `XMLHttpRequest`-backed implementation. */
export declare function useXhrTransport(): void;

/** Callable HTTP client returned by injecting `HttpService`; also exposes verb-specific shorthands. */
export interface HttpServiceInstance {
    (url: string, options?: Record<string, any>): Subject<any>;
    get(url: string, data?: any, headers?: Record<string, string>): Subject<any>;
    post(url: string, data?: any, headers?: Record<string, string>): Subject<any>;
    put(url: string, data?: any, headers?: Record<string, string>): Subject<any>;
    patch(url: string, data?: any, headers?: Record<string, string>): Subject<any>;
    delete(url: string, data?: any, headers?: Record<string, string>): Subject<any>;
    request(url: string, data?: any, headers?: Record<string, string>): Subject<any>;
}
/** DI factory (registered as the `HttpService` service) producing an `HttpServiceInstance`. */
export declare function HttpService(changeDetector: any): HttpServiceInstance;

export declare class HttpCookieManager {
    readonly cookies: Record<string, string>;
    constructor();
    set(name: string, value: string | null, options?: { expires?: number | Date; path?: string; domain?: string; secure?: boolean }): void;
    get(name: string): string | undefined;
}

export declare const csrfCookieConfig: { cookieName: string; headerName: string };

/** Interceptor that attaches the CSRF cookie's value as a request header. */
export declare class CSRFCookieHeaderService {
    cookieManager: HttpCookieManager;
    constructor(cookieManager: HttpCookieManager);
    resolve(httpRequest: HttpRequest, next: () => void): void;
}

/** Swap the factory used to create the underlying transport object (default: real `XMLHttpRequest`). */
export declare function setXhrFactory(factory: () => XMLHttpRequest | FetchXHRAdapter): void;

export declare class HttpRequest {
    url: string;
    type: string;
    processData: boolean;
    headers: Record<string, string>;
    asynchronous: boolean;
    data: any;
    xhrInstance: XMLHttpRequest | FetchXHRAdapter;
    cache: boolean;
    withCredentials: boolean;
    constructor(url: string | Record<string, any>, options?: Record<string, any>);
    progress(progressCallback: (event: any) => void): void;
    setHeaders(headers: Record<string, string>): void;
    setWithCredentials(flag: boolean): void;
    processRequest(): void;
    processRequestHeaders(): void;
}

/** Minimal `XMLHttpRequest`-compatible adapter backed by `fetch()` (used when `useFetchTransport()` is active). */
export declare class FetchXHRAdapter {
    readyState: number;
    status: number;
    responseText: string;
    withCredentials: boolean;
    constructor();
    addEventListener(type: 'load' | 'timeout' | 'error' | 'abort' | 'progress', listener: (event: any) => void): void;
    open(method: string, url: string, async?: boolean): void;
    setRequestHeader(name: string, value: string): void;
    getResponseHeader(name: string): string | null;
    send(body?: any): void;
    abort(): void;
}

/** Perform an HTTP request, returning a `Subject` that emits `(data, response)` on success or errors with an `HttpRequestError`. */
export declare function CoreHttp(url: string, options: Record<string, any>, changeDetection?: () => void): Subject<any>;

export declare class HttpRequestError {
    errorType: string | null;
    message: any;
    status: number;
    constructor(message: any);
    setMessage(message: any): void;
    setErrorType(type: string): void;
}

export declare class HttpResponse {
    status: number;
    readyState: number;
    url: string;
    data: any;
    success: boolean;
    headers: { getResponseHeader(name: string | string[]): string | null | Array<string | null> };
    constructor(httpRequest: HttpRequest);
}
