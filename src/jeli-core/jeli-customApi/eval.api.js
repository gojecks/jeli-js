function maskedEval(scr, useScope) {
    // execute script in private context
    return (new Function("with(this) { try{ return " + scr + " }catch(e){ return undefined; } }")).call(useScope || {});
}

//@function simpleBooleanParser
//credit to  CMCDragonkai for the idea
function simpleBooleanParser($boolValue) {
    switch ($boolValue) {
        case (true):
        case ('true'):
        case (1):
        case ('1'):
        case ('yes'):
        case ('on'):
            return true;
            break;
        case ('false'):
        case (false):
        case ('0'):
        case (0):
        case ('off'):
        case ('no'):
            return false;
            break;
        default:
            return undefined;
            break;
    }
}

//@Function Name simpleTextParse
//@return NUMBER OR STRING
function simpleArgumentParser(arg, sub) {
    if (arg) {
        return !isNaN(parseInt(arg)) ? parseInt(arg) : (simpleBooleanParser(arg) || arg);
    }
}

//RegExp to match is array key
var isArrayKey = new RegExp(/.*\[(\d+)\]/);
//isArrayType Function
//deepCheck the key of a require Model
//if Model type is Array
//remove array brackect and return the keys
function isArrayType(key, model) {
    if (expect(key).contains('[')) {
        var sptKey = key.split('['),
            len = sptKey.length;
        while (len--) {
            var set = ((expect(sptKey[len]).contains(']')) ? sptKey[len].split(']')[0] : sptKey[len]);
            sptKey[len] = (!$isObject(model[set])) ? model[set] : set;
        }

        return function(create, value) {
            var end = sptKey[sptKey.length - 1],
                nModel = matchStringWithArray(sptKey.join("."), model, create);
            if (value) {
                nModel[end] = removeSingleQuote(value);
                return;
            }

            return nModel[end];
        };
    }

    return false;
}

//match key with array type
/**
 * 
 * @param {*} key 
 * @param {*} model 
 * @param {*} create 
 */
function matchStringWithArray(key, model, create) {
    var splitKey = $removeWhiteSpace(key).split('.'),
        modelDepth = model,
        i,
        diveIntoArray = function() {
            var justKey, isInArray,
                dived = false;
            isInArray = isArrayKey.exec(splitKey[i]);
            if (isInArray && isInArray.length && modelDepth) {
                justKey = splitKey[i].split('[')[0];
                modelDepth = modelDepth[justKey][isInArray[1]];
                dived = true;
            }

            return dived;
        };



    for (i = 0; i < splitKey.length - 1; i++) {
        if (!diveIntoArray()) {
            //get or set the Object
            modelDepth = createNewInstance(modelDepth, splitKey[i], create);
        }
    }

    //commented because of array-like loop

    // if(splitKey.length > 1){
    //     diveIntoArray();
    // }

    return modelDepth;
}

/**
 * 
 * @param {*} model 
 * @param {*} key 
 * @param {*} create 
 */
function createNewInstance(model, key, create) {
    if (create && !model[key]) {
        model[key] = {};
    }

    return model && model[key] || {};
}

/**
 * 
 * @param {*} key 
 * @param {*} context 
 * @param {*} create 
 */
function $modelSetterGetter(key, context, create) {
    if (!$isString(key)) {
        return key;
    }

    var namespaces = $removeWhiteSpace(key).split("."),
        func = namespaces.pop(),
        deepContext = matchStringWithArray(key, context, create);

    var check = isArrayKey.exec(func);
    if (check && check.length && deepContext) {
        var dKey = func.split('[')[0];
        if (deepContext.hasOwnProperty(dKey)) {
            return deepContext[dKey][+check[1]];
        } else {
            return "";
        }
    } else {
        var deepArrayChecker = isArrayType(key, context);
        if (deepArrayChecker) {
            return deepArrayChecker();
        }

        return (!$isUndefined(deepContext)) ? deepContext[func] : "";
    }

}

function matchScopeObject(ckey, fn) {
    var fnd = false;
    for (var i in ckey) {
        if (!$isUndefined(fn)) {
            if (fn.indexOf(ckey[i]) > -1) {
                fnd = ckey[i];
            }
        }
    }

    return fnd;
}

/**
 * split STRING on condition
 */
function splitStringCondition(str) {
    return $removeWhiteSpace(str).split(/[&&||]/gi);
}