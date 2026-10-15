import assert from 'node:assert/strict';
import { core, renderToString } from '../server/render-to-string.mjs';

/**
 * Phase 0 of the SSR/hydration plan - server/render-to-string.mjs.
 * See .claude/plans/greedy-singing-mist.md for the full design.
 */
describe('server/render-to-string (SSR Phase 0)', () => {
    it('renders a simple component tree to an HTML string', async () => {
        function TestRoot() {
            this.label = 'world';
        }
        TestRoot.ctors = { selector: 'app-root' };
        TestRoot.view = (elementRef) => core.ViewParser.jit(elementRef, [
            { type: 1, name: 'div', index: 0, isc: false, children: [
                { type: 3, ast: ['Hello ${0}', [['${0}', { prop: 'label' }]], false] }
            ] }
        ], {});

        const html = await renderToString(TestRoot, 'app-root');
        assert.match(html, /<app-root>/);
        assert.match(html, /Hello world/);
    });

    it('includes content written during viewDidLoad (the MutationObserver-timing case)', async () => {
        // bootStrapApplication's promise resolves before ElementCompiler.compile's
        // elementMutationObserver callback fires (which is what actually triggers
        // viewDidLoad) - this test exists specifically to prove renderToString's
        // extra flush actually waits for it, not just to test viewDidLoad itself.
        function TestRoot() {
            this.message = 'not yet';
            this.viewDidLoad = function () {
                this.message = 'loaded';
            };
        }
        TestRoot.ctors = { selector: 'app-root' };
        TestRoot.view = (elementRef) => core.ViewParser.jit(elementRef, [
            { type: 1, name: 'span', index: 0, isc: false, children: [
                { type: 3, ast: ['${0}', [['${0}', { prop: 'message' }]], false] }
            ] }
        ], {});

        const html = await renderToString(TestRoot, 'app-root');
        assert.match(html, /loaded/, `expected viewDidLoad's mutation to be flushed into the serialized output, got: ${html}`);
    });

    it('serializes concurrent calls instead of letting them interleave', async () => {
        function makeRoot(label) {
            function TestRoot() {
                this.label = label;
            }
            TestRoot.ctors = { selector: 'app-root' };
            TestRoot.view = (elementRef) => core.ViewParser.jit(elementRef, [
                { type: 3, ast: ['${0}', [['${0}', { prop: 'label' }]], false] }
            ], {});
            return TestRoot;
        }

        const [htmlA, htmlB] = await Promise.all([
            renderToString(makeRoot('A'), 'app-root'),
            renderToString(makeRoot('B'), 'app-root')
        ]);

        assert.match(htmlA, /A/);
        assert.doesNotMatch(htmlA, /B/);
        assert.match(htmlB, /B/);
        assert.doesNotMatch(htmlB, /A/);
    });
});

/**
 * Phase 2 of the SSR/hydration plan - the data-fetching readiness signal
 * (component/lifecycle.js's enableLifecyclePromiseTracking/drainLifecyclePromises).
 */
describe('server/render-to-string (SSR Phase 2: data-fetching readiness)', () => {
    it('awaits a promise returned from didInit before serializing, instead of shipping a loading-state shell', async () => {
        function TestRoot() {
            this.status = 'loading';
            this.didInit = function () {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        this.status = 'loaded: real data';
                        resolve();
                    }, 10);
                });
            };
        }
        TestRoot.ctors = { selector: 'app-root' };
        TestRoot.view = (elementRef) => core.ViewParser.jit(elementRef, [
            { type: 1, name: 'span', index: 0, isc: false, children: [
                { type: 3, ast: ['${0}', [['${0}', { prop: 'status' }]], false] }
            ] }
        ], {});

        const html = await renderToString(TestRoot, 'app-root');
        assert.match(html, /loaded: real data/, `expected the resolved didInit data to be in the serialized output, got: ${html}`);
        assert.doesNotMatch(html, /^loading$/);
    });

    it('drains promises registered across multiple rounds (data resolving triggers further async work)', async () => {
        function TestRoot() {
            this.step = 'start';
            this.didInit = function () {
                return new Promise((resolve) => setTimeout(() => {
                    this.step = 'middle';
                    resolve();
                }, 5));
            };
            this.willObserve = function () {
                if (this.step === 'middle' && !this._secondRoundStarted) {
                    this._secondRoundStarted = true;
                    return new Promise((resolve) => setTimeout(() => {
                        this.step = 'done';
                        resolve();
                    }, 5));
                }
            };
        }
        TestRoot.ctors = { selector: 'app-root' };
        TestRoot.view = (elementRef) => core.ViewParser.jit(elementRef, [
            { type: 1, name: 'span', index: 0, isc: false, children: [
                { type: 3, ast: ['${0}', [['${0}', { prop: 'step' }]], false] }
            ] }
        ], {});

        const html = await renderToString(TestRoot, 'app-root');
        assert.match(html, /done/, `expected the second round's data to also be flushed, got: ${html}`);
    });

    it('proceeds instead of hanging when a promise never settles within the timeout', async () => {
        function TestRoot() {
            this.status = 'loading';
            this.didInit = function () {
                return new Promise(() => {}); // never resolves
            };
        }
        TestRoot.ctors = { selector: 'app-root' };
        TestRoot.view = (elementRef) => core.ViewParser.jit(elementRef, [
            { type: 1, name: 'span', index: 0, isc: false, children: [
                { type: 3, ast: ['${0}', [['${0}', { prop: 'status' }]], false] }
            ] }
        ], {});

        const html = await renderToString(TestRoot, 'app-root', { timeoutMs: 20, maxIterations: 2 });
        assert.match(html, /loading/, `expected the render to proceed with the pre-resolution state rather than hang, got: ${html}`);
    });
});
