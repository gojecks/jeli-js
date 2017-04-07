// Prepend Fn


  domElementProvider.prepend = function (h)
  {
    var arg = arguments,
        dis = this;

    domElementLoop(arg,function (obj)
    {
        domElementLoop(dis, function (ele) 
        {
          domElementLoop(obj,function(newObj)
          {
              insertBefore(newObj,ele);
          });
          
        });
    });

    return this;
  };

    domElementProvider.prependTo = function (h)
    {
      var child = this,
      arg = arguments,
      ins;
      if ( $isObject( h ))
      {
        domElementLoop(arg, function (obj) 
        {
          insertBefore(obj[0], child[0])
        });
      } 
      else
      {
        var ele = element(h);
        if (ele.length > 0)
        {
          if (ele.length === 1) 
          {
            insbef(ele[0], child[0]);
          } 
          else 
          {
            ele.prepend(child[0])
          }
        }
      }

      return this;
    };