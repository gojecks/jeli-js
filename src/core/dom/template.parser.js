 /**
  * 
  * @param {*} templateModel 
  * @param {*} instance 
  */
 function getTemplateValue(templateModel, instance) {
     var value = maskedEval(templateModel.filterModel, instance);
     if (templateModel.filterName.length) {
         templateModel.filterName.forEach(function(filterName, idx) {
             value = filterParser(filterName, instance)(
                 ($isDefined(value) ? value : templateModel.filterModel), templateModel.filterExpression[idx]
             );
         });
     }

     return !$isUndefined(value) ? value : ''
 }

 /**
  * remove filters from string
  * @param {*} key 
  */
 function removeFilters(key) {
     var filter = { filterModel: "", filterExpression: [], filterName: [] },
         i;

     var hasFilter = removeSingleOperand(key, '[|]', '^', 'g').split('^');
     filter.filterModel = $removeWhiteSpace(hasFilter[0]);
     if (filter.filterModel.charAt(0) === ':') {
         filter.filterModel = filter.filterModel.replace(':', '');
     }

     if (hasFilter && hasFilter.length > 1) {
         //check if filter has additional requirement;
         //useful to extend filter value
         //@sample : dateTime filter
         var AllFilters = hasFilter.slice(1);
         for (var i in AllFilters) {
             var hasExpression = AllFilters[i].split(':');
             filter.filterName.push($removeWhiteSpace(hasExpression.shift()));
             if (hasExpression.length > 0) {
                 filter.filterExpression.push(hasExpression.join(':'));
             }
         }
     }

     return filter;
 }

 /**
  * 
  * @param {*} tmpl 
  * @param {*} model 
  * @param {*} pattern 
  */
 function templateParser(tmpl, model, pattern) {
     pattern = pattern || _defaultTemplateExp;
     if (!$isString(tmpl)) {
         return tmpl;
     }

     return (tmpl) && (tmpl).replace(pattern, function(i, key) {
         return getTemplateValue(removeFilters(key), model);
     });
 }