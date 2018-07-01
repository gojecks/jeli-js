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

function generateArrayKeyType(key, model) {
    if ($inArray("[", key)) {
        key = key.split('['),
            len = key.length;
        while (len--) {
            var set = key[len];
            if (key[len].indexOf(']') > -1) {
                var _key = key[len].split(']')[0];
                set = model[_key] || _key;
            }
            key[len] = set;
        }

        key = key.join(".");
    }

    return key
}

//RegExp to match is array key
var isArrayKey = new RegExp(/.*\[(\d+)\]/);
//deepArrayChecker Function
//deepCheck the key of a require Model
//if Model type is Array
//remove array brackect and return the keys
function deepArrayChecker(create, key, model, value) {
    key = generateArrayKeyType(key, model).split(".");
    var end = key.pop(),
        nModel = matchStringWithArray(key, model, create);
    if (arguments.length > 3) {
        nModel[end] = value;
        return;
    }

    return !$isUndefined(nModel[end]) ? nModel[end] : "";
};

//match key with array type
/**
 * 
 * @param {*} key 
 * @param {*} model 
 * @param {*} create 
 */
function matchStringWithArray(key, model, create) {
    var modelDepth = model,
        i = 0;
    while (i <= key.length - 1) {
        modelDepth = createNewInstance(modelDepth, key[i], create, !isNaN(Number(key[i + 1])));
        i++;
    }

    return modelDepth;
}

/**
 * 
 * @param {*} model 
 * @param {*} key 
 * @param {*} create 
 */
function createNewInstance(model, key, create, nextIsArrayKey) {
    var objectType = nextIsArrayKey ? [] : {};
    if (create && !model[key]) {
        model[key] = objectType
    }

    return model && model[key] || objectType;
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

    return deepArrayChecker(create, $removeWhiteSpace(key), context);
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