import { setXhrFactory } from '../http.request';
import { FetchXHRAdapter } from './fetch-xhr-adapter';

/**
 * Opt-in: switch @jeli/http's transport from XMLHttpRequest to a
 * fetch()-backed adapter (see fetch-xhr-adapter.js for the exact surface
 * implemented and its known limitations vs real XHR - no upload progress,
 * no unknown-length download progress, no native timeout). XHR stays the
 * default; call this once (e.g. in your app's bootstrap, before any
 * HttpService request is made) to switch.
 *
 * Mirrors Angular's `provideHttpClient(withFetch())` opt-in shape, adapted
 * to this framework's plain-function module style rather than introducing
 * a new DI-token-based configuration system for a single flag.
 */
export function useFetchTransport() {
    setXhrFactory(function () { return new FetchXHRAdapter(); });
}

/**
 * Switch back to the default XMLHttpRequest-backed transport.
 */
export function useXhrTransport() {
    setXhrFactory(function () { return new XMLHttpRequest(); });
}
