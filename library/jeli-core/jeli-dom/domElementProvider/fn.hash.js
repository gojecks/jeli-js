
domElementProvider.hash  = function(reverse)
  {
    if($isArray(this[0]) || $isObject(this[0]) )
    {
        var obj = ({});
      this.each(function(i,a)
      {
          if(reverse)
          {

            obj[i] = a;
          }else
          {
            obj[a] = i;
          }

      });

      return element(obj);
    }

    return this;
  };

domElementProvider.reverseHash = function()
  {
    return this.hash(true);
  };