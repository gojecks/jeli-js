# @jeli/i18n

Keyed text for jeli apps and libraries.

```js
import { I18n, I18nModule } from '@jeli/i18n';

// built-in English for a feature
I18n.define({ 'cart.empty': 'Your cart is empty', 'cart.items.one': '{{0}} item', 'cart.items.other': '{{0}} items' });

// where the app keeps its wording and translations
I18n.use(key => site.messages[key]);
I18n.use(key => (site.translations[I18n.lang] || {})[key], { translation: true });
I18n.configure({ defaultLanguage: 'en', lang: 'th' });

I18n.t('cart.items', null, [3]); // "3 items", or the Thai text
```

In templates (list `I18nModule` in the module's `requiredModules`):

```html
<p>${'cart.empty' | t:'Your cart is empty'}</p>
<p>${'cart.items' | t:null;total}</p>
```

When the app has its own wording for one use (e.g. a label a site owner typed), `tOverride` takes it after the
default; a translation still wins in other languages:

```html
<button>${'cookies.accept' | tOverride:'Accept';config.yesText}</button>
```

Lookup order: translation sources (outside the default language), the call's override, message sources,
`I18n.define()` defaults, the inline default, then the key. Pipe arguments are separated by `;`, and a template
expression ends at the first `}`, so an inline default cannot contain `;` or a `{{0}}` placeholder - register such
text with `I18n.define()` instead and pass `null` as the default: `${'cart.items' | t:null;total}`.

`jeli build` with `buildOptions.i18n` writes every key it finds (`'key' | t:'default'`, `I18n.t('key', 'default')`,
`I18n.define({...})`) to `i18n.json` in the output folder.
