import { register } from 'node:module';

// jeli-js source touches `window`/`document`/`MutationObserver` at module
// top-level (e.g. dom/event.handler.js's customEventRegistry), so jsdom
// globals must exist before any core module is imported.
await import('./setup-dom.mjs');

register('./resolve-hook.mjs', import.meta.url);
