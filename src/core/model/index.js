// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.

/**
 * 
 * @param {*} func 
 * @param {*} wait 
 * @param {*} immediate 
 */
function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this,
            args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) {
                func.apply(context, args);
            }
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) {
            func.apply(context, args);
        }
    };
};


/**
 * 
 * @param {*} fnData 
 */
function getFunctionsFromString(fnData) {
    return fnData.replace(/\W(;)/g, function(idx, key) {
        return ((idx.length > 1) ? idx.charAt(0) + '|' : '|');
    }).split('|');
}

function triggerArrayFnWithParams(listOfFns, params) {
    listOfFns.forEach(function(fn) {
        //function executor
        //push fn to initialized Fields
        if (!fn) { return; }
        params[0] = fn;
        execFnByName.apply(null, params);
    });
}

function EventType(el) {
    if ($inArray(el.type, EventType.types.input)) {
        ret = 'input';
    } else if ($inArray(el.type, EventType.types.change)) {
        ret = 'change';
    }

    return ret;
}

EventType.types = {
    change: ['checkbox', 'radio', 'select-one', 'select-multiple', 'select'],
    input: ['text', 'password', 'textarea', 'email', 'url', 'week', 'time', 'search', 'tel', 'range', 'number', 'month', 'datetime-local', 'date', 'color']
};

/*Get and Set the value of a given key to a model*/
/**
 * 
 * @param {*} key 
 * @param {*} model 
 * @param {*} value 
 */
function setModelValue(key, model, value) {
    value = $isString(value) ? removeSingleQuote(value) : value;
    deepArrayChecker(true, $removeWhiteSpace(key), model, value);
    return value;
}


/**
 * 
 * @param {*} logic 
 * @param {*} model 
 * @param {*} ignore 
 */
function $logicChecker($logic, elementModel, ignore) {
    var self = this;

    if ($isBooleanValue.indexOf($logic) > -1) {
        return simpleBooleanParser($logic);
    }

    var _evaluate;
    try {
        _evaluate = maskedEval($logic, elementModel);
    } catch (e) {};

    if (_evaluate) {
        return _evaluate;
    }

    //get Function Arg
    /**
     * 
     * @param {*} key 
     * @param {*} list 
     */
    function getFunctionArg(key, list) {
        var nArguments = [];
        if (list && list[key]) {
            var arg = list[parseInt(key) + 2];
            nArguments = generateArguments(arg, elementModel, self);
        }

        return nArguments;
    }

    var splitExpr = $removeWhiteSpace($logic).split(/([|()=<>!*+//&-])/ig),
        len = splitExpr.length;
    while (len--) {
        if (splitExpr[len].match(/[a-zA-Z]/ig)) {
            //get the exprValue from model
            var exprValue = maskedEval(splitExpr[len], elementModel);
            //check if exprValue is a function
            //initialize the function and set the value
            if ($isFunction(exprValue)) {
                //wrap the user function in a masked IIFE
                //IIFE only returns the actually result of the user function
                var arg = getFunctionArg(len, splitExpr);
                //remove the function method from the list
                splitExpr.splice(parseInt(len) + 1, 3);
                exprValue = exprValue.apply(exprValue, arg);
            }
            //check if exprValue is an Object or Array
            //set the value to true
            else if ($isObject(exprValue) || $isArray(exprValue)) {
                exprValue = true;
            }

            //convert null to false as it will be remove 
            //by jolin FN
            if ($isNull(exprValue) || $isUndefined(exprValue)) {
                exprValue = false;
            }

            splitExpr[len] = (($isString(exprValue)) ? "'" + exprValue + "'" : exprValue);
        }
    }
    //MaskedEval 
    return maskedEval(splitExpr.join(''));
}

/**
 * 
 * @param {*} args 
 * @param {*} context 
 * @param {*} event 
 */
function generateArguments(args, context, event) {
    var ret = [];
    if (args) {
        args = args.split(',');
        for (var i = 0; i < args.length; i++) {
            if (args[i] === "$event") {
                ret.push(event);
            } else {
                var param = maskedEval(args[i], context);
                ret.push(!$isUndefined(param) ? param : simpleArgumentParser(args[i]));
            }
        }
    }

    return ret;
}

/**
 * 
 * @param {*} fn 
 * @param {*} context 
 * @param {*} ev 
 */
function generateFnFromString(fn, context) {
    var arg = fn.match(/^(?:.*?)\((.*?)\)/),
        mfn = fn.match(/^(.*?)\(.*?\)/),
        namespaces = mfn[1].split("."),
        func = namespaces.pop();
    //set nameSpaces
    if (namespaces.length > 0) {
        for (var i = 0; i < namespaces.length; i++) {
            context = context[namespaces[i]];
        }
    }

    fn = context[func] || function() {};
    fn.arg = (arg || [])[1];
    fn.context = context;

    return fn;
}

/**
 * @Function execFnByName
 * Initialize the the Function 
 * @param {*} fn 
 * @param {*} elementRef 
 * @param {*} ev 
 * @return FN value
 */
function execFnByName(fn, elementRef, ev) {
    var fn = $removeWhiteSpace(fn),
        setValuechecker = fn.split(/([=])/ig),
        narg = [];

    //check if Operation is set value
    if (setValuechecker.length > 1) {
        var value = elementRef.context.evaluate(setValuechecker.pop());
        setModelValue(setValuechecker.shift(), elementRef.context.context, value);
    } else {
        //initialize the function returned
        fn = generateFnFromString(fn, elementRef.context.componentInstance);
        //Check if Arguments is required
        narg = generateArguments(fn.arg, elementRef.context.context, ev);
        return fn.apply(fn.context, narg);
    }
}