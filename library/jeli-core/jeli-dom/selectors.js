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

function insertBefore(ele, elem)
{
  var ins = (ele.childNodes.length) ? ele.childNodes[0] : ele.childNodes;
  if (ins){
      ele.insertBefore(elem, ins);
  }
  else{
    ele.appendChild(elem);
  }
}

  // @Function to check for valid Element
  function isValidElement(ele) 
  {
    return (('nodeType' in ele) && ele.nodeType !== 3 && ele.nodeType !== 8);
  }


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
function jEliDOM(){}
jEliDOM.prototype.init = function(tag,context)
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


  //@Function jEli DOM
  function element(tag, context){
    return new jEliDOM().init.apply(null, arguments);
  }

  /*
    jQuery Resolver
    if jQuery is present use it else use jEliQuery
  */

function jQueryResolver(ele)
{
  return window.jQuery && jQuery(ele) || element(ele)
}

// set dom providers
$provider.$get('$jEliServices')
.$register('$document', jQueryResolver(document))
.$register('$window', jQueryResolver(window));
