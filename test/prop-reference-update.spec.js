import assert from 'node:assert/strict';
import { LifeCycle } from '../packages/core/src/component/lifecycle.js';

/**
 * LifeCycle.setValue - deep-equal prop values. Props are compared with isequal() so a binding that builds a new
 * object/array every change-detection pass doesn't fire didChange (or re-run a setter) each time. But skipping the
 * assignment entirely left a component holding the PREVIOUS object when the parent swapped in an equal-content one
 * (e.g. switching between two empty pages: [] -> []), so the child's mutations went to the old object.
 * Direct-source test, same Object.create(LifeCycle.prototype) approach as lifecycle-compiled-fn.spec.js.
 */
function makeLifeCycle(componentInstance) {
    const instance = Object.create(LifeCycle.prototype);
    instance.componentInstance = componentInstance;
    instance.propChanges = null;
    instance.registeredProperty = {};
    instance.ignoreChecks = [];
    instance.always = false;
    instance._cycleState = {};
    return instance;
}

describe('LifeCycle.setValue - equal-content prop swaps', () => {
    it('hands a plain-field prop the new reference when the content is equal', () => {
        const pageA = [];
        const pageB = [];
        const component = { formArray: null };
        const lifeCycle = makeLifeCycle(component);

        lifeCycle.setValue('formArray', pageA);
        lifeCycle.propChanges = null;
        lifeCycle.setValue('formArray', pageB);

        assert.equal(component.formArray, pageB, 'the component must hold the array it was actually given');
        component.formArray.push({ type: 'alert' });
        assert.equal(pageB.length, 1);
        assert.equal(pageA.length, 0, 'edits must not leak into the previously bound array');
    });

    it('does not report a change (no didChange) for an equal-content swap', () => {
        const component = { items: null };
        const lifeCycle = makeLifeCycle(component);
        lifeCycle.setValue('items', [{ id: 1 }]);
        lifeCycle.propChanges = null;

        lifeCycle.setValue('items', [{ id: 1 }]);

        assert.equal(lifeCycle.propChanges, null);
    });

    it('does not re-run a setter for an equal-content value', () => {
        let setterCalls = 0;
        class Chart {
            set config(value) { setterCalls++; this._config = value; }
            get config() { return this._config; }
        }
        const component = new Chart();
        const lifeCycle = makeLifeCycle(component);
        const first = { type: 'line' };

        lifeCycle.setValue('config', first);
        lifeCycle.setValue('config', { type: 'line' });

        assert.equal(setterCalls, 1, 'a setter-backed prop keeps the old behaviour: no re-run for equal content');
        assert.equal(component.config, first);
    });

    it('still reports real changes', () => {
        const component = { items: null };
        const lifeCycle = makeLifeCycle(component);
        lifeCycle.setValue('items', [1]);
        lifeCycle.propChanges = null;

        lifeCycle.setValue('items', [1, 2]);

        assert.deepEqual(lifeCycle.propChanges, { items: [1, 2] });
        assert.deepEqual(component.items, [1, 2]);
    });

    it('is a no-op for the identical reference', () => {
        const value = [1];
        const component = { items: null };
        const lifeCycle = makeLifeCycle(component);
        lifeCycle.setValue('items', value);
        lifeCycle.propChanges = null;

        lifeCycle.setValue('items', value);

        assert.equal(lifeCycle.propChanges, null);
        assert.equal(component.items, value);
    });
});
