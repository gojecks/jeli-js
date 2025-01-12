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
 * callback is trigger only for js loaders
 */
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
 * callback is trigger only for js loaders
 */

/**
 * static property for holding already resolve paths
 */
var lazyLoaderCachedPaths = [];
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
        var totalFiles = 0, resolved = 0, failed = 0;
        var types = ['js', 'css'];
        /**
         * path generator
         * @param {*} path
         */
        var clink = (path, ftype) => path.includes("//") ? path : [assetURL || '', path, (ftype ? "." : ''), ftype].join('');

        //start the js process
        if (typeof callback !== 'function') {
            callback = function () { };
        }
        
        if (Array.isArray(filePaths)) {
            for (var filePath of filePaths) {
                /**
                 * check if file is already resolved else don't load
                 */
                if (lazyLoaderCachedPaths.includes(filePath)) {
                    continue;
                }

                var ftype = type || filePath.substring(filePath.lastIndexOf('.') + 1);
                if (types.includes(ftype)) {
                    totalFiles++;
                    lazyLoaderCachedPaths.push(filePath);
                    var element = _createElement(clink(filePath, type || ''), ftype);
                    attachListener(element, filePath);
                    (dropZone || document.getElementsByTagName('head')[0]).appendChild(element);
                }
            }
        }

        /**
         *
         * @param {*} filePath
         * @param {*} type
         * @returns HTMLELEMENT
         */
        function _createElement(filePath, type) {
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

            element.charset = "utf-8";
            element.timeout = 120;
            element.async = true;

            return element;
        }

        function attachListener(element, filePath) {
            element.onload = function () {
                resolved++;
                triggerCallack();
                element.parentNode.removeChild(element);
            };

            element.onerror = element.onabort = function(){
                failed++;
                triggerCallack();
                lazyLoaderCachedPaths.splice(lazyLoaderCachedPaths.indexOf(filePath), 1);
            };
        }

        function triggerCallack() {
            var allResolved = (totalFiles == (resolved + failed));
            if (allResolved)
                callback({
                    failed,
                    resolved,
                    allResolved
                });
        }

        triggerCallack();
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

