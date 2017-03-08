	// Fn Attribite 
	domElementProvider.removeAttr =function (attr)
  {
    domElementLoop(this, function (ele)
    {
      if ($isUndefined(ele)) return;

      if (ele.getAttribute(attr))
      {
        ele.removeAttribute(attr);
      }

    });

    return this;
  };

  domElementProvider.attr = function (name, val)
  {
    if (!val && name && !$isObject(name))
    {
      return this[0].getAttribute(name);
    }
     else
     {
        domElementLoop(this,function (ele)
        {
          if ($isString(name) && $isString(val))
          {
            ele.setAttribute(name, val);
          } else
          {
            if ($isObject(name))
            {
                domElementProvider.each(name, function (i, n) 
                {
                  ele.setAttribute(i, n);
                });
            }
          }
        });
     }
    
    return this;
  };