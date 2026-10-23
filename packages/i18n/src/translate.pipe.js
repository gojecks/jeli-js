import { I18n } from './i18n';

/**
 * ${'cart.empty' | t:'Your cart is empty'} or, with values, ${'cart.count' | t:'{{0}} items';total}
 * Arguments after the default fill {{0}}, {{1}}...; a number first also picks plural forms.
 */
Pipe({
    name: 't'
})
export class TranslatePipe {
    compile(key, defaultText, ...params) {
        return I18n.t(key, defaultText, params);
    }
}

/**
 * ${'cookies.accept' | tOverride:'Accept';config.yesText} - the app's own wording (e.g. what a site owner typed)
 * replaces the default in the default language; a translation still wins in other languages. See I18n.t override.
 */
Pipe({
    name: 'tOverride'
})
export class TranslateOverridePipe {
    compile(key, defaultText, override, ...params) {
        return I18n.t(key, defaultText, params, override);
    }
}
