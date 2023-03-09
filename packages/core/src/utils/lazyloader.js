import { isarray } from "js-helpers/helpers";

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
 */
LazyLoader.prototype._resolve = function (filePaths, callback, type) {
    var totalFiles = 0,resolved = 0;
    /**
     * path generator
     * @param {*} path 
     */
    var clink = (path) => {
        if (path.includes("//")) {
            return path;
        }

        return [this.sourcePath, path, ".", type].join('');
    }

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
            var element = _createElement(filePath, type);
            attachListener(element);
            (this.dropZone || document.getElementsByTagName('head')[0]).appendChild(element);
        }
    }

    function _createElement(filePath, type) {
        var element = null;
        if (type === 'js') {
            element = document.createElement('script');
            element.src = clink(filePath)
           // element.type = "module";
        } else {
            element = document.createElement('link');
            element.setAttribute('type', 'text/css');
            element.setAttribute('href', clink(filePath));
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

    function triggerCallack(){
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