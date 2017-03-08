      
    domElementProvider.val = function (v)
      {
        var ret,
        dis = this[0];
          if (!$isUndefined(v))
          {
            dis.value = v;
            ret = dis;
          } 
          else{
            ret = dis.value;
          }

        return ret;
      };

    domElementProvider.clone = function (deep)
    {
      var clone = '';

      if ($isSupport.dom.cloning)
      {
        clone = this[0].cloneNode(deep);
      }

      return clone;
    };


    domElementProvider.remove = function ()
      {
        domElementLoop(this,function (ele)
        {
          //throw a window event for elements removed
            if (ele.parentNode)
            {
              ele.parentNode.removeChild(ele);
            };
        });

        //trigger the remove event
        element(document).triggerHandler('jEli.event.remove');

        return this;
      };


      domElementProvider.text =function(text)
      {
        if(!this.length)
        {
          return this;
        }

        var ret;
        if(!text)
        {
          ret =  this[0].innerText;
        }else
        {
          domElementLoop(this,function (ele)
          {
              ret = dis;
              if ($isObject(html))
              {
                ele.innerText = text[0].innerText;
              } else
              {
                ele.innerText = text;
              }
          });
        }

        return ret;
      };

      domElementProvider.html = function (html)
      {
        if(!this.length){
          return this;
        }
        var dis = this,ret;
        domElementLoop(this,function (ele)
        {
          if (html)
          {
              ele.innerHTML = '';
              ret = dis;
            if ($isObject(html))
            {
              ele.appendChild(html[0]);
            } else
            {
              ele.innerHTML = html;
            }
          } else
          {
            ret = ele.innerHTML;
          }
        });

        return ret;
      };

      domElementProvider.after = function(ele)
      {
        this[0].parentNode.insertBefore(ele,this[0].nextSibling);
        return this;
      };

    domElementProvider.empty = function()
    {
        domElementLoop(this,function(ele)
        {
            while(ele.firstChild)
            {
              ele.removeChild(ele.firstChild);
            }
        });

        //trigger the remove event
        element(document).triggerHandler('jEli.event.remove');

        return this;
    };