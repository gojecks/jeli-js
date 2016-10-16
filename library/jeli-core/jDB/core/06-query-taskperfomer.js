
function $query(data)
{
    this.sortBy = function()
    {
      var sortArguments = arguments;
      if($isArray(data))
      {
          return data.sort(function(obj1, obj2)
          {
              /*
               * save the arguments object as it will be overwritten
               * note that arguments object is an array-like object
               * consisting of the names of the properties to sort by
               */
              var props = sortArguments,
                  i = 0, 
                  result = 0, 
                  numberOfProperties = props.length;
                    /* try getting a different result from 0 (equal)
                     * as long as we have extra properties to compare
                     */
                    while(result === 0 && i < numberOfProperties) 
                    {
                        result = compare(props[i])(obj1, obj2);
                        i++;
                    }
              
              return result;
          });
      }
    };

    this.where = function(logic,callback)
    {
      if($isArray(data) && logic)
      {
        var logic = removeSingleQuote(logic),
            filter = $removeWhiteSpace(logic).split(/(?:like):/gi);

        return data.filter(function(item,idx)
        {
            var found = ((filter.length > 1)?(String(item[filter[0]] || '').toLowerCase().search(String(filter[1]).toLowerCase()) !== -1) : $logicChecker(logic,item));

            if(callback && found)
            {
                callback.call(item,idx);
            }
            //set the data if found
            return found;
        })
      }

      return data; 
    };


    this._ = function(logic,callback)
    {
      var _search = [];
        if($isArray(data))
        {
          var _setLogicPerformer = (function(){
            if(logic)
            {
              if($isObject(logic))
              {
                var keyLen = Object.keys(logic).length;
                return function(item){
                  var found = 0;
                  //Loop through the logic
                      //match found item
                    for(var op in logic){
                      if(logic[op] === item._data[op]){
                        found++;
                      }
                    }
                    return keyLen === found;
                }
              }else{
                return function(item,idx)
                {
                  var filter = $removeWhiteSpace(logic).split(/(?:like):/gi);
                  return ((filter.length > 1)?(String(item._data[filter[0]] || '').toLowerCase().search(String(filter[1]).toLowerCase()) !== -1) : $logicChecker(logic,item._data));
                };
              }
            }else{
              return function(item){
                //push data into _search
                _search.push(item._data)
              }
            }
          })();

            expect(data).search(null,function(item,idx)
            {
                  var found = _setLogicPerformer(item,idx);
                if(found)
                {
                    if($isFunction(callback))
                    {
                       callback(item,idx);
                    }else
                    {
                      _search.push(item._data);
                    }
                }
            });

            return _search;
        }

        return data;
    };

      function compare(property) 
      {
        var sortOrder = 1;
        return function(a,b)
        {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        };
      }
}