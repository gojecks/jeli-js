import { isarray } from "@jeli/helpers";

/**
 * LazyLoader class
 * used for lazy loading script that are not bundled in the application
 * @param {*} dropZone
 *
 * create a new instance of LazyLoader
 * var lazyLoader = new LazyLoader(element);
 * PATHS_TO_RESOLVE must be js path
 * lazyLoader.js([PATHS_TO_RESOLVE], function() {});
 * PATHS_TO_RESOLVE must be css path
 * lazyLoader.css([PATHS_TO_RESOLVE], function() {});
 *  PATHS_TO_RESOLVE must be css path
 *  lazyLoader.jscs({
 *      "css": [PATHS_TO_RESOLVE],
 *      "js": [PATHS_TO_RESOLVE]
 *  }, function() {});
 *
 * static property for holding already resolve paths
 */
var lazyLoaderCachedPaths = new Map();
export class LazyLoader {
    constructor(dropZone) {
        this.dropZone = dropZone;
        this.setPath = function (path) {
            this.sourcePath = path;
            return this;
        };
    }

    static staticLoader() {
        LazyLoader._resolve.apply({}, arguments);
    }

    /**
     *
     * @param {*} filePaths
     * @param {*} callback
     * @param {*} type
     * @param {*} assetURL
     * @param {*} dropZone
     */
    static _resolve(filePaths, callback, type, assetURL, dropZone) {
        assetURL = assetURL || '';
        var totalFiles = 0, resolved = 0, failed = 0, _triggerImmediately = [];
        var types = ['js', 'css'];
        /**
         * path generator
         * @param {*} path
         */
        var clink = (path, ftype, params) => {
            var url = path.includes('//') ? path : [assetURL, path, (ftype ? "." : ''), ftype].join('');
            var urlParams = new URLSearchParams;
            if (params) {
                Object.keys(params).forEach(param => {
                    urlParams.set(param, params[param]);
                });
            }

            return url + urlParams;
        };


        //start the js process
        if (typeof callback !== 'function') {
            callback = function () { };
        }

        if (Array.isArray(filePaths)) {
            for (var filePath of filePaths) {
                var url = filePath;
                var attrs = {};
                var params = {};
                // check for object attributes
                if (typeof filePath == 'object') {
                    url = filePath.url;
                    attrs = filePath.attrs;
                    params = filePath.params;
                    type = type || LazyLoader.getExt(filePath.name);
                    // create the url if content is defined
                    if (filePath.content && type) {
                        url = URL.createObjectURL(new Blob([filePath.content], LazyLoader.mimeType(type)));
                    }
                }

                // check if file is already resolved else don't load
                if (!url || lazyLoaderCachedPaths.has(url)) {
                    const cached = lazyLoaderCachedPaths.get(url);
                    if (cached){
                        cached.callbacks.push(callback);
                        if (cached.resolved && !_triggerImmediately.includes(url)) {
                            _triggerImmediately.push(url);
                        }
                    }
                    continue;
                }

                var ftype = type || LazyLoader.getExt(url);
                if (types.includes(ftype)) {
                    totalFiles++;
                    lazyLoaderCachedPaths.set(url, {
                        callbacks: [callback],
                        resolved: false
                    });
                    var element = _createElement(clink(url, type || '', params), ftype, attrs);
                    attachListener(element, url);
                    (dropZone || document.getElementsByTagName('head')[0]).appendChild(element);
                }
            }
        }

        /**
         *
         * @param {*} filePath
         * @param {*} type
         * @param {*} attrs
         * @returns HTMLELEMENT
         */
        function _createElement(filePath, type, attrs) {
            var element = null;
            if (type === 'js') {
                element = document.createElement('script');
                element.src = filePath;
                // element.type = "module";
            } else if (type == 'css') {
                element = document.createElement('link');
                element.setAttribute('type', 'text/css');
                element.setAttribute('href', filePath);
                element.setAttribute('rel', 'stylesheet');
            }

            // attach addtional attributes to it
            if (attrs) {
                Object.keys(attrs).forEach(attr => {
                    element[attr] = attrs[attr];
                });
            }

            element.charset = "utf-8";
            element.timeout = 120;
            element.async = true;

            return element;
        }

        function attachListener(element, filePath) {
            element.onload = function () {
                resolved++;
                triggerCallack(filePath);
                // removing a <link> after load un-applies its stylesheet immediately - only <script>
                // is safe to remove here, its effects already ran and persist without the element
                if (element.tagName === 'SCRIPT') {
                    element.parentNode.removeChild(element);
                }
            };

            element.onerror = element.onabort = function () {
                failed++;
                triggerCallack(filePath);
                lazyLoaderCachedPaths.delete(filePath);
            };
        }

        function triggerCallack(filePath) {
            var allResolved = (totalFiles == (resolved + failed));
            if (allResolved) {
                const cached = lazyLoaderCachedPaths.get(filePath);
                cached.resolved = true;
                while (cached.callbacks.length) {
                    const _callback = cached.callbacks.shift();
                    _callback({
                        failed,
                        resolved,
                        allResolved
                    });
                }
            }
        }

        // trigger already resolved
        _triggerImmediately.forEach(triggerCallack);
    }

    /**
     * Resolves ES module(s) via dynamic `import()`, as an alternative to
     * `_resolve()`'s `<script>`-tag injection - lets a real ES-module build
     * chunk load through the platform's own module loader instead of a
     * runtime-injected `<script>` tag. Shares `_resolve()`'s
     * `lazyLoaderCachedPaths` cache and per-path callback-queue semantics
     * (a repeat call for an already-resolved path replays the cached
     * result instead of re-importing; the callback only fires once every
     * path in this call has settled), so existing callback-style
     * `LazyLoader` consumers can adopt this without changing how they read
     * the result - `callback({ failed, resolved, allResolved, modules })`,
     * `modules` being `{ [url]: <the imported module namespace> }`.
     * @param {*} filePaths - a module specifier, or an array of them
     * @param {*} callback
     */
    static resolveModule(filePaths, callback) {
        if (typeof callback !== 'function') {
            callback = function () { };
        }

        var paths = Array.isArray(filePaths) ? filePaths : [filePaths];
        var totalFiles = paths.length, resolved = 0, failed = 0;
        var modules = {};
        var _triggerImmediately = [];

        function triggerCallback(url) {
            var allResolved = (totalFiles == (resolved + failed));
            if (allResolved) {
                paths.forEach(function (path) {
                    var cached = lazyLoaderCachedPaths.get(path);
                    if (!cached) return;
                    cached.resolved = true;
                    while (cached.callbacks.length) {
                        var _callback = cached.callbacks.shift();
                        _callback({ failed, resolved, allResolved, modules });
                    }
                });
            }
        }

        paths.forEach(function (url) {
            if (!url || lazyLoaderCachedPaths.has(url)) {
                var cached = lazyLoaderCachedPaths.get(url);
                if (cached) {
                    cached.callbacks.push(callback);
                    if (cached.resolved) {
                        resolved++;
                        if (cached.module) modules[url] = cached.module;
                        if (!_triggerImmediately.includes(url)) _triggerImmediately.push(url);
                    }
                }
                return;
            }

            lazyLoaderCachedPaths.set(url, { callbacks: [callback], resolved: false, module: null });
            import(/* @vite-ignore */ url).then(function (mod) {
                resolved++;
                modules[url] = mod;
                var cached = lazyLoaderCachedPaths.get(url);
                if (cached) cached.module = mod;
                triggerCallback(url);
            }).catch(function () {
                // flush this path's callback queue (triggerCallback) *before*
                // deleting its cache entry - deleting first would wipe the
                // queued callbacks (including this call's own `callback`)
                // before they ever got a chance to fire, exactly the bug
                // that shipped here first: matches the order _resolve()'s
                // onerror handler already uses for the same reason.
                failed++;
                triggerCallback(url);
                lazyLoaderCachedPaths.delete(url);
            });
        });

        _triggerImmediately.forEach(triggerCallback);
    }

    static mimeType(type) {
        var mimeTypes = {
            js: 'application/javascript',
            css: 'text/css',
            json: 'application/json',
            txt: 'application/text'
        };

        return { type: mimeTypes[type || 'js'] };
    }

    static getExt(name){
        return (name || '').substring(name.lastIndexOf('.') + 1);
    }

    js(obj, callback) {
        LazyLoader._resolve(obj, callback, 'js', this.resourcePath, this.dropZone);
    }

    css(obj) {
        LazyLoader._resolve(obj, null, 'css', this.resourcePath, this.dropZone);
    }

    jscs(obj, callback) {
        for (var type in obj) {
            LazyLoader._resolve(obj[type], callback, type, this.resourcePath, this.dropZone);
        }

        return this;
    }
}

