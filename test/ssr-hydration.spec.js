import assert from 'node:assert/strict';
import { core, renderToString, hydrate } from '../server/render-to-string.mjs';

/**
 * SSR Phase 3 (hydration) - see .claude/plans/greedy-singing-mist.md.
 * Deliberately scoped: real node-by-node adoption for structural-directive-
 * free templates; a safe, coarse (whole-component) fallback to a normal
 * remount for anything containing `*if`/`*for`/`{:switch}` (no jeli-cli
 * delimiter-marker support - a separate, cross-repo change, not attempted
 * here).
 */

function instrumentNodeCreation() {
    let elementsCreated = 0;
    let textNodesCreated = 0;
    const originalCreateElement = document.createElement.bind(document);
    const originalCreateTextNode = document.createTextNode.bind(document);
    document.createElement = function (...args) {
        elementsCreated++;
        return originalCreateElement(...args);
    };
    document.createTextNode = function (...args) {
        textNodesCreated++;
        return originalCreateTextNode(...args);
    };
    return {
        counts: () => ({ elementsCreated, textNodesCreated }),
        restore: () => {
            document.createElement = originalCreateElement;
            document.createTextNode = originalCreateTextNode;
        }
    };
}

describe('hydration (SSR Phase 3) - structural-directive-free templates', () => {
    it('adopts server-rendered nodes instead of creating new ones', async () => {
        function TestRoot() {
            this.name = 'jane';
        }
        TestRoot.ctors = { selector: 'app-root' };
        TestRoot.view = (elementRef) => core.ViewParser.jit(elementRef, [
            { type: 1, name: 'div', index: 0, isc: false, attr: { class: 'greeting' }, children: [
                { type: 3, ast: ['Hello, ${0}!', [['${0}', { prop: 'name' }]], false] }
            ] }
        ], {});

        const html = await renderToString(TestRoot, 'app-root');
        assert.match(html, /Hello, jane!/);

        const instrument = instrumentNodeCreation();
        const host = await hydrate(TestRoot, 'app-root', html);
        const counts = instrument.counts();
        instrument.restore();

        assert.equal(host.textContent.trim(), 'Hello, jane!');
        assert.equal(host.querySelector('.greeting') !== null, true);
        // the whole point: zero new DOM nodes for a structural-directive-free
        // template that matches the server output
        assert.equal(counts.elementsCreated, 0, `expected no new elements, created ${counts.elementsCreated}`);
        assert.equal(counts.textNodesCreated, 0, `expected no new text nodes, created ${counts.textNodesCreated}`);
    });

    it('wires up real, working event listeners on adopted nodes', async () => {
        function TestRoot() {
            window.__hydrationClickInstance = this;
            this.clicked = false;
            this.onClick = function () {
                this.clicked = true;
            };
        }
        TestRoot.ctors = { selector: 'app-root' };
        TestRoot.view = (elementRef) => core.ViewParser.jit(elementRef, [
            // `target` intentionally omitted, not `[]` - EventHandler.registerListener
            // reads `!!event.target` as a delegation flag, and an empty array is
            // truthy in JS, which would silently route through the wrong (delegated)
            // dispatch branch instead of calling onClick directly
            { type: 1, name: 'button', index: 0, isc: false,
              events: [{ name: 'click', value: [{ type: 'call', fn: 'onClick', args: [] }] }],
              children: [{ type: 3, ast: ['click me'] }] }
        ], {});

        const html = await renderToString(TestRoot, 'app-root');
        const host = await hydrate(TestRoot, 'app-root', html);

        assert.equal(window.__hydrationClickInstance.clicked, false);
        const button = host.querySelector('button');
        button.dispatchEvent(new window.Event('click', { bubbles: true }));
        assert.equal(window.__hydrationClickInstance.clicked, true, 'expected the click handler, attached to the adopted button, to have fired');
    });

    it('updates an adopted text binding correctly after a state change', async () => {
        function TestRoot() {
            window.__hydrationInstance = this;
            this.count = 1;
        }
        TestRoot.ctors = { selector: 'app-root' };
        TestRoot.view = (elementRef) => core.ViewParser.jit(elementRef, [
            { type: 3, ast: ['Count: ${0}', [['${0}', { prop: 'count' }]], false] }
        ], {});

        const html = await renderToString(TestRoot, 'app-root');
        const host = await hydrate(TestRoot, 'app-root', html);
        assert.equal(host.textContent, 'Count: 1');

        window.__hydrationInstance.count = 2;
        core.ChangeDetector();
        assert.equal(host.textContent, 'Count: 2');
    });

    it('adopts nested custom components too, not just the root', async () => {
        function ChildElement() {
            this.label = 'child content';
        }
        ChildElement.ctors = { selector: 'child-el' };
        ChildElement.view = (elementRef) => core.ViewParser.jit(elementRef, [
            { type: 3, ast: ['${0}', [['${0}', { prop: 'label' }]], false] }
        ], {});

        function TestRoot() {}
        TestRoot.ctors = { selector: 'app-root' };
        TestRoot.view = (elementRef) => core.ViewParser.jit(elementRef, [
            { type: 1, name: 'child-el', index: 0, isc: true, providers: [ChildElement] }
        ], {});

        const html = await renderToString(TestRoot, 'app-root');
        assert.match(html, /child content/);

        const instrument = instrumentNodeCreation();
        const host = await hydrate(TestRoot, 'app-root', html);
        const counts = instrument.counts();
        instrument.restore();

        assert.equal(host.querySelector('child-el').textContent, 'child content');
        assert.equal(counts.elementsCreated, 0, `expected the nested component to be adopted too, created ${counts.elementsCreated} elements`);
    });
});

describe('hydration (SSR Phase 3) - mismatch fallback', () => {
    it('falls back to a full remount when the server markup does not match the client template', async () => {
        function TestRoot() {
            this.name = 'jane';
        }
        TestRoot.ctors = { selector: 'app-root' };
        TestRoot.view = (elementRef) => core.ViewParser.jit(elementRef, [
            { type: 1, name: 'div', index: 0, isc: false, children: [
                { type: 3, ast: ['Hello, ${0}!', [['${0}', { prop: 'name' }]], false] }
            ] }
        ], {});

        // deliberately wrong server markup: a <span> where the client
        // template expects a <div>
        const mismatchedHTML = '<app-root><span>Hello, jane!</span></app-root>';

        const originalWarn = console.warn;
        let warned = false;
        console.warn = (...args) => { warned = true; originalWarn(...args); };

        const host = await hydrate(TestRoot, 'app-root', mismatchedHTML);
        console.warn = originalWarn;

        assert.equal(warned, true, 'expected a hydration mismatch warning');
        assert.equal(host.querySelector('div') !== null, true, 'expected a fresh, correct <div> to have been created');
        assert.equal(host.textContent.trim(), 'Hello, jane!');
    });

    it('discards the stale mismatched node instead of leaving duplicated content', async () => {
        function TestRoot() {
            this.name = 'jane';
        }
        TestRoot.ctors = { selector: 'app-root' };
        TestRoot.view = (elementRef) => core.ViewParser.jit(elementRef, [
            { type: 1, name: 'div', index: 0, isc: false, children: [
                { type: 3, ast: ['Hello, ${0}!', [['${0}', { prop: 'name' }]], false] }
            ] }
        ], {});

        const mismatchedHTML = '<app-root><span>stale</span></app-root>';
        const originalWarn = console.warn;
        console.warn = () => {};
        const host = await hydrate(TestRoot, 'app-root', mismatchedHTML);
        console.warn = originalWarn;

        assert.equal(host.querySelectorAll('span').length, 0, 'the stale mismatched <span> should have been discarded, not left alongside the fresh content');
        assert.equal(host.querySelectorAll('div').length, 1);
    });
});

describe('hydration (SSR Phase 3) - structural directive bail-out', () => {
    it('discards stale server content and does a normal fresh render for a template containing *if', async () => {
        // type: 8 marks a structural directive - since there's no compiler
        // in this test harness, this is a hand-built AST exercising the
        // same shape jeli-cli would emit for a real @if/*if block
        function TestRoot() {
            this.show = true;
        }
        TestRoot.ctors = { selector: 'app-root' };
        TestRoot.view = (elementRef) => core.ViewParser.jit(elementRef, [
            {
                type: 8, name: '##', text: 'if',
                templates: { if: { type: 1, name: 'span', index: 0, isc: false, children: [{ type: 3, ast: ['visible'] }] } },
                props: { if: { prop: 'show' } },
                providers: []
            }
        ], {});

        // stale server markup that does NOT match what a fresh render would
        // produce, to prove it really discarded it rather than trying (and
        // failing) to adopt it
        const staleHTML = '<app-root><span>STALE SERVER CONTENT</span></app-root>';

        const host = await hydrate(TestRoot, 'app-root', staleHTML);
        assert.doesNotMatch(host.textContent, /STALE/, 'stale content from a structural-directive-containing template should have been discarded, not adopted');
    });
});
