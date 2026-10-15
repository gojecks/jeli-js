import assert from 'node:assert/strict';
import { core, mount } from './support/mount.mjs';

describe('core render harness (opt-in manual change detection)', () => {
    it('a manual-mode component ignores the automatic cascade but updates via rxWatch', async () => {
        const sharedSubject = new core.Subject();

        function SiblingA() {
            window.__siblingA = this;
            this.label = 'A';
        }
        SiblingA.ctors = { selector: 'sibling-a' };
        SiblingA.view = (elementRef) => core.ViewParser.jit(elementRef, [
            { type: 3, ast: ['A:${0}', [['${0}', { prop: 'label' }]], false] }
        ], {});

        function SiblingB(changeDetector) {
            window.__siblingB = this;
            this.value = 'initial';
            this.didInit = function () {
                changeDetector.markAsManual();
                core.rxWatch(sharedSubject, changeDetector, (v) => { this.value = v; });
            };
        }
        SiblingB.ctors = { selector: 'sibling-b', DI: [{ tokenName: 'changeDetector' }] };
        SiblingB.view = (elementRef) => core.ViewParser.jit(elementRef, [
            { type: 3, ast: ['B:${0}', [['${0}', { prop: 'value' }]], false] }
        ], {});

        function TestRoot() {
            window.__instance = this;
        }
        TestRoot.ctors = { selector: 'app-root' };
        TestRoot.view = (elementRef) => core.ViewParser.jit(elementRef, [
            { type: 1, name: 'sibling-a', index: 0, isc: true, providers: [SiblingA], children: [] },
            { type: 1, name: 'sibling-b', index: 1, isc: true, providers: [SiblingB], children: [] }
        ], {});

        const el = await mount(TestRoot, 'app-root');
        assert.equal(el.textContent, 'A:AB:initial');

        // trigger the global sweep via sibling A's own change - must NOT
        // reach manual-mode sibling B (proves markAsManual() actually
        // detaches from the cascade, not just that nothing crashes)
        window.__siblingA.label = 'A2';
        core.ChangeDetector();
        assert.equal(el.textContent, 'A:A2B:initial', 'manual-mode sibling must not be refreshed by an unrelated cascade');

        // emit through the shared subject - B must update via
        // rxWatch/manualCheck, proving the explicit, targeted trigger
        // still works correctly while detached from the automatic sweep
        sharedSubject.next('updated');
        assert.equal(el.textContent, 'A:A2B:updated', 'rxWatch must refresh the manual-mode component on its own explicit trigger');
    });
});
