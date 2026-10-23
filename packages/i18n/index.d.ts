/**
 * Type declarations for @jeli/i18n (hand-authored; see packages/common/index.d.ts for why the
 * Pipe({...}) / jModule({...}) annotations themselves are not declared).
 */

export interface I18nContext {
    lang: string;
    defaultLanguage: string;
    count?: number;
}

export type I18nSource = (key: string, context: I18nContext) => string | null | undefined;

export declare class I18n {
    static readonly lang: string;
    static readonly defaultLanguage: string;
    static readonly current: { lang: string; defaultLanguage: string };
    static configure(options: { lang?: string; defaultLanguage?: string; language?: (() => { lang?: string; defaultLanguage?: string } | null) | null }): void;
    static setLanguage(lang: string): void;
    static onChange(listener: (lang: string, previous: string) => void): () => void;
    static use(source: I18nSource, options?: { translation?: boolean }): () => void;
    static define(dictionary: { [key: string]: string }): void;
    static pluralCategory(lang: string, count: number): string;
    static candidates(key: string, lang: string, count?: number): string[];
    static lookup(key: string, count?: number, override?: string): string | null;
    static t(key: string, defaultText?: string | null, params?: any[] | { [name: string]: any }, override?: string | null): string;
    static interpolate(text: string, params?: any[] | { [name: string]: any }, count?: number): string;
}

export declare class TranslatePipe {
    compile(key: string, defaultText?: string | null, ...params: any[]): string;
}

export declare class TranslateOverridePipe {
    compile(key: string, defaultText?: string | null, override?: string | null, ...params: any[]): string;
}

export declare class I18nModule { }
