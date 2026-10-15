import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import * as helpersUtils from '@jeli/helpers/utils.js';
import { core } from './mount.mjs';

/**
 * @jeli/http's UMD bundle expects `global.jeli['core']`/`global.jeli['helpers']`
 * (already seeded by mount.mjs, imported above for its side effect) plus
 * `global.jeli['helpers/utils']` - see the bundle's own UMD wrapper header.
 */
globalThis.jeli['helpers/utils'] = helpersUtils;

/**
 * WORKAROUND, not a fix: same flattened-scope bundler bug documented in
 * mount.mjs (bare `@jeli/core` imports not hoisted to `core.X` bindings
 * inside the generated bundle) - here it hits `xhr/utils.js`'s `ProviderToken`,
 * `xhr/http.js`'s `Subject`/`InterceptorResolver`, and `http.core.js`'s
 * `ChangeDetector`.
 */
for (const name of ['Subject', 'InterceptorResolver', 'ChangeDetector', 'ProviderToken']) {
    if (!(name in globalThis)) globalThis[name] = core[name];
}

const bundlePath = fileURLToPath(new URL('../../dist/http/bundles/jeli-http-umd.js', import.meta.url));
vm.runInThisContext(readFileSync(bundlePath, 'utf8'), { filename: bundlePath });

export { core };
export const http = globalThis.jeli.http;
