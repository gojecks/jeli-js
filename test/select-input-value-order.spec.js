import assert from 'node:assert/strict';
import { EventHandler } from '../packages/core/src/dom/event.handler.js';

/**
 * Repro: a <select> inside a component that also has a delegated
 * `@input-delegate:select` on an ancestor. Delegated listeners are registered
 * in the capture phase, so the ancestor's handleEvent runs its
 * changeDetector.detectChanges() *before* the select's own @input handler reads
 * $event.target.value. An option whose {selected} binding is re-applied from
 * the stored model during that detectChanges resets the select, so the handler
 * reads the old value.
 */
function fakeElement(nativeElement, events, changeDetector) {
    return {
        nativeElement,
        context: {},
        hostRef: { componentInstance: {} },
        changeDetector,
        events: { _events: events, registeredEvents: new Map() }
    };
}

describe('select value read in an @input handler with a delegated ancestor', () => {
    it('the @input handler reads the value the user picked', () => {
        const host = document.createElement('div');
        const select = document.createElement('select');
        ['a', 'b', 'c'].forEach(v => {
            const opt = document.createElement('option');
            opt.value = v;
            opt.textContent = v;
            select.appendChild(opt);
        });
        host.appendChild(select);
        document.body.appendChild(host);

        // model the template state: {selected}="(model) == 'v'" on every option
        let model = 'a';
        const applySelected = () => {
            select.querySelectorAll('option').forEach(opt => { opt.selected = opt.value === model; });
        };
        applySelected();

        let readValue = null;
        // the wrapper's delegated listener (target set => capture phase)
        const wrapper = fakeElement(host,
            [{ name: 'input', target: ['select'], handler: () => {} }],
            { detectChanges: applySelected });
        // the select's own @input handler (no delegate)
        const selectEl = fakeElement(select,
            [{
                name: 'input',
                compiledFn(ctx, cmp, ev) {
                    readValue = ev.target.value;
                    model = readValue;
                }
            }],
            { detectChanges() {} });

        EventHandler.registerListener(wrapper);
        EventHandler.registerListener(selectEl);

        // user picks "b"
        select.value = 'b';
        select.dispatchEvent(new window.Event('input', { bubbles: true }));

        document.body.removeChild(host);
        assert.equal(readValue, 'b', `handler read "${readValue}" instead of "b"`);
    });
});
