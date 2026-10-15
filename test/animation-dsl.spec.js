import assert from 'node:assert/strict';
import { core, mount } from './support/mount.mjs';

/**
 * core.createAnimation (packages/core/src/dom/animation-dsl.js) - a
 * declarative named-state animation config built directly on top of the
 * existing animate() primitive (dom/animation.js), used the same way a
 * real component would: triggered from a lifecycle hook / event handler
 * against a live, mounted element.
 */
describe('core.createAnimation', () => {
    it('transitions a mounted element from the default "void" state to a named state', async () => {
        const fade = core.createAnimation({
            states: { void: { opacity: 0 }, visible: { opacity: 1 } },
            defaults: { duration: 20, easing: 'linear' }
        });

        function TestRoot() {
            window.__root = this;
        }
        TestRoot.ctors = { selector: 'app-root' };
        TestRoot.view = (elementRef) => core.ViewParser.jit(elementRef, [
            { type: 1, name: 'div', index: 0, isc: false, attr: { class: 'box' }, children: [] }
        ], {});

        const host = await mount(TestRoot, 'app-root');
        const box = host.querySelector('.box');

        assert.equal(fade.currentState(box), 'void');
        await fade.trigger(box, 'visible');

        assert.equal(Number(box.style.opacity), 1);
        assert.equal(fade.currentState(box), 'visible');
    });

    it('picks the duration/easing from a specific "from => to" transition over the defaults', async () => {
        const steps = [];
        const slide = core.createAnimation({
            states: { collapsed: { opacity: 0 }, expanded: { opacity: 1 } },
            transitions: {
                'collapsed => expanded': { duration: 15, easing: 'linear' }
            },
            defaults: { duration: 1000, easing: 'swing' }
        });

        function TestRoot() {}
        TestRoot.ctors = { selector: 'app-root' };
        TestRoot.view = (elementRef) => core.ViewParser.jit(elementRef, [
            { type: 1, name: 'div', index: 0, isc: false, attr: { class: 'panel' }, children: [] }
        ], {});

        const host = await mount(TestRoot, 'app-root');
        const panel = host.querySelector('.panel');

        const start = Date.now();
        await slide.trigger(panel, 'expanded', 'collapsed');
        const elapsed = Date.now() - start;

        // proves the specific transition entry's short duration (15ms) was
        // used, not the 1000ms default - a generous upper bound well clear
        // of animate()'s own ~10ms step interval jitter
        assert.equal(elapsed < 500, true, `expected the specific transition's 15ms duration to apply, took ${elapsed}ms`);
        assert.equal(Number(panel.style.opacity), 1);
    });

    it('rejects when triggered with an unknown state name', async () => {
        const anim = core.createAnimation({ states: { void: {}, on: { opacity: 1 } } });

        function TestRoot() {}
        TestRoot.ctors = { selector: 'app-root' };
        TestRoot.view = (elementRef) => core.ViewParser.jit(elementRef, [
            { type: 1, name: 'div', index: 0, isc: false, children: [] }
        ], {});

        const host = await mount(TestRoot, 'app-root');
        await assert.rejects(() => anim.trigger(host.querySelector('div'), 'nonexistent'));
    });
});
