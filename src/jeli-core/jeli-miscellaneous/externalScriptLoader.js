//external Script loading
function loadExternalScript(dropZone) {
    this.dropZone = dropZone;
    this.setPath = function(path) {
        this.sourcePath = path;
        return this;
    };
}

loadExternalScript.prototype.js = function(obj, callback) {
    init.call(this, obj, callback, 'js');
};

loadExternalScript.prototype.css = function(obj) {
    init.call(this, obj, null, 'css')
};

loadExternalScript.prototype.jscs = function(obj, callback) {
    var self = this;
    domElementProvider.each(obj[0], function(i, n) {
        init.call(self, n, callback, i);
    });

    return this;
};

/*
  lazyLoader Initializer
*/
function init(obj, callback, type) {
    var s,
        inc = 0,
        stack = [],
        self = this;

    if (obj && $isArray(obj) && obj.length > 0) {
        var clink = function(n, folder) {
                if ($inArray("//", n)) {
                    return n;
                }

                return [self.sourcePath, n, ".", type].join('');
            },
            append = function(ele) {
                (self.dropZone || document.getElementsByTagName('head')[0]).appendChild(ele);
            },
            process = function(isCallback) {
                var isProcessing = stack.shift();
                append(isProcessing);
                isProcessing.onreadystatechange = isProcessing.onload = function() {
                    var state = isProcessing.readyState;
                    if (!isCallback.done && (!state || /loaded|complete/.test(state))) {
                        if (stack.length) {
                            process(isCallback);
                        } else {
                            isCallback.done = true;
                            //trigger the isExternal loader Fn
                            var extLoader = $provider.$get('$isExternalLoader');
                            if (extLoader.status && extLoader.init) {
                                extLoader.init();
                                extLoader.status = false;
                            }

                            //trigger callback
                            isCallback();
                        }
                    }
                };
            };

        findInList.call(obj, function(i, n) {
            switch (type) {
                case ('css'):
                    s = document.createElement('link');
                    s.setAttribute('type', 'text/css');
                    s.setAttribute('href', clink(n));
                    s.setAttribute('rel', 'stylesheet');
                    append(s);
                    break;
                case ('js'):
                    s = document.createElement('script');
                    s.setAttribute('src', clink(n));
                    s.setAttribute('type', 'text/javascript');
                    s.async = true;
                    stack.push(s);
                    break;
            };
        });

        if ($isEqual(type, 'js') && stack.length) {
            //start the js process
            if ($isUndefined(callback)) {
                callback = function() {};
            }

            process(callback);
            inc++;
        }
    }
}

/*
  create a stylesheet and append to DOM location
*/
function customStyleSheetAppender(style, dropZone) {
    var jEliStyles = document.createElement('style');
    jEliStyles.setAttribute('type', 'text/css');
    if (jEliStyles.styleSheet) {
        jEliStyles.styleSheet.cssText = style;
    } else {
        jEliStyles.appendChild(document.createTextNode(style));
    }

    (dropZone || document.getElementsByTagName("head")[0]).appendChild(jEliStyles);
}