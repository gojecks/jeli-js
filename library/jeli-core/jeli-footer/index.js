
/** JELI MODULE INITIALIZER **/
function $jModule(name,require)
{
  if(!module.hasOwnProperty(name))
  {
      ( module[name] = (new cBuild()), 
       module[name].appName = name,
       $factory[name] = {}, 
       $service[name] = {}, 
       $directivesProvider[name] = {}, 
       $jValueProvider[name] = {},
        module[name]['require'] = [] );

    if(arguments.length > 1)
    {
        if(require.length > 0)
        {
          module[name].require = require;
        }
    }
  }
        
    return module[name];
}

//moduleCompileFn
function copy(item)
{
  var type = {};
  if($isArray(item)){
    type = [];
  }

    if(item && item.nodeType){
        // DOM Node
        return item.cloneNode(true); // Node
    }

    if($isFunction(item)){
      return item;
    }

    if(item instanceof Date){
        // Date
        return new Date(item.getTime());    // Date
    }

    if(item instanceof RegExp){
        // RegExp
        return new RegExp(item);   // RegExp
    }

  return extend(type,item);
}

//setup $httpProvider
function $http( url , options )
{
    return ajax.apply(ajax,arguments);
}

$http.get = function (url,  data,headers)
{
  var options = {};
      options.type = 'get';
      options.data = data;
      options.headers = headers || {};

  return ajax(url, options);
};

//set $http prototype
$http.post = function (url, data,headers)
{
  var options = {};
      options.type = 'post';
      options.data = data;
      options.headers = headers || {};

  return ajax(url, options);
};

function jQueryResolver(ele)
{
  return window.jQuery && jQuery(ele) || element(ele)
}

//setUp Public Providers Here
$publicProviders = 
{   
    $http : $http,
    $defer : $p ,
    $q : $d,
    $cookie : $cookie,
    $jCompiler : $templateCompiler,
    $rootModel : new $modelGenerator(),
    $document : jQueryResolver(document),
    $window : jQueryResolver(window),
    $timeout : $timeout,
    $rootElement : null,
    $localStorage : $localStorage,
    $sessionStorage : $sessionStorage,
    $injector : new $dependencyInjector(),
    "Base64" : Base64Fn
};

//@Function binding
//@Argument Element (required)
//@true

function bind(evName,fn)
{
    if(!$isEqual(this.nodeType,Node.ELEMENT_NODE)){
      return;
    } 

    //addListener to the element
    if(this.addEventListener)
    {
        this.addEventListener(evName,fn);
    }else if(this.attachEvent)
    {
        this.attachEvent('on'+evName,fn);
    }
    addClass( this );
}




var __a = function() {},
  objectCreate = (function() 
  {
        function Temp() {}

        var hasOwn = Object.prototype.hasOwnProperty;
        return function (O) 
        {
          if(Object.create)
          {
            return Object.create(O);
          }
              if (typeof O != 'object') {
                throw TypeError('Object prototype may only be an Object or null');
              }

              Temp.prototype = O;
              var obj = new Temp();
              Temp.prototype = null; 

              if (arguments.length > 1) 
              {
                var Properties = Object(arguments[1]);
                for (var prop in Properties) {
                  if (hasOwn.call(Properties, prop)) {
                    obj[prop] = Properties[prop];
                  }
                }
              }
              return obj;
        };
  })(),
    BuildVersion = function(name,version)
    {
        var vSplit = version.split('.'),
            matchPhase = {dot:0,major:1,minor:2};

          for(var n in matchPhase)
          {
            if(vSplit[matchPhase[n]])
            {
                matchPhase[n] = parseInt(vSplit[matchPhase[n]]);
            }else
            {
              matchPhase[n] = 0;
            }
          }

        matchPhase['name'] = name;

        return matchPhase;
    };

__a.prototype = 
{
    constructor: __a,
    jModule : $jModule,
    dom : (window.jQuery)?jQuery : element,
    $cookie : $cookie,
    noop : function(){ return noop; },
    $extend : extend,
    $isUndefined : $isUndefined,
    $isDefined : $isDefined,
    $isObject : $isObject,
    $isString : $isString,
    $isNumber : $isNumber,
    $isArray : $isArray,
    $inArray : $inArray,
    $deleteIndex : deleteAndReStructure,
    $isFunction : $isFunction,
    $create : objectCreate,
    $copy : copy,
    $isEmpty : $isEmpty,
    $isEqual : $isEqual,
    $initializer : $eliInitializer,
    $parseJSON : parseJSON,
    $parseXML : parseXML,
    $serialize : serialize,
    $unSerialize : unSerialize,
    $externalLoader : new loadExternalScript,
    $stringToObject : stringToObject,
    $isJsonString : $isJsonString,
    $isNull : $isNull,
    $jDB : jEliDB,
    $jEncrypt : $encrypt,
    version : BuildVersion("Elizabeth", "0.10.0" ),
    bind : binding,
    forEach : domElementProvider.each,
    jObserver : jObserver,
    jEvents:$CustomEventHandler,
    buildTime : Date.now()
};
  
  if($isSupport.sqlite){
    __a.prototype.jSqlite = sqliteStorage;
  }

 window.jEli = new __a();

element(document).ready(function()
{

    $isDomLoaded = true;
      var elementToBootStrap = element('[j-module]');
        if(!$isUndefined( elementToBootStrap) && elementToBootStrap.length)
        {
          var moduleName = [elementToBootStrap.attr('j-module')];
          $eliInitializer( elementToBootStrap , moduleName );
        }
});

/*jEli css styleSheet
Appended to the head of the HTML*/

var jEliStyles = document.createElement('style');
    jEliStyles.setAttribute('type','text/css');
var css = '.j-hide,.j-cloak{display:none} .j-show{display:""} ';
if (jEliStyles.styleSheet)
{
  jEliStyles.styleSheet.cssText = css;
} else 
{
  jEliStyles.appendChild( document.createTextNode(css) );
}
document.getElementsByTagName('head')[0].appendChild( jEliStyles );
