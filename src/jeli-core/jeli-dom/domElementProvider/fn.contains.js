    
    domElementProvider.contains = function(child)
      {      
        return this[0] !== child && this[0].contains(child);
      };

    domElementProvider.is = function(match,not)
      {
        if(match)
        {
          var isArray = $isArray(this[0]),
              found = ((isArray)?[]:{}),
              $setContentOnType = function(index,context)
              {
                  if(isArray)
                  {
                    found.push(context)
                  }else
                  {
                    found[index] = context;
                  }
              };
          this.each(function(index,context)
          {
            var matched = false;
            //User defined a function as match
            if($isFunction(match))
            {
              if(match.apply(null,[context]))
              {
                matched = true
              }
            }else //User defined a string or object
            {
              if($isEqual(context,match))
              {
                matched = true
              }
            }
              if(matched && !not)
              {
                $setContentOnType(index,context);
              }

              if(!matched && not)
              {
                $setContentOnType(index,context);
              }
          });

          return element( found );
        }
      };
  domElementProvider.add = function(data)
  {
      if($isArray(this[0]))
      {
        this[0].push(data);
      }

      return this;
  };