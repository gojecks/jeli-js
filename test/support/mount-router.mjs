import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import * as helpersUtils from '@jeli/helpers/utils.js';
import { core } from './mount.mjs';

/**
 * IMPORTANT: importing/evaluating @jeli/router's compiled bundle has a
 * confirmed, real side effect - it eagerly registers RouterModule's
 * `services: [{name: APP_BOOTSTRAP, ...}]` entry into the GLOBAL,
 * process-wide APP_BOOTSTRAP ProviderToken (bootstrap/index.js) merely by
 * being evaluated, not only when an app module that actually requires
 * RouterModule gets bootstrapped. Confirmed via a minimal repro: importing
 * this file, then mounting a totally unrelated component with no router
 * dependency, throws `location is not defined` from inside
 * RouterInitService/LocationService.initializeRoute - APP_BOOTSTRAP has no
 * concept of "this callback only applies to apps that opted into routing."
 * Net effect: this file must never be imported in the same process as
 * router-unrelated tests. See package.json's `test` script - router-
 * touching spec files run as a separate mocha invocation specifically for
 * this reason, not merged into the main glob.
 */

/**
 * @jeli/router's UMD bundle expects `global.jeli['core']`/`global.jeli['helpers/utils']`
 * - see the bundle's own UMD wrapper header.
 */
globalThis.jeli['helpers/utils'] = helpersUtils;

/**
 * WORKAROUND, not a fix: same flattened-scope bundler bug documented in
 * mount.mjs/mount-http.mjs - bare `@jeli/core`/`@jeli/helpers/utils`
 * imports not hoisted into `core.X`/`utils.X` bindings inside the
 * generated bundle.
 */
for (const name of [
    'APP_BOOTSTRAP', 'ComponentFactoryResolver', 'DOMHelper', 'EventEmitter',
    'EventManager', 'InterceptorResolver', 'ProviderToken', 'compileModule',
    'errorBuilder', 'rxLoop'
]) {
    if (!(name in globalThis)) globalThis[name] = core[name];
}
for (const name of Object.keys(helpersUtils)) {
    if (!(name in globalThis)) globalThis[name] = helpersUtils[name];
}

const bundlePath = fileURLToPath(new URL('../../dist/router/bundles/jeli-router-umd.js', import.meta.url));
vm.runInThisContext(readFileSync(bundlePath, 'utf8'), {
    filename: bundlePath,
    importModuleDynamically: (specifier) => import(specifier)
});

export { core };
export const router = globalThis.jeli.router;
