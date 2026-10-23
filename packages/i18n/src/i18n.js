/**
 * Keyed text lookups shared by apps and libraries.
 *
 * Order for I18n.t(key, defaultText, params, override):
 *   1. translation sources (only when the language is not the default one)
 *   2. override - the app's own wording for this one use, e.g. a button label the site owner typed
 *   3. message sources (the app's default-language wording)
 *   4. defaults registered with I18n.define()
 *   5. defaultText, then the key itself
 * Each source is asked for the plural forms first ("key.one"/"key.other" by Intl.PluralRules), then the key.
 */
export class I18n {
    static state = { lang: '', defaultLanguage: 'en', language: null, sources: [], defaults: {}, listeners: [] };

    // options.language: () => ({ lang, defaultLanguage }) read on every lookup, for apps whose language can change
    // without a setLanguage call (e.g. an editor previewing another language)
    static get current() {
        var dynamic = I18n.state.language ? I18n.state.language() || {} : {};
        var defaultLanguage = dynamic.defaultLanguage || I18n.state.defaultLanguage;
        return { lang: dynamic.lang || I18n.state.lang || defaultLanguage, defaultLanguage };
    }

    static get lang() {
        return I18n.current.lang;
    }

    static get defaultLanguage() {
        return I18n.current.defaultLanguage;
    }

    static configure(options) {
        options = options || {};
        if (options.defaultLanguage) I18n.state.defaultLanguage = options.defaultLanguage;
        if (options.language !== undefined) I18n.state.language = options.language;
        if (options.lang) I18n.setLanguage(options.lang);
    }

    static setLanguage(lang) {
        var previous = I18n.lang;
        I18n.state.lang = lang || '';
        if (I18n.lang !== previous) {
            I18n.state.listeners.slice().forEach(listener => listener(I18n.lang, previous));
        }
    }

    static onChange(listener) {
        I18n.state.listeners.push(listener);
        return () => {
            I18n.state.listeners = I18n.state.listeners.filter(item => item !== listener);
        };
    }

    /**
     * source(key, context) returns the text or nothing; context is {lang, defaultLanguage, count}.
     * options.translation marks a source that only applies outside the default language.
     */
    static use(source, options) {
        var entry = { source, translation: !!(options && options.translation) };
        I18n.state.sources.push(entry);
        return () => {
            I18n.state.sources = I18n.state.sources.filter(item => item !== entry);
        };
    }

    // built-in default-language text, e.g. a library's own labels; later calls win
    static define(dictionary) {
        Object.assign(I18n.state.defaults, dictionary || {});
    }

    static pluralCategory(lang, count) {
        try {
            return new Intl.PluralRules(lang).select(count);
        } catch (e) {
            return count === 1 ? 'one' : 'other';
        }
    }

    static candidates(key, lang, count) {
        if (typeof count !== 'number' || isNaN(count)) return [key];
        return [key + '.' + I18n.pluralCategory(lang, count), key + '.other', key];
    }

    static isText(value) {
        return typeof value === 'string' && value.trim() !== '';
    }

    static fromSources(key, count, translation, current) {
        var context = { lang: current.lang, defaultLanguage: current.defaultLanguage, count };
        var language = translation ? current.lang : current.defaultLanguage;
        var keys = I18n.candidates(key, language, count);
        for (var entry of I18n.state.sources) {
            if (entry.translation !== translation) continue;
            for (var candidate of keys) {
                var text = entry.source(candidate, context);
                if (I18n.isText(text)) return text;
            }
        }
        return null;
    }

    // the text for key without the inline default; null when nothing has it
    static lookup(key, count, override) {
        var current = I18n.current;
        if (current.lang !== current.defaultLanguage) {
            var translated = I18n.fromSources(key, count, true, current);
            if (translated !== null) return translated;
        }
        if (I18n.isText(override)) return override;
        var message = I18n.fromSources(key, count, false, current);
        if (message !== null) return message;
        var defaults = I18n.state.defaults;
        var found = I18n.candidates(key, current.defaultLanguage, count).find(candidate => I18n.isText(defaults[candidate]));
        return found ? defaults[found] : null;
    }

    // params: an array for {{0}}, {{1}} or an object for {{name}}; a number first (or params.count) picks plural forms
    static t(key, defaultText, params, override) {
        var list = Array.isArray(params) ? params : null;
        var count = list ? (typeof list[0] === 'number' ? list[0] : undefined) : (params && typeof params.count === 'number' ? params.count : undefined);
        var text = I18n.lookup(key, count, override);
        if (text === null) text = I18n.isText(defaultText) ? defaultText : key;
        return I18n.interpolate(text, params, count);
    }

    // unknown placeholders become empty
    static interpolate(text, params, count) {
        return String(text).replace(/\{\{\s*([\w.$@-]+)\s*\}\}/g, (match, name) => {
            var value = params ? params[name] : undefined;
            if (value === undefined && name === 'count') value = count;
            return value === undefined || value === null ? '' : String(value);
        });
    }
}
