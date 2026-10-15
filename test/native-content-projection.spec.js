import assert from 'node:assert/strict';
import { core } from './support/mount.mjs';

/**
 * Regression test for the native (`asNative`) content-projection bug:
 * a component registered via `createCustomElement`/`customElements.define`
 * (the path markup-injected content like `fsb-markdown`'s
 * `fo-drop-down-native` goes through, as opposed to a normally compiled
 * `<fo-drop-down>`) never moved its light-DOM children into its own
 * <j-place> - they were left untouched as siblings of the compiled view
 * instead of being projected into it. Root cause was in
 * `TemplateRef.factory`/`TemplateRef.templatesCompiler`
 * (dom/renderer/templateref.js):
 *   1. `factory()` rejected `asNative` components' function-shaped
 *      `templates` via a `hasOwnProperty` check that only makes sense for
 *      a plain object (the non-native compiled-component shape).
 *   2. `templatesCompiler`'s `place` handler referenced an undefined
 *      `selector` instead of its own `templates` parameter.
 *   3/4. it also reassigned two `const` bindings and called the
 *      nonexistent `classList.has` (should be `.contains`) with an
 *      inverted match condition.
 */
describe('native (asNative) component content projection (<j-place> + createCustomElement)', () => {
    it('moves light-DOM children into the compiled <j-place> slot instead of leaving them as untouched siblings', () => {
        function DropDownLike(elementRef) { this.elementRef = elementRef; }
        DropDownLike.ctors = {
            selector: 'x-native-dropdown',
            asNative: { selector: 'x-native-dropdown' },
            DI: ['ElementRef?']
        };
        DropDownLike.view = (elementRef) => core.ViewParser.jit(elementRef, [
            {
                type: 1, name: 'div', index: 0, isc: false, attr: { class: 'dropdown' },
                children: [
                    { type: 1, name: 'button', index: 1, isc: false, attr: { type: 'button', class: 'btn' }, children: [] },
                    {
                        type: 1, name: 'div', index: 2, isc: false, attr: { class: 'dropdown-menu' },
                        children: [
                            { type: 11, name: '#', index: 0, isc: false, refId: '@' }
                        ]
                    }
                ]
            }
        ], {});

        document.body.innerHTML =
            '<x-native-dropdown>' +
            '<a class="dropdown-item" id="one">Edit</a>' +
            '<a class="dropdown-item" id="two">Delete</a>' +
            '</x-native-dropdown>';

        // jsdom's customElements registry lives on `window`, not the Node
        // global object (setup-dom.mjs only globalizes window/document/etc)
        window.customElements.define('x-native-dropdown', core.createCustomElement(DropDownLike, {}));

        const host = document.querySelector('x-native-dropdown');
        const menu = host.querySelector('.dropdown-menu');

        // the two original <a> tags must have been MOVED into .dropdown-menu ...
        assert.equal(menu.children.length, 2);
        assert.equal(menu.children[0].id, 'one');
        assert.equal(menu.children[1].id, 'two');

        // ... not left behind as siblings of the compiled .dropdown div
        assert.equal(host.querySelector(':scope > a'), null);
        assert.equal(host.children.length, 1);
        assert.equal(host.children[0].className, 'dropdown');
    });
});
