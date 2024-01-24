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
export function LazyLoader(dropZone) {
    this.dropZone = dropZone;
    this.setPath = function (path) {
        this.sourcePath = path;
        return this;
    };
}

LazyLoader.prototype.js = function (obj, callback) {
    this._resolve(obj, callback, 'js');
};

LazyLoader.prototype.css = function (obj) {
    this._resolve(obj, null, 'css')
};

LazyLoader.prototype.jscs = function (obj, callback) {
    for (var type in obj) {
        this._resolve(obj[type], callback, type);
    }

    return this;
};

/**
 * 
 * @param {*} filePaths 
 * @param {*} callback 
 * @param {*} type 
 * @param {*} assetURL 
 */
LazyLoader.prototype._resolve = function (filePaths, callback, type, assetURL) {
    var totalFiles = 0, resolved = 0;
    var types = ['js', 'css'];
    /**
     * path generator
     * @param {*} path 
     */
    assetURL = (assetURL || this.resourcePath || '')
    var clink = (path, ftype) => path.includes("//") ? path : [assetURL, path, (ftype ? "." : ''), ftype].join('');

    //start the js process
    if (typeof callback !== 'function') {
        callback = function () { };
    }

    if (Array.isArray(filePaths)) {
        for (var filePath of filePaths) {
            /**
             * check if file is already resolved else don't load
             */
            if (LazyLoader.cached.includes(filePath)) {
                break;
            }

            totalFiles++;
            LazyLoader.cached.push(filePath);
            var ftype = type || filePath.substring(filePath.lastIndexOf('.') + 1);
            if (types.includes(ftype)) {
                var element = _createElement(clink(filePath, type || ''), ftype);
                attachListener(element);
                (this.dropZone || document.getElementsByTagName('head')[0]).appendChild(element);
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
            element.src = filePath
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

    function attachListener(element) {
        element.onreadystatechange = element.onload = function () {
            var state = element.readyState;
            resolved++;
            if (!state || /loaded|complete/.test(state)) {
                triggerCallack();
                element.parentNode.removeChild(element);
            }
        };
    }

    function triggerCallack() {
        if (totalFiles == resolved)
            callback();
    }

    triggerCallack();
}

/**
 * static property for holding already resolve paths
 */
LazyLoader.cached = [];
LazyLoader.staticLoader = function () {
    LazyLoader.prototype._resolve.apply({}, arguments);
}