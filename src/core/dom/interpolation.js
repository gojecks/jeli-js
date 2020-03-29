 /**
  * 
  * @param {*} templateModel 
  * @param {*} instance 
  */
 function getTemplateValue(templateModel, instance) {
     var value = resolveValueFromContext(templateModel.prop, instance);
     if (templateModel.fns) {
         value = templateModel.fns.reduce(function(accum, filterName, idx) {
             var filterArgs = (templateModel.args[idx] || []).map(function(key) {
                 return resolveValueFromContext(key, instance) || key;
             });
             /**
              * add the value to args
              */
             filterArgs.unshift(accum);

             return filterParser(filterName, filterArgs);
         }, ($isDefined(value) ? value : templateModel.prop));
     }

     return value;
 }

 /**
  * 
  * @param {*} key 
  */
 function getValueFromModel(key) {
     if ($inArray('|', key)) {
         var filteredKey = removeFilters(key);
         return function(model) {
             return getTemplateValue(filteredKey, model);
         }
     } else {
         return function(model) {
             return resolveValueFromContext(key, model)
         };
     }
 }

 /**
  * 
  * @param {*} definition 
  * @param {*} context 
  * @param {*} cb 
  */
 function compileTemplate(definition, context, cb) {
     var value = undefined;
     if (definition.templates) {
         value = definition.templates.reduce(function(accum, options) {
             return accum.replace(options.replace, evaluateExpression(options.exp, context));
         }, definition.rawValue);
     } else {
         value = evaluateExpression(definition, context);
     }

     if (!$isEqual(definition.lastCompiled, value)) {
         definition.lastCompiled = value;
         cb(value);
     }
 }

 function evaluateExpression(expr, context) {
     if ($isObject(expr)) {
         return getTemplateValue(expr, context);
     } else if (!$isString(expr)) {
         return expr;
     }

     return resolveValueFromContext(expr, context);
 };