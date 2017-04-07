/**
  jEli DefualtElement Compiler
  jEli Custom Directives  : 
  'j-controller',
  'j-init',
  'j-if',
  'j-href',
  'j-src',
  'j-include',
  'j-for',
  'j-do',
  'j-hide',
  'j-show',
  'j-class',
  'j-style',
  'j-disabled',
  'j-model',
  'j-value',
  'j-html',
  'j-checked',
  'j-selected',
  'j-switch',
  'j-cloak',
  'j-max',
  'j-min'
**/
var $defaultDirectiveProvider = [];

/**

  Function defaultElementBinder
  @Param: ELEMENT, MODEL, REF
  @return defaultElementBinder Instance

**/

function defaultElementBinder(dir, ele, $model, ref)
{

  var set = dir.selector.split('-')[1],
      val = hasAnyAttribute(ele, [dir.selector, ':'+set], "*") || ele.getAttribute('source');

  var binding = elementProcessor( set, val, ele, $model, ref);
  //create a new instance WatchList
  if(binding){
    $directivesProviderWatchList.$push($model.$mId,  binding);
    binding(ref);
  }
}


/**
  @Function elementProcessor
  Initialize the required Directive
  @return Function (binded)
**/
function elementProcessor(type,  checker, ele, $model, ref){
  var ret = null;
    //arguments
    //type,elem,checker,$model,ref
    function binded()
    { 
          var dContext = new generateArg();
        // trigger the watch
        return function(ref)
        {
          if($isEqual(ref, dContext.ref)){
              //initialize the required Function
              trigger(dContext)
          }
        };
    };

    function trigger(arg){
      try{
        (defaultElementInitializer.prototype[type] || noop).apply(arg);
      }catch(e){
        if(typeof e === 'object'){
          throw new Error(e)
        }
      }
      finally{
        if(arg.bindOnce){
          $directivesProviderWatchList.$removeFromArray($model.$mId, arg.watchListIndex);
        }
      }
    }

    /*  
      switch case when
      j-MODEL
      j-CONTROLLER
      j-INIT
    */
    switch(type)
    {
      case("controller"):
        initializeController(ele)( $model, checker );
      break;
      case("init"):
        new jEliFnInitializer(checker).evaluate($model);
      break;
      case("model"):
        ret =  prepareModel.call(new generateArg());
      break;
      default:
        ret = binded();
      break;
    }

   function generateArg()
   {
      //type,elem,checker,$model,ref
      this.type =     type;
      this.elem =     ele;
      this.$model =   $model;
      this.ref =      ref;
      this.checker = checker;
      this.watchListIndex = $directivesProviderWatchList.$get($model.$mId).length;
      this.$attr = buildAttributes(ele);
      /*
        Directive that transcludes
      */

      switch(type)
      {
        case("for"):
        case("do"):
        case("include"):
        case("if"):
        case('switch'):
          //set the clone node for the object
          var cCase = camelCase.call('j-'+type);
          this.cloneNode = ele.cloneNode(true);
          this.cNode = toDOM.call('<!--'+cCase+' '+checker+'  -->');
          this.cENode = toDOM.call('<!-- end '+cCase+' '+checker+'  -->');
          this.cSelector = cCase;

          this.parentNode = ele.parentNode;
          this.cache = [];

          this.$createElement = function(){
            return this.cloneNode.cloneNode(true);
          };

          //replace the element with the commentNode for reference
          if(this.parentNode){
            this.parentNode.insertBefore( this.cNode, ele );
            this.parentNode.insertBefore( this.cENode , ele.nextSibling );
          }
          
           // switchBuilder
          if(type === 'switch'){
            switchBuilder.call(this);
            ele.innerHTML = "";
          }

        break;
      }

      if(hasAnyAttribute(this.$attr, ["j-once",":once"])){
        this.bindOnce = true;
      }
   }

   return ret;
} 

function defaultElementInitializer(type){}
 //function to remove cache element
 function removeCacheElement(list)
 {
    var len = list.length;
    while(len--)
    {
      var ele = list.pop();
      ele.parentNode.removeChild(ele);
      element(ele).triggerHandler('remove');
      ele = null;
    };
 }













