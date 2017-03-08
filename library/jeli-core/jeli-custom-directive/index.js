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
  'j-min',
  'j-number'
**/
var $defaultDirectiveProvider = [
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
  'j-maxlength',
  'j-min',
  'j-minlength',
  'j-number'];

function defaultElementBinder(ele, $model, ref)
{
  var defaultCompileElement = element(ele).data({}),
    _self = this;

    // set private property
    this._canRemoveElement = 0;
    this._queue = [];
    //addEli class to the element
    addClass( ele );

    $defaultDirectiveProvider.forEach(function(value)
    {
        var set = value.split('-')[1],
            isDefaultDirective =  hasAnyAttribute(ele, [value, ':'+set])  || $isEqual( ele.localName, value );

        if( isDefaultDirective)
        {
          var
          //get the watch value from the element
          val = hasAnyAttribute(ele, [value, ':'+set]) || ele.getAttribute('source'),
          $ignoreList = defaultCompileElement.data('ignoreProcess');

            if(!$inArray(set,$ignoreList || []))
            {
                //push the ignoreProcess
                ignoreProcessCheck(ele,set);
                var binding = elementProcessor( set, val, ele, $model, ref, _self);
                //create a new instance WatchList
                if(binding){
                  _self._queue.push( binding );
                }
            }                
        }
    });

    if(this._canRemoveElement){
      ele.parentNode.removeChild(ele);
    }

    _self = null;
}

defaultElementBinder.prototype.process = function(CB, ref){
  this._queue.forEach(function(fn){
    CB( fn );
    // trigger the fn
    fn(ref);
  });

  // empty our queue
  this._queue = null;
};


function elementProcessor(type,  checker, ele, $model, ref, _parent){
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
      }catch(e){}
      finally{
        
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
      this.checker =  checker;
      this.$model =   $model;
      this.ref =      ref;
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
          
          _parent._canRemoveElement++;
           // switchBuilder
          if(type === 'switch'){
            switchBuilder.call(this);
            ele.innerHTML = "";
            _parent._canRemoveElement = 0;
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













