import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

// same as the core loader: the built UMD bundle, evaluated like a browser <script>
if (!globalThis.jeli || !globalThis.jeli.i18n || !globalThis.jeli.i18n.I18n) {
    globalThis.jeli = globalThis.jeli || {};
    vm.runInThisContext(readFileSync(fileURLToPath(new URL('../dist/i18n/bundles/jeli-i18n-umd.js', import.meta.url)), 'utf8'));
}
const { I18n, TranslatePipe, TranslateOverridePipe } = globalThis.jeli.i18n;

const reset = () => {
    I18n.state = { lang: '', defaultLanguage: 'en', language: null, sources: [], defaults: {}, listeners: [] };
};

describe('@jeli/i18n', () => {
    beforeEach(reset);

    it('falls back from define() defaults to the inline default to the key', () => {
        I18n.define({ 'cart.empty': 'Your cart is empty' });
        assert.equal(I18n.t('cart.empty', 'ignored'), 'Your cart is empty');
        assert.equal(I18n.t('cart.title', 'Your cart'), 'Your cart');
        assert.equal(I18n.t('cart.title'), 'cart.title');
    });

    it('fills positional and named placeholders and picks plural forms from a leading number', () => {
        I18n.define({ 'cart.items.one': '{{0}} item', 'cart.items.other': '{{0}} items', 'hello': 'Hi {{name}}' });
        assert.equal(I18n.t('cart.items', null, [1]), '1 item');
        assert.equal(I18n.t('cart.items', null, [4]), '4 items');
        assert.equal(I18n.t('hello', null, { name: 'Ann' }), 'Hi Ann');
        assert.equal(I18n.t('x', 'at least {{0}} of {{missing}}', [3]), 'at least 3 of ');
    });

    it('orders translation sources, then the override, then message sources, then defaults', () => {
        const messages = { 'send': 'Submit' };
        const thai = { 'send': 'ส่ง' };
        I18n.use(key => messages[key]);
        I18n.use(key => (I18n.lang === 'th' ? thai[key] : null), { translation: true });
        I18n.define({ 'send': 'Send message' });

        assert.equal(I18n.t('send'), 'Submit');
        assert.equal(I18n.t('send', null, null, 'Book a viewing'), 'Book a viewing');
        I18n.configure({ lang: 'th' });
        assert.equal(I18n.t('send', null, null, 'Book a viewing'), 'ส่ง');
        assert.equal(I18n.t('other', 'Fallback', null, 'Owner text'), 'Owner text');
    });

    it('does not use translation sources in the default language', () => {
        I18n.use(() => 'translated', { translation: true });
        assert.equal(I18n.t('k', 'default'), 'default');
    });

    it('a source can be removed, and listeners hear language changes once', () => {
        const remove = I18n.use(() => 'from source');
        assert.equal(I18n.t('k'), 'from source');
        remove();
        assert.equal(I18n.t('k', 'default'), 'default');

        const heard = [];
        const stop = I18n.onChange((lang, previous) => heard.push(previous + '>' + lang));
        I18n.setLanguage('fr');
        I18n.setLanguage('fr');
        stop();
        I18n.setLanguage('de');
        assert.deepEqual(heard, ['en>fr']);
    });

    it('follows a language function on every lookup', () => {
        let editing = { lang: 'en', defaultLanguage: 'en' };
        I18n.configure({ language: () => editing });
        I18n.use((key, context) => (context.lang === 'fr' ? 'Bonjour' : null), { translation: true });
        assert.equal(I18n.t('hi', 'Hello'), 'Hello');
        editing = { lang: 'fr', defaultLanguage: 'en' };
        assert.equal(I18n.t('hi', 'Hello'), 'Bonjour');
        assert.equal(I18n.lang, 'fr');
    });

    it('the t pipe passes its arguments through', () => {
        I18n.define({ 'cart.items.one': '{{0}} item', 'cart.items.other': '{{0}} items' });
        const pipe = new TranslatePipe();
        assert.equal(pipe.compile('cart.items', null, 2), '2 items');
        assert.equal(pipe.compile('greet', 'Hello {{0}}', 'Ann'), 'Hello Ann');
    });

    it('the tOverride pipe uses the override in the default language only', () => {
        const pipe = new TranslateOverridePipe();
        I18n.use(key => (I18n.lang === 'fr' && key === 'accept' ? 'Accepter' : null), { translation: true });
        assert.equal(pipe.compile('accept', 'Accept', 'Sounds good'), 'Sounds good');
        assert.equal(pipe.compile('accept', 'Accept', ''), 'Accept');
        assert.equal(pipe.compile('hi', 'Hi {{0}}', null, 'Ann'), 'Hi Ann');
        I18n.setLanguage('fr');
        assert.equal(pipe.compile('accept', 'Accept', 'Sounds good'), 'Accepter');
    });
});
