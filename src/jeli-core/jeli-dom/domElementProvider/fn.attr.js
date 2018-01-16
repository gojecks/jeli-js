	/**
	 * 
	 * @param {*} attr 
	 */
	domElementProvider.removeAttr = function(attr) {
	    domElementLoop(this, function(ele) {
	        if ($isUndefined(ele)) return;

	        if (ele.getAttribute(attr)) {
	            ele.removeAttribute(attr);
	        }
	    });

	    return this;
	};

	/**
	 * 
	 * @param {*} name 
	 * @param {*} val 
	 */
	domElementProvider.attr = function(name, val) {
	    if (!val && name && !$isObject(name)) {
	        return this[0].getAttribute(name);
	    } else {
	        domElementLoop(this, function(ele) {
	            if ($isString(name) && $isString(val)) {
	                ele.setAttribute(name, val);
	            } else {
	                if ($isObject(name)) {
	                    domElementLoop(name, function(_name, value) {
	                        ele.setAttribute(_name, value);
	                    });
	                }
	            }
	        });
	    }

	    return this;
	};