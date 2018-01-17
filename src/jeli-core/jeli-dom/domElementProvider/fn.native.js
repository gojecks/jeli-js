var propertyFix = {
        tabindex: 'tabIndex',
        readonly: 'readOnly',
        'for': 'htmlFor',
        'class': 'className',
        maxlength: 'maxLength',
        cellspacing: 'cellSpacing',
        cellpadding: 'cellPadding',
        rowspan: 'rowSpan',
        colspan: 'colSpan',
        usemap: 'useMap',
        frameborder: 'frameBorder',
        contenteditable: 'contentEditable'
    },
    recur = function(el, type, fn) {
        return el && (fn(el) ? el : recur(el[type], type, fn))
    },
    ck = function(ele) {
        var vk = ele.replace(/[.#]/g, '-').split('-'),
            len = vk.length,
            by,
            klid,
            name;
        if (len > 1 && ck[0]) {
            name = ck[0],
                klid = ck[1],
                by = ele.match(/[.]/g) ? 'byClassAndName' : ele.match(/[#]/g) ? 'byIdAndName' : 'byTag';
        } else if (len > 1 && !ck[0]) {
            klid = ck[1],
                by = ele.match(/[.]/g) ? 'byClass' : ele.match(/[#]/g) ? 'byId' : 'byTag';
        } else {
            klid = ele,
                by = 'byTag';
        }

        return {
            by: by,
            klid: klid,
            name: name
        };
    },
    matchEle = {
        byId: function(ele, id) {
            return ele && ele.id === id;
        },
        byClass: function(ele, klass) {
            if (ele.className) {
                return ele && $inArray(klass, ele.className.split(' '));
            } else {
                return false;
            }
        },
        byClassAndName: function(ele, klass, name) {
            return matchEle.byClass(ele, klass) && ele.tagName === name.toUpperCase();
        },
        byIdAndName: function(ele, id, name) {
            return matchEle.byId(ele, id) && ele.tagName === name.toUpperCase();
        },
        byTag: function(ele, name) {
            return ele && ele.tagName === name.toUpperCase()
        }
    };

/**
 * 
 * @param {*} value 
 */
domElementProvider.val = function(value) {
    var ret,
        dis = this[0];
    if (!$isUndefined(value)) {
        dis.value = value;
        ret = dis;
    } else {
        ret = dis.value;
    }

    return ret;
};

/**
 * 
 * @param {*} deep 
 */
domElementProvider.clone = function(deep) {
    var clone = '';

    if ($isSupport.dom.cloning) {
        clone = this[0].cloneNode(deep);
    }

    return clone;
};


domElementProvider.remove = function() {
    domElementLoop(this, function(ele) {
        //throw a window event for elements removed
        if (ele.parentNode) {
            ele.parentNode.removeChild(ele);
        };
    });

    //trigger the remove event
    element(document).triggerHandler('jEli.event.remove');

    return this;
};

/**
 * 
 * @param {*} text 
 */
domElementProvider.text = function(text) {
    if (!this.length) {
        return this;
    }

    var ret;
    if (!text) {
        ret = this[0].innerText;
    } else {
        domElementLoop(this, function(ele) {
            ret = dis;
            if ($isObject(html)) {
                ele.innerText = text[0].innerText;
            } else {
                ele.innerText = text;
            }
        });
    }

    return ret;
};
/**
 * 
 * @param {*} html 
 */
domElementProvider.html = function(html) {
    if (!this.length) {
        return this;
    }
    var dis = this,
        ret;
    domElementLoop(this, function(ele) {
        if (html) {
            ele.innerHTML = '';
            ret = dis;
            if ($isObject(html)) {
                ele.appendChild(html[0]);
            } else {
                ele.innerHTML = html;
            }
        } else {
            ret = ele.innerHTML;
        }
    });

    return ret;
};

/**
 * 
 * @param {*} ele 
 */
domElementProvider.after = function(ele) {
    this[0].parentNode.insertBefore(ele, this[0].nextSibling);
    return this;
};

domElementProvider.empty = function() {
    domElementLoop(this, function(ele) {
        while (ele.firstChild) {
            ele.removeChild(ele.firstChild);
        }
    });

    //trigger the remove event
    element(document).triggerHandler('jEli.event.remove');

    return this;
};
/**
 * 
 * @param {*} name 
 */
domElementProvider.removeProp = function(name) {
    if ($isUndefined(ele)) {
        return;
    }

    if (propertyFix[name]) {
        name = propertyFix[name];
    }

    domElementLoop(this, function(ele) {
        try {
            ele[name] = undefined;
            delete(ele[name]);
        } catch (e) {}
    });

    return this;
};

domElementProvider.prop = function(name, val) {
    var pfx = function(n) {
        return (propertyFix[n]) ? propertyFix[n] : n;
    };

    if (!$isUndefined(val) && !$isObject(name)) {
        return this[0][pfx(name)];
    } else {
        domElementLoop(this, function(ele) {
            var nType = ele.nodeType;
            if (!ele || nType === 3 || nType === 8 || nType === 2) {
                return;
            }

            if ($isObject(name)) {
                domElementLoop(name, function(value, _name) {
                    ele[pfx(_name)] = value;
                });
            } else {
                ele[pfx(name)] = val;
            }
        });
    }
    return this;
};

/**
 * 
 * @param {*} wrapper 
 */
domElementProvider.wrap = function(wrapper) {
    if (!wrapper.length && wrapper.match(/@/)) {
        wrapper = element(wrapper)[0];
    } else if (wrapper && wrapper.length) {
        wrapper = wrapper[0];
    } else {
        wrapper = element('@span')[0];
    }

    var len = this.length;
    while (len--) {
        var ele = this[len];
        if (ele.parentNode) {
            ele.parentNode.replaceChild(wrapper, ele);
            wrapper.appendChild(ele);
        }
    };

    return element(wrapper);
};

/**
 * 
 * @param {*} wrapper 
 */
domElementProvider.goWrap = function(wrapper) {
    return wrapper.wrap(this);
};

domElementProvider.next = function() {
    return element(this[0].nextElementSibling);
};

domElementProvider.previous = function() {
    return element(this[0].previousElementSibling);
};

domElementProvider.offsetParent = function() {
    return element(this[0].offsetParent || this[0]);
};

domElementProvider.siblings = function() {
    if (Array.prototype.filter) {
        var el = this[0];
        return element(Array.prototype.filter.call(el.parentNode.children, function(child) {
            return child !== el;
        }));
    }

    return this;
};

/**
 * 
 * @param {*} ele 
 */
domElementProvider.parent = function(ele) {
    var ret,
        rg;
    if ($isUndefined(this[0])) {
        return this;
    }

    if (!ele) {
        ret = this[0].parentNode;
    } else {
        rg = ck(ele);
        ret = recur(this[0], 'parentNode', function(el) {
            return matchEle[rg.by](el, rg.klid, rg.name);
        });
    }

    return element(ret);
};

/**
 * 
 * @param {*} ele 
 */
domElementProvider.children = function(ele) {
    var ret = [],
        children;
    if (!ele) {
        var children = this[0].children;
    } else {
        children = this[0].querySelectorAll(ele);
    }

    domElementLoop(children, function(elem) {
        ret.push(elem)
    });

    return element(ret);
};

domElementProvider.contents = function() {
    var ret = [];
    domElementLoop(this[0].childNodes, function(elem) {
        ret.push(elem)
    });

    return element(ret);
};


domElementProvider.insertAfter = domInsertFn(function(node) {
    return node.nextSibling;
});

domElementProvider.insertBefore = domInsertFn(function(node) {
    return node;
});

/**
 * 
 * @param {*} callback 
 */
function domInsertFn(callback) {
    return function(node) {
        if (!node) {
            throw new Error('NODE is required!!')
        }

        if ($isString(node)) {
            node = element(node);
        }

        var dis = this;
        domElementLoop(node, function(insertNode) {
            domElementLoop(dis, function(ele) {
                insertNode.parentNode.insertBefore(ele, callback(insertNode));
                if (dis['$object:id']) {
                    ele['$object:id'] = dis['$object:id'];
                }
            });
        });

        dis = null;
        return this;
    };
}