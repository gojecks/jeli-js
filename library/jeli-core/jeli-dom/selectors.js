  //isMy child
  function $isMyChild(parent)
  {
      return function(child)
      {
        return parent.contains(child);
      }
  }

  //$hasClass
  function $hasClass(klass)
  {
          if(!this) return false

          return (this.className.indexOf(klass) > -1)?1:0;
  }


  //@Directive Matcher
  function directiveMatcher(name)
  {
    var str = name.match(/[A-Z]/g),
        matcher = name;
        if(str.length > 0)
        {
            domElementProvider.each(str,function(i,n)
            {
                matcher = matcher.replace(n,'-'+n.toLowerCase());
            });
        }
        return matcher;
  }


  function insertBefore(ele, elem)
  {
    var ins = (ele.childNodes.length) ? ele.childNodes[0] : ele.childNodes;
    if (ins){
        ele.insertBefore(elem, ins);
    }
    else{
      ele.appendChild(elem);
    }
  };

    // @Function to check for valid Element
    function isValidElement(ele) 
    {
      return ele.nodeType !== 3 && ele.nodeType !== 8;
    }

   

  var domElementProvider = {
      not : function(obj)
      {
        return this.is(obj,1);
      },
      each : function( obj , callback )
      {
          var i = 0,
              value;

          function removeObject(loop)
          {
            var ret = [];
            domElementLoop(loop,function(obj)
            {
              ret.push(obj);
            });

            return ret;
          }

          if ($isFunction(obj))
          { 
              callback = obj;
              obj = ($isArray(this[0]) || $isObject(this[0]))?this[0]:removeObject(this);

          }

          if ($isFunction(callback))
          {
            if ($isArray(obj))
            {
              for (; i < obj.length; i++)
              {
                value = callback.call(obj[i], i, obj[i]);
                if (value === false)
                {
                  break;
                }
              }
            } else
            {
              for (i in obj)
              {
                value = callback.call(obj[i], i, obj[i]);
                if (value === false)
                {
                  break;
                }
              }
            }
          }

          return obj;
      },
      ready : eliready,
      addClass : function(klas)
      {
          if(!this) return;

        domElementLoop(this,function(ele)
        {
          if(!$hasClass.call(ele,klas))
          {
              var className = ele.className.split(' ');
                  className.push(klas);
              ele.className = className.join(' ');
          }
        }); 
          return this;
      },
      removeClass : function(klas)
      {
           if(!this) return;

          domElementLoop(this,function(ele)
          {
              if($hasClass.call(ele,klas))
              {
                  var className = ele.className.split(' ');
                      className.splice(className.indexOf(klas),1);
                  ele.className = className.join(' ');
              }
          });

          return this;
      },
      css: function (name, value)
      {
        if ( ( name && !value ) && $isString(name))
        {
          if ($isSupport.computedStyle)
          {
            var ret = window.getComputedStyle(this[0]) [name];

            return parseInt(ret) || ret;

          } else
          {
            return;
          }
        }

        //set the style required with the provided value and element
        function setStyle(ele,name,value)
        {
          ele.style[name] = ($inArray(name, ['width','height','top','bottom','left','right']) && $isNumber(value)) ? value + 'px' : value;
        }

        domElementLoop(this,function (ele)
        {
            if (!ele.tagName || $isUndefined(ele))
            {
              return;
            } 

            if (!$isObject(name) && value)
            {
                //set the style required
                setStyle(ele,name,value);
            } else
            {
                for (var o in name)
                {
                  //set the style required
                  setStyle(ele,o,name[o]);
                }
            }
        });

        return this;
      },
      val: function (v)
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
      },
      clone: function (deep)
      {
        var clone = '';

        if ($isSupport.dom.cloning)
        {
          clone = this[0].cloneNode(deep);
        }

        return clone;
      },
      append: function (h)
      {
        var arg = arguments,
            dis = this;
        domElementLoop(arg,function (obj)
        {
          if($isString(obj)){
            obj = element(obj);
          }

            domElementLoop(dis, function (ele) 
            {
              domElementLoop(obj,function(newObj)
              {
                  ele.appendChild(newObj);

                  if(obj['$object:id'])
                  {
                    ele['$object:id'] = obj['$object:id'];
                  }
              });
              
            });
        });

        return this;
      },
      find : function(selector)
      {
        if(this.length)
        {
          return findInElement(this,selector);
        }

        return [];
      },
      prepend: function (h)
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
      },
      prependTo: function (h)
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
      },
      removeAttr: function (attr)
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
      },
      attr: function (name, val)
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
      },
      remove: function ()
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
      },
      getFirstChild : function()
      {
          if(this[0].nodeType === document.ELEMENT_NODE && this[0].firstChild)
          {
            return this[0].firstChild;
          }

          return [];
      },
      text:function(text)
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
      },
      html: function (html)
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
      },
      appendTo: function (h)
      {
        var child = this,
        arg = arguments;
        if ($isObject(h))
        {
          domElementLoop(arg, function (obj) 
          {
            obj[0].appendChild(child[0]);
          });
        } 
        else
        {
          var ele = element(h);
          if (ele.length > 0)
          {
            if (ele.length === 1) {
              ele[0].appendChild(child[0]);
            } 
            else 
            {
              ele.append( child.clone(1) )
            }
          }
        }

        return this;
      },
      after : function(ele)
      {
        this[0].parentNode.insertBefore(ele,this[0].nextSibling);
        return this;
      },
      hasClass : function(klas)
      {
          if(!this) return;

          return $hasClass.call(this[0],klass);
      },
      empty : function()
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
      },
      add : function(data)
      {
          if($isArray(this[0]))
          {
            this[0].push(data);
          }

          return this;
      },
      getLength : function(data)
      {
        data = $isUndefined(data)?this[0]:data;

          return $isArray(data)?data.length : $countObject(data);
      },
      data: function (key, value)
      {
        if (this.length)
        {
          var self = this[0],
          getStorage = function ()
          {
            //generate new element ID
            var duid = getElementStorageID(self);
            //if id not in watchList
            //create a new Object WatchList
            if (!EDS[duid])
            {
              EDS[duid] = extend({}, inlineAttribute());
            } 

            //return the newly created element Data
            return EDS[duid];
          },
          getElementStorageID = function (ele)
          {
            if(!isValidElement(ele)){ return; } 

            //generate a new ref ID
            if(!ele[OBJ_REF])
            {
              ele[OBJ_REF] = EUID++;
            }
            //return the ID
            return ele[OBJ_REF] ? ele[OBJ_REF] : EUID;
          },
          store = function ()
          {
            if (!value && $isObject(key))
            {
              EDS[getElementStorageID(self)] = extend(getStorage(), key);
            } else
            {
              EDS[getElementStorageID(self)][key] = value;
            }
          },
          retrieve = function ()
          {
            if (key && !value && typeof key === 'string')
            {
              return getStorage()[key]; 
            }
             else
             {
                return getStorage();
             }
          },
          inlineAttribute = function ()
          {
            var attr = self.attributes,
                ret = {},
                val,
                i;
            if (attr && attr.length)
            {
              for (i = 0; i <= attr.length - 1; i++)
              {
                if (attr[i].nodeName.indexOf('-') > - 1)
                {
                  if ($isJsonString(attr[i].value) && !tplRegEx.test(attr[i].value))
                  {
                    val = maskedEval(attr[i].value) || attr[i].value;
                  }
                  else
                  {
                    val = attr[i].value;
                  }
                  
                  ret[attr[i].nodeName.split('-').slice(1).join('')] = val;
                }
              }
            }
            return ret;
          };
          if (arguments.length === 2 || $isObject(key))
          {
            store();
          }else{
            return retrieve();
          }
        }
        return this;
      },
      removeData : function(key)
      {
        if(key && this[0])
        {
          var data = this.data();
              delete data[key];
          this.data(data);
        }

        return this;
      },
      jID: function ()
      {
        var ele = this[0],
            mkid = function () 
            {
              var kid = ele.tagName.toLowerCase() + '_' + makeUID(10);
              ele.id = kid;
              return kid
            };
        if (ele.id)
        {
          return ele.id 
        }
        else{
          return mkID();
        }
      },
      jModel : function()
      {
          if(!findInProvider('jDebugProvider').$disableDebugMode)
          {
            return $modelMapping.$get(this.data('jModel'));
          }

          return undefined;
      },
      height: function ()
      {
        return this[0].clientHeight || this[0].innerHeight || -1;
      },
      width: function ()
      {
        return this[0].clientWidth || this[0].innerWidth || -1;
      },
      outerWidth: function ()
      {
        return this[0].offsetWidth || -1;
      },
      outerHeight: function ()
      {
        return this[0].offsetHeight || -1;
      },
      position: function ()
      {
        var el = this[0];
        return {
          left: el.offsetLeft,
          top: el.offsetTop
        };
      },
      injector : function()
      {
        if(this[0] === $compileTracker.lastCompiledWith)
        {
          return new $dependencyInjector(1);
        }

        return undefined;
      },
      hash : function(reverse)
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
      },
      reverseHash : function()
      {
        return this.hash(true);
      },
      get : function(index)
      {
        return this[index];
      },
      triggerHandler : function(eventName)
      {
        var listener = events._data(eventName,this[0]);
          if(listener.length && this[0].dispatchEvent)
          {
            this[0].dispatchEvent( listener[0].event );
          }
      },
      trigger : function(eventName,arg)
      {
        var event = element.Event.apply(null,arguments);
        domElementLoop(this,function(ele)
        {
          ele.dispatchEvent( event );
        });
      },
      contains : function(child)
      {      
        return this[0] !== child && this[0].contains(child);
      },
      compile : function(obj)
      {
        var model = $publicProviders.$rootModel.$new();
        //extend the model
        if(obj && $isObject(obj))
        {
          if(obj.hasOwnProperty('$mId') && $modelMapping.$get(obj.$mId))
          {
            model = obj;
          }else{
            extend(model,obj);
          }
        }
        
        return $templateCompiler(this[0])(model);
      },
      is : function(match,not)
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
      }
  };


  //extend the domProvider methods
  events.addDomMethods();


  //element Checker
  function elementBuilder(elements)
  {
      var found = {},
          j=0;
      if (elements.length)
      {
        for (var i in elements)
        {
          if(elements[i].nodeName)
          {
              found[i] = elements[i];
              j++;
          }
        }
      };

      found.length = j;

      return found;
  }

  //Check Element
    function elementChecker(query, elements)
    {
        var i,
            ret = [];
        if (query.match(/[#.:=-]/g) || query.match(new RegExp('\\s')))
        {
          for (i in elements)
          {
            if (elements[i].tagName)
            {
              ret.push(l[i]);
            }
          }
        } else
        {
          for (i in elements)
          {
            if (elements[i].tagName)
            {
              if ($isEqual(elements[i].tagName.toLowerCase(), query))
              {
                ret.push(elements[i]);
              }
            }
          }
        }

      return elementBuilder(ret);
    }

    function findInElement(ele, query)
    {
      var l;
      if ( $isObject(ele) || $isArray(ele))
      {
        if (!ele.length && (ele.nodeType === 9 || (ele) === window))
        {
              l = element(query);
        }
        else
        {
          l = ele[0].querySelectorAll(query);
        }
      }else
      {
        l = document.querySelectorAll(query, document.querySelector(ele)[0]);
      }

      return elementBuilder( l );
    }

    //jEli find
  function find(h)
  {
      return (this && this.length)?findInElement(this, h):findByXpr(h);
  }

    function findByXpr(query)
    {
      var nquery,
          ret = [];
      if (query.match(/[:]/))
      {
          nquery = query.split(':');
          var ele = document.querySelectorAll( nquery[0] );
          if (ele.length)
          {
            var last = ele.length - 1,
                el,i;
            for (i = 0; i <= last; i++)
            {
              el = ele[i];
              switch (nquery[1])
              {
                case ('hidden') :
                  if (el.offsetHeight < 1)
                    ret.push(ele[i]);
                  break;
                case ('visible') :
                  if (el.offsetHeight > 0)
                  ret.push(ele[i]);
                  break;
              }
            };
          }

        return elementBuilder( ret );
      }else
      {
          return elementBuilder( document.querySelectorAll(query) );
      } 
    }

    function ByNew(tag)
    {
      if (tag.match(/[<>]/g))
      {
        return elementBuilder( toDOM.call( tag , true) );
      }

      //Create a new DOM Element

      return elementBuilder( [document.createElement(tag.replace(/[@]/g, ''))]);
    }

  /*
    @Function jEliDOM
    @arugments : tag :{STRING} OR {OBJECT} OR {ARRAY}, context : {STRING} OR {OBJECT} OR {ARRAY}
    @return {OBJECT}
    */

    function jEliDOM()
    {
        //initialize Function
        this.init = function(tag,context)
        {
          if (!$isUndefined(tag))
          {
            function match(type)
            {
              return typeof tag === type;
            }


            function init()
            {
                var obj = Object.create(domElementProvider),
                    res;
              if (match('object'))
              {
                res = {
                  0: tag,
                  length: 1
                };

              }
              else if(!$isUndefined(context))
              {
                res = findInElement(context, tag);
              } 
              else if (match('string') && ((tag.match(/[#.=-]/g) || tag.match(new RegExp('\\s'))) && !tag.match(/[@<>]/g)))
              {
                res = find(tag);
                res.selector = tag;
                res.context = context;
              } 
              else if (match('string') && tag.match(/[@<>]/g)) 
              {
                res = ByNew(tag);
              } 
              else {
                res = match('string') && find( tag );
              }

              return extend(obj, res);
            }

            //use try and catch method to check if jQuery is Available
              return init();
          }
        };
    }


    //@Function jEli DOM
    function element(tag, context){
      return new jEliDOM().init.apply(null,arguments);
    }