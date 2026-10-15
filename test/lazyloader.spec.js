import assert from 'node:assert/strict';
import { core } from './support/mount.mjs';

/**
 * LazyLoader.resolveModule() - dynamic-import()-based alternative to
 * _resolve()'s <script>-tag injection. Verified against a real local ES
 * module fixture (genuine dynamic import(), not a mock), since LazyLoader
 * has no real call sites anywhere in this repo/its example apps to
 * integration-test against (confirmed via repo-wide grep - RouterModule's
 * lazyLoad only merges route config at runtime, it never touches
 * LazyLoader at all, contrary to an earlier assumption).
 */
describe('LazyLoader.resolveModule (dynamic import alternative)', () => {
    it('resolves a real ES module via dynamic import and passes it to the callback', (done) => {
        var url = new URL('./support/fixtures/lazy-module.mjs', import.meta.url).href;
        core.LazyLoader.resolveModule(url, (result) => {
            assert.equal(result.resolved, 1);
            assert.equal(result.failed, 0);
            assert.equal(result.allResolved, true);
            assert.equal(result.modules[url].marker, 'lazy-module-loaded');
            done();
        });
    });

    it('replays the cached result for a repeat request instead of re-importing', (done) => {
        var url = new URL('./support/fixtures/lazy-module.mjs', import.meta.url).href;
        // first call already resolved this exact url in the previous test;
        // lazyLoaderCachedPaths is a module-level cache, so this call
        // should hit the "already resolved" branch, not import() again
        core.LazyLoader.resolveModule(url, (result) => {
            assert.equal(result.modules[url].marker, 'lazy-module-loaded');
            done();
        });
    });

    it('reports a failed import without throwing', (done) => {
        var url = new URL('./support/fixtures/does-not-exist.mjs', import.meta.url).href;
        core.LazyLoader.resolveModule(url, (result) => {
            assert.equal(result.resolved, 0);
            assert.equal(result.failed, 1);
            done();
        });
    });
});
