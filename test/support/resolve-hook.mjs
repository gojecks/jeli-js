import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

/**
 * The installed `@jeli/helpers` dependency ships ESM source with
 * extensionless relative imports (`import inarray from './fns/inarray'`)
 * and no `"type": "module"` in its package.json. This hook lets it load
 * directly under Node: try the specifier as-is first, and on failure
 * retry with `.js` / `/index.js` appended.
 */
// apps resolve `@jeli/helpers` to the sibling js-helpers repo (jeli.json resolve.alias), not the stale npm copy -
// test against the same code (e.g. its deep-equal `isequal`, which LifeCycle.setValue depends on)
const SIBLING_HELPERS = new URL('../../../js-helpers/', import.meta.url);

export async function resolve(specifier, context, nextResolve) {
    if (specifier === '@jeli/helpers' || specifier.startsWith('@jeli/helpers/')) {
        const subpath = specifier === '@jeli/helpers' ? 'index.js' : specifier.slice('@jeli/helpers/'.length);
        return resolve(new URL(subpath, SIBLING_HELPERS).href, context, nextResolve);
    }
    if (!specifier.startsWith('.') && !specifier.startsWith('file:')) {
        return nextResolve(specifier, context);
    }

    try {
        return await nextResolve(specifier, context);
    } catch (err) {
        if (err.code !== 'ERR_MODULE_NOT_FOUND' && err.code !== 'ERR_UNSUPPORTED_DIR_IMPORT') {
            throw err;
        }
        for (const suffix of ['.js', '/index.js']) {
            try {
                return await nextResolve(specifier + suffix, context);
            } catch {
                // try next suffix
            }
        }
        throw err;
    }
}

/**
 * Sniff source text and force `format: 'module'` when a `.js` file looks
 * like ESM but its nearest package.json doesn't declare `"type": "module"`
 * (true of the installed `@jeli/helpers` package).
 */
export async function load(url, context, nextLoad) {
    if (context.format !== 'commonjs' || !url.startsWith('file://') || !url.endsWith('.js')) {
        return nextLoad(url, context);
    }

    const source = await readFile(fileURLToPath(url), 'utf8');
    if (/^\s*(import\s|export\s)/m.test(source)) {
        return { format: 'module', source, shortCircuit: true };
    }

    return nextLoad(url, context);
}
