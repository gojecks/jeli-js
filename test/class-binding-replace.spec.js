import assert from 'node:assert/strict';
import { core, mount } from './support/mount.mjs';

describe('{class} string binding', () => {
    // regression: a changed string value used to only add classes, leaving the old ones applied
    it('replaces previously bound classes and keeps static ones', async () => {
        function TestRoot() {
            window.__instance = this;
            this.columnClass = 'col-lg-4 col-md-6';
        }
        TestRoot.ctors = { selector: 'app-root' };
        TestRoot.view = (elementRef) => core.ViewParser.jit(elementRef, [
            {
                type: 1, name: 'div', index: 0, isc: false,
                attr: { class: 'card col-12' },
                attr$: {
                    class: {
                        prop: 'columnClass', once: false,
                        compiledFn: (ctx, cmp) => core.resolveIdentifier('columnClass', ctx, cmp) + ' ps-0'
                    }
                }
            }
        ], {});

        const el = await mount(TestRoot, 'app-root');
        const div = el.querySelector('div');
        assert.deepEqual([...div.classList].sort(), ['card', 'col-12', 'col-lg-4', 'col-md-6', 'ps-0']);

        window.__instance.columnClass = 'col-12';
        core.ChangeDetector();
        assert.deepEqual([...div.classList].sort(), ['card', 'col-12', 'ps-0']);

        window.__instance.columnClass = 'col-xl-3';
        core.ChangeDetector();
        assert.deepEqual([...div.classList].sort(), ['card', 'col-12', 'col-xl-3', 'ps-0']);
    });
});
