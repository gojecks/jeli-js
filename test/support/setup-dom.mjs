import { JSDOM } from 'jsdom';

/**
 * jeli-js's runtime touches `document`/`window`/`MutationObserver`/
 * `requestAnimationFrame` as ambient globals (it targets the browser, not
 * Node) - this sets up a minimal jsdom environment so the real runtime
 * source can be exercised directly in tests.
 */
const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost/' });

global.window = dom.window;
global.document = dom.window.document;
global.Node = dom.window.Node;
global.HTMLElement = dom.window.HTMLElement;
global.MutationObserver = dom.window.MutationObserver;
global.Reflect = Reflect;

if (!dom.window.requestAnimationFrame) {
    dom.window.requestAnimationFrame = (fn) => setTimeout(fn, 0);
    dom.window.cancelAnimationFrame = (id) => clearTimeout(id);
}
