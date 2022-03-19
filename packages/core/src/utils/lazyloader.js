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
    this.setPath = function(path) {
        this.sourcePath = path;
        return this;
    };
}

LazyLoader.prototype.js = function(obj, callback) {
    this._resolve(obj, callback, 'js');
};

LazyLoader.prototype.css = function(obj) {
    this._resolve(obj, null, 'css')
};

LazyLoader.prototype.jscs = function(obj, callback) {
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
LazyLoader.prototype._resolve = function(filePaths, callback, type) {
    var stack = [],
        self = this;
    //start the js process
    if (typeof callback !== 'function') {
        callback = function() {};
    }

    if (filePaths && isarray(filePaths) && filePaths.length > 0) {
        for (var i = 0; i < filePaths.length; i++) {
            /**
             * check if file is already resolved else don't load
             */
            if (LazyLoader.cached.hasOwnProperty(filePaths[i])) {
                break;
            }

            LazyLoader.cached[filePaths[i]] = "" + Math.random();
            switch (type) {
                case ('css'):
                    _createCss(filePaths[i]);
                    break;
                case ('js'):
                    _createJs(filePaths[i]);
                    break;
            };
        }

        if (type === 'js' && stack.length) {
            process(callback);
        } else {
            callback();
        }
    }

    /**
     * 
     * @param {*} cssPath 
     */
    function _createCss(cssPath) {
        var styleElement = document.createElement('link');
        styleElement.setAttribute('type', 'text/css');
        styleElement.setAttribute('href', clink(cssPath));
        styleElement.setAttribute('rel', 'stylesheet');
        styleElement.setAttribute('id', LazyLoader.cached[cssPath]);
        append(styleElement);
    }

    /**
     * 
     * @param {*} jsPath 
     */
    function _createJs(jsPath) {
        var scriptElement = document.createElement('script');
        scriptElement.setAttribute('src', clink(jsPath));
        scriptElement.setAttribute('type', 'text/javascript');
        scriptElement.async = true;
        scriptElement.setAttribute('id', LazyLoader.cached[jsPath]);
        stack.push(scriptElement);
    }

    /**
     * path generator
     * @param {*} path 
     */
    function clink(path) {
        if (path.includes("//")) {
            return path;
        }

        return [self.sourcePath, path, ".", type].join('');
    }

    /**
     * function to append the created element to dom
     * @param {*} scriptElement 
     */
    function append(scriptElement) {
        (self.dropZone || document.getElementsByTagName('head')[0]).appendChild(scriptElement);
    }

    /**
     * 
     * @param {*} isCallback 
     */
    function process(isCallback) {
        var currentElement = stack.shift();
        append(currentElement);
        currentElement.onreadystatechange = currentElement.onload = function() {
            var state = currentElement.readyState;
            if (!isCallback.done && (!state || /loaded|complete/.test(state))) {
                if (stack.length) {
                    process(isCallback);
                } else {
                    isCallback.done = true;
                    //trigger callback
                    isCallback();
                }
            }
        };
    };
}

/**
 * static property for holding already resolve paths
 */
LazyLoader.cached = {};
LazyLoader.staticLoader = function() {
    LazyLoader.prototype._resolve.apply({}, arguments);
}