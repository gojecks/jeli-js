import assert from 'node:assert/strict';
import { LifeCycle } from '../packages/core/src/component/lifecycle.js';

/**
 * Direct-source unit test (bypasses dist/ - see this session's notes on the
 * pre-existing, unrelated compiler-cli/dist incompatibility) for
 * LifeCycle._updateViewBinding's `if (propValue.prop)` discriminator.
 *
 * jeli-cli's attachCompiledFn only ever runs on an already-built filterModel
 * object (produced by pipesProvider/expressionAst, which always sets
 * `.prop`) - a raw literal prop (`label="text"`, no braces) never flows
 * through that path at all, so `.compiledFn` can ONLY ever exist alongside
 * (or, once compileEventAssignments-style deletion is applied, in place of)
 * `.prop`. That makes `.compiledFn`'s presence just as reliable a "this is a
 * dynamic filterModel binding" signal as `.prop`'s - the discriminator here
 * must accept either, so `.prop` can be safely dropped once `.compiledFn`
 * exists without this falling through to neither branch (which would leave
 * `value` undefined and never set `this.always`, silently freezing the
 * prop after its first render).
 *
 * Calls `_updateViewBinding` directly via `Object.create(LifeCycle.prototype)`
 * rather than `new LifeCycle(...)`, since the real constructor reaches
 * `ObserveUntilDestroyed` as a bare cross-file identifier (only resolvable
 * once jeli-cli's bundler flattens @jeli/core into one shared scope - same
 * class of thing documented in mount.mjs and event-handler-compiled-fn.spec.js).
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

function makeElementRef({ props, context, parentComponentInstance }) {
    return {
        hasContext: true,
        context,
        // compiledFn is invoked as compiledFn(context, elementRef.parent.componentInstance)
        parent: { componentInstance: parentComponentInstance },
        internal_getDefinition(key) {
            if (key === 'props') return props;
            if (key === 'asNative') return false;
            return undefined;
        }
    };
}

describe('LifeCycle._updateViewBinding - compiledFn discriminator', () => {
    it('still recognizes a compiled prop binding as dynamic when .prop has been deleted', () => {
        const componentInstance = { label: null };
        const rowContext = { hook: { label: 'circles' } };
        const elementRef = makeElementRef({
            context: rowContext,
            parentComponentInstance: componentInstance,
            props: {
                // .prop deleted, .compiledFn is the only signal left that
                // this is a filterModel binding, not a raw literal
                label: { compiledFn: (ctx) => ctx.hook.label }
            }
        });
        const lifeCycle = makeLifeCycle(componentInstance);

        lifeCycle._updateViewBinding(elementRef, { label: {} });

        assert.equal(componentInstance.label, 'circles', 'the compiled binding must still be recognized and evaluated');
        assert.equal(lifeCycle.always, true, 'a dynamic binding must still be marked for ongoing change detection, not silently frozen');
    });

    it('still treats a raw literal prop as static (unaffected by the compiledFn check)', () => {
        const componentInstance = { label: null };
        const elementRef = makeElementRef({
            context: {},
            props: { label: { type: 'raw', value: 'Static Text' } }
        });
        const lifeCycle = makeLifeCycle(componentInstance);

        lifeCycle._updateViewBinding(elementRef, { label: {} });

        assert.equal(componentInstance.label, 'Static Text');
        assert.equal(lifeCycle.always, false, 'a raw literal must not be marked for ongoing change detection');
        assert.deepEqual(lifeCycle.ignoreChecks, ['label']);
    });
});
