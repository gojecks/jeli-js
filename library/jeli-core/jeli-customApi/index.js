


function jEliFnInitializer(data)
{
  var _fn = data.replace(/\W(;)/g,function(idx,key)
      { 
        if(idx.indexOf(')') > -1){ return ')|'; }
        else{ return '|'; }
      }).split('|');

    this.run = function(params){
      findInList.call(_fn,function(idx,fn)
      {
          //function executor
          //push fn to initialized Fields
          params[0] = fn;
          execFnByName.apply(null,params);
      });
    };

    //evaluate
    this.evaluate = function(model){
      maskedEval(data,model);
    }
}

function attachEventProviders( ele )
{
    return function($model,ref)
    {
      if($isEqual(ele.nodeType,Node.ELEMENT_NODE))
      {
          findInList.call('j-click,j-dblclick,j-submit,j-mouseover,j-mouseenter,j-mousemove,j-mousedown,j-mouseup,j-mouseleave,j-keyup,j-keydown,j-keypress,j-change,j-blur,j-focus'.split(','), function(name,value)
          {
              var attr = ele.getAttribute(value),
                  nElement = element(ele);
              if(attr)
              {
                var splt = value.split('-')[1];

                //ignoreProcess Passer
                if( $inArray(splt,nElement.data('ignoreProcess') || [] ) )
                {
                  return;
                }

                //j-change requires j-model
                //check if j-model is defined when this event is used
                if($isEqual('change',splt) && !ele.getAttribute('j-model'))
                {
                    errorBuilder('jChange requires jModel to function with');
                }

                ignoreProcessCheck(ele,splt);
                //Store a reference to the element event
                  nElement
                  .bind(splt,function(ev)
                  {
                      var data = element(this).data(),
                          dis = this;

                      if(!$isUndefined(data))
                      {
                          try{

                             new jEliFnInitializer(data[splt]).run(["",$model,dis,ev]);

                          }finally
                          {
                              //consume every watchList
                              $model.$consume();
                          }
                      }
                  })
                  .addClass('j-binded');
              }
          });
        
        }
    }
}

function $typeOfModel(el)
{
    if (['checkbox', 'radio', 'select-one', 'select-multiple', 'password'].indexOf(el.type) >= 0)
        return 'change';
    if (['text', 'textarea', 'email', 'url', 'week', 'time', 'search', 'tel', 'range', 'number', 'month', 'datetime-local', 'date', 'color'].indexOf(el.type) >= 0)
        return 'input';
}

function $typeOfValue(el)
{
    switch(el.type)
    {
        case('checkbox'):
            return el.checked;
        break;
        default:
            return el.value;
        break;
    }
}

function getCommentNodes(elem)
{
    var children = elem.childNodes,
        comments = [];

    for(var c in children)
    {
        if(Number(c))
        {
            if(children[c].nodeType === COMMENT_NODE)
            {
                comments.push(children[c]);
            }
        }
    }

    return comments;
}

function moveToUnwatchList(arr)
{
    var sliced = $watchList.splice(arr,1)[0];
    sliced.unWatchRef = sliced.obj[OBJ_REF];
     $unWatchList.push(sliced);
}

//get reference obj from unWatchList
function getObjFromUnWatchList(ref)
{
    var found = [];
    for(var i in $unWatchList)
    {
        if($unWatchList[i].obj[OBJ_REF] === ref)
        {
            found = $unWatchList.splice(i,1);
        }
    }

    return found[0];
}

//add eli binding class to element
function addClass(ele,klass)
{
    if(!ele) return;

    domElementProvider.addClass.call([ele],(klass?klass:eliBindedClass)); 
}



//function html compiler
//HTML TO DOM function

function toDOM(ignore) 
{
  var type = function(text)
  {
    if(text.indexOf('tr') > -1 && !ignore)
    {
      return 'tbody';
    }else
    {
      return 'div';
    }

  },
  d = document,
  i,
  a = d.createElement(type(this)),
  b = d.createDocumentFragment();

  a.innerHTML = this.toString();
  while (i = a.firstChild){ b.appendChild(i) };

  return (ignore)?b.childNodes:b.firstChild;
};


    //$CustomEventHandler Function
  //Create Custom events that can be reused
  //anywhere within the application
  function $CustomEventHandler(type,defaultFn){
    if(!type){  type = 'on'};
    var handlers = ['on','emit'],
        _eventsQueue = {},
        _eventsObj  = function(){
             return ({
                    type : "",
                    registered : +new Date,
                    timestamp : +new Date,
                    isTrusted : true,
                    returnValue : true,
                    target:null,
                    defaultPrevented : false,
                    preventDefault : function(){
                      this.defaultPrevented  = true;
                    }
              });
          },
        _defaultFn = defaultFn || noop;

    this[type] = function(name,fn){
      if(!_eventsQueue[name]){
        _eventsQueue[name] = [];
      }
      _eventsQueue[name].push(fn);
    };

    this.$broadcast = function(name,arg){
      if(_eventsQueue[name]){
        var _events =  _eventsObj();
        _events.type = name;
        _events.timestamp = +new Date;
        _eventsQueue[name].forEach(function(fn){
            fn.apply(fn,[_events,arg]);
            if(!_events.defaultPrevented){
              _defaultFn(_events);
            }
        });
      }
    };

    this.$destroy = function(name){
      if(name && _eventsQueue[name]){
        delete _eventsQueue[name];
      }
    };
  }



  //jEli Encryption
  //@return Object {encrypt : decrypt}
  //@Objectives : Perform Encryption

  function buildLogic()
  {
      var str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=:?><*&%$#@!',
          len = 0,
          chArray = [],
          replace = [];

      while(len < str.length){
        chArray.push(str.charCodeAt(len++));
        replace.push( makeUID(2) );
      }

      return {
        charCode : chArray,
        replacer : replace
      };
  }

  function $encrypt()
  {
    var _logic = buildLogic();
    return ({
        encrypt : function(passer)
        {
          if(passer && passer.length)
          {
            var len = 0,
                encoded = "";
            while(len < passer.length)
            {
              encoded += _logic.replacer[_logic.charCode.indexOf(passer.charCodeAt(len++))];
            }

            return encoded;
          }

          return passer;
        },
        decrypt : function(passer)
        {
          if(passer && passer.length)
          {
            var spltPasser = passer.split(""),
                fakePasser = "",
                cnt=0,
                passer=[]; 
                //loop through and fix
                for(var v in spltPasser)
                { 
                  fakePasser +=spltPasser[v]; 
                  cnt++; 
                  if(cnt > 1)
                  { 
                      passer.push( String.fromCharCode( _logic.charCode[_logic.replacer.indexOf(fakePasser)] )); 
                      cnt=0; 
                      fakePasser="";
                  } 
                }
          }

          return passer.join("");
        }
    })
  }


  //BaseFn Factory
    function Base64Fn(){

      var publicApis = {};

      publicApis.encode = function b64EncodeUnicode(str) {
          return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
              return String.fromCharCode('0x' + p1);
          }));
      };

      publicApis.decode = function b64DecodeUnicode(str) {
          return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
      }

      return publicApis;
    }

  //generate GUID
  //xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  function GUID()
  {
      var rand = function(){ return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);}
      
      function recur(loop,seperator)
      {
          var h="";
          for(var i=0; i<loop; i++)
          {
              h +=rand();
          }

          return h + (seperator || '');
      }

      return recur(2,"-") + recur(1,"-") + recur(1,"-") + recur(1,"-") + recur(3);
  }

   //Expect Function
  function expect(objToInspect)
  {
      var inspectors = {
        contains : function(ins)
        {
          //Perform Object Check
          if($isObject(objToInspect))
          {
            return objToInspect.hasOwnProperty(ins) || (ins in objToInspect);
          }else
          {
            return objToInspect.indexOf(ins) > -1;
          }
        },
        search : function(str,callback)
        {
          var found = false;
          if($isObject(objToInspect))
          {
              for(var i in objToInspect)
              {
                if(callback && $isFunction(callback))
                {
                  if(callback(objToInspect[i],i))
                  {
                    found = objToInspect[i];
                  }
                }else
                {
                  if($isEqual(JSON.stringify(objToInspect[i]),JSON.stringify(str)))
                  {
                    found = objToInspect[i];
                  }
                }
              }
          }else
          {
            var len = objToInspect.length;
              while(len--)
              {
                  if(callback && $isFunction(callback))
                  {
                    if(callback(objToInspect[len],len))
                    {
                      found = objToInspect[len];
                    }
                  }
                  else
                  {
                    if($isEqual(JSON.stringify(objToInspect[len]),JSON.stringify(str))){
                      found = objToInspect[len];
                    }
                  }
              };
          }

          //return
          return found;
        }
      }

    return inspectors;
  }


  //Property Watch
    function defineProperty(obj,type,callBack)
    {
        //set watch on stack
        Object.defineProperty(obj, type, 
        {
            configurable: false,
            enumerable: false, // hide from for...in
            writable: false,
            value: callBack
        });
    }


    var inUpdateProgress = 0;
    function fireEvent(fn)
    {
      if(inUpdateProgress)
      {
        setTimeout(function()
        {
          inUpdateProgress = 0;
          fn();
        },1000);

        return;
      }
      fn();
      inUpdateProgress = 1;

    }
