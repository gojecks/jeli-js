import assert from 'node:assert/strict';
import { core, mount } from './support/mount.mjs';

/**
 * global.jeli.devtools (packages/core/src/utils/debugger.js) - a component
 * tree walker and DI/injector inspector built on top of the real,
 * already-live runtime state (ElementRef's `.children`, ComponentRef's
 * componentDebugContext registry, a component class's static `ctors.DI`),
 * not a separate tracked shadow structure.
 */
describe('global.jeli.devtools', () => {
    function CounterService() {
        this.count = 42;
    }
    CounterService.ctors = { DI: [] };

    it('walks the live element tree, marking which nodes are components', async () => {
        function ChildElement(counterService) {
            window.__child = this;
            this.value = counterService.count;
        }
        ChildElement.ctors = { selector: 'child-el', DI: [CounterService] };
        ChildElement.view = (elementRef) => core.ViewParser.jit(elementRef, [
            { type: 3, ast: ['${0}', [['${0}', { prop: 'value' }]], false] }
        ], {});

        function TestRoot() {
            window.__root = this;
        }
        TestRoot.ctors = { selector: 'app-root' };
        TestRoot.view = (elementRef) => core.ViewParser.jit(elementRef, [
            { type: 1, name: 'div', index: 0, isc: false, children: [
                { type: 1, name: 'child-el', index: 0, isc: true, providers: [ChildElement], children: [] }
            ] }
        ], {});

        await mount(TestRoot, 'app-root');
        const tree = globalThis.jeli.devtools.getComponentTree();

        assert.equal(tree.tagName, 'app-root');
        assert.equal(tree.isComponent, true);
        assert.equal(tree.componentInstance, window.__root);

        const div = tree.children[0];
        assert.equal(div.tagName, 'div');
        assert.equal(div.isComponent, false);
        assert.equal('componentInstance' in div, false);

        const child = div.children[0];
        assert.equal(child.tagName, 'child-el');
        assert.equal(child.isComponent, true);
        assert.equal(child.componentInstance, window.__child);
        assert.equal(child.componentInstance.value, 42);
    });

    it('inspectElement finds the live ElementRef backing a native DOM node', async () => {
        function TestRoot() {}
        TestRoot.ctors = { selector: 'app-root' };
        TestRoot.view = (elementRef) => core.ViewParser.jit(elementRef, [
            { type: 1, name: 'span', index: 0, isc: false, attr: { class: 'target' }, children: [] }
        ], {});

        const host = await mount(TestRoot, 'app-root');
        const span = host.querySelector('span.target');

        const ref = globalThis.jeli.devtools.inspectElement(span);
        assert.equal(ref.nativeElement, span);
        assert.equal(ref.tagName, 'span');
    });

    it('inspectComponent reports selector, DI declarations, and change-detector status', async () => {
        function ChildElement(counterService) {
            window.__child2 = this;
            this.count = counterService.count;
        }
        ChildElement.ctors = { selector: 'child-el-2', DI: [CounterService, { tokenName: 'changeDetector' }] };
        ChildElement.view = (elementRef) => core.ViewParser.jit(elementRef, [
            { type: 3, ast: ['${0}', [['${0}', { prop: 'count' }]], false] }
        ], {});

        function TestRoot() {}
        TestRoot.ctors = { selector: 'app-root' };
        TestRoot.view = (elementRef) => core.ViewParser.jit(elementRef, [
            { type: 1, name: 'child-el-2', index: 0, isc: true, providers: [ChildElement], children: [] }
        ], {});

        const host = await mount(TestRoot, 'app-root');
        const childNode = host.querySelector('child-el-2');

        const info = globalThis.jeli.devtools.inspectComponent(childNode);
        assert.equal(info.selector, 'child-el-2');
        assert.equal(info.instance, window.__child2);
        assert.equal(typeof info.changeDetectorStatus, 'number');
        assert.equal(info.dependencies.length, 2);
        assert.equal(info.dependencies[0].description, 'CounterService');
        // CounterService is a real singleton (no noSingleton flag) - by the
        // time this component exists, Inject() has already cached it on
        // the constructor function itself (dependency.injector.js)
        assert.equal(info.dependencies[0].resolvedInstance, CounterService.ctors.instance);
        assert.equal(info.dependencies[1].description, 'changeDetector');
    });

    it('singleton tracking is off by default and opt-in via enable/disableSingletonTracking', async () => {
        assert.equal(globalThis.jeli.devtools.getSingletonInstances(), null);

        function AnotherService() {}
        AnotherService.ctors = { DI: [] };

        function TestRoot(anotherService) {
            window.__rootWithService = this;
        }
        TestRoot.ctors = { selector: 'app-root', DI: [AnotherService] };
        TestRoot.view = (elementRef) => core.ViewParser.jit(elementRef, [
            { type: 3, ast: ['ok'] }
        ], {});

        globalThis.jeli.devtools.enableSingletonTracking();
        try {
            await mount(TestRoot, 'app-root');
            const instances = globalThis.jeli.devtools.getSingletonInstances();
            assert.equal(Array.isArray(instances), true);
            assert.equal(instances.some((entry) => entry.name === 'AnotherService'), true);
        } finally {
            globalThis.jeli.devtools.disableSingletonTracking();
        }

        assert.equal(globalThis.jeli.devtools.getSingletonInstances(), null);
    });
});
