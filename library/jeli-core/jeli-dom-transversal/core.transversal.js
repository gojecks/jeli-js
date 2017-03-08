
//function html compiler
//HTML TO DOM function
function toDOM(ignore) 
{
  function type(text)
  {
    if(text.indexOf('tr') > -1 && !ignore)
    {
      return 'tbody';
    }else
    {
      return 'div';
    }
  }

  var i,
  ele = document.createElement(type(this)),
  fragment = document.createDocumentFragment();

  ele.innerHTML = this.toString();
  while (i = ele.firstChild){ fragment.appendChild(i) };

  return (ignore)?fragment.childNodes:fragment.firstChild;
}

//transverse Template Compiler
function transverseCompiler(ele)
{
  var compileAbleElement = (ele.tagName && !$inArray(ele.tagName.toLowerCase(), ["script","link","head","title","j-skip"])),
      isTextNode = $isEqual(ele.nodeType, Node.TEXT_NODE),
      canCompile = compileAbleElement || isTextNode ;

  return function($model,ref,replacerChildren)
  {
    if(!canCompile){
      return;
    }
      //if Element was a ELEMENT_NODE
      //compile the element

      if(compileAbleElement)
      {
        //reference the element Scope
        //if DebugMode is enabled
        if(!findInProvider('jDebugProvider').$disableDebugMode)
        {
          element(ele).data({'jModel':$model.$mId});
        }

        //find directive
        //find controller
        var isDirective = $isDirective(ele);
          compileDefaultDirectiveProvider(ele)($model,ref);
          attachEventProviders(ele)($model,ref);
          if(isDirective.isLocal || isDirective.isClassName || isDirective.isAttribute)
          {
            //change template if recompiler is in use
            if(replacerChildren)
            {
              ele.innerHTML = replacerChildren.innerHTML;
            }

            var nElement = element(ele),
                data = nElement.data('ignoreProcess');
            if(!data)
            {
              nElement.data({ignoreProcess:[]});
            }

            findInList.call(isDirective,function(i,dirList)
            {
              if(dirList)
              {
                findInList.call(dirList,function(idx,dir)
                {
                    if(!dir[1].$isComponent){
                      initializeDirective( dir, nElement , $model );
                    }else{
                      initializeComponent( dir, nElement , $model );
                    }
                });
              }
            });

            // cleanUp
              nElement = null;
              data = null;
          }else
          {
              //attribute checker for all element
              $attrWatcher(ele)($model);
              //proceed with the compilation
              //checking child elements
              var subchildren = getChildrenNode(ele);
              if(subchildren && subchildren.length)
              {
                transverseTemplate(ele)($model,ref,replacerChildren);
              }
          }
      }
      
      else if(!compileAbleElement && isTextNode)
      {
        textNodeCompiler(ele)($model,ref);
      }
  };
}

//@Attach eliFunctionality
//recursive Node checker
function transverseTemplate(template)
{
  var children = getChildrenNode(template),
  lastChild = children.length-1,
  childrenChecker = [];

  return function($model,ref, replacerChildren)
  {
    if(replacerChildren)
    {
      childrenChecker = getChildrenNode( replacerChildren );
    }

    if(children.length && children && isValidElement(template))
    {
      domElementLoop(children , function(ele,i)
      {
          transverseCompiler(ele)($model , ref , childrenChecker[i] );

          var checker = getChildrenNode(template);

          if(i == lastChild )
          {
            //All Element Must be compiled
            if(checker.length-1 > lastChild)
            {
                for(lastChild; lastChild <= checker.length-1; lastChild++)
                {
                   //Recompile elements found in this loop
                  transverseCompiler( checker[lastChild] )($model, ref, childrenChecker[i]);
                }
            }
          }
      });
    }

    // clean up children
    children = null;
    childrenChecker = null;
  };
}


//@Function Unbind
//set Providers WatchList
function compileDefaultDirectiveProvider(ele)
{
  return function($model,ref)
  {
      //create a new instance WatchList
      var binder = new defaultElementBinder( ele, $model, ref );
      binder.process(function(fn){
        $directivesProviderWatchList.$push($model.$mId,  fn);
      }, ref); 

      binder = null;
  };
}

//Template compiler
var compilerStackWatch = new $eventStacks();
function $templateCompiler($template, ignoreWatch)
{
  var ref = getUID();

  //check if $template is a string
  //converts to DOM element
  if($isString($template))
  {
    $template = element($template);
  }

  return function($model)
  {
      if( $isUndefined($template['$object:id']) && isValidElement($template))
      {
        //set the uniques reference key for the element
        $template['$object:id'] = ref;
        //Compile parent before child
        //transverse the template required for rendering
        transverseCompiler($template)( $model , ref );
      }else
      {
        //transverse the children only
        transverseTemplate($template)( $model , ref );
      }

      //watch scope
      $model.$watch(function(){ $atp( ref, $model.$mId ); });
      
      // trigger the template event binder
      compilerStackWatch.broadcast(ref, ['finished.compilations']);
      compilerStackWatch.destroy(ref);

      return $template;
  };
}

  /*
    createElement Method
    Creates a VIRTUAL EELEMENT
    Accepts JSON OBJ and Returns an Element
    eg : {
      "element" : "p",
      "attr" : {
        "class" : "test"
      },
      "children" : [{}], 
      "text" : "I am a Paragraph"
  }

  @return DOM Element
*/
function jElementBuilder(ele,data){
  var element = document.createElement(ele.element);
      data = data || {};
    if(ele.attr){
      for(var prop in ele.attr){
        element.setAttribute(prop,ele.attr[prop]);
      }
    }

  if(ele.text){
    element.innerHTML = ele.text; //$jCompiler(ele.text)(data);
  }

  //add eventListener
  if(ele.eventListener){
    for(var event in ele.eventListener){
      element.setAttribute('data-event-'+event,ele.eventListener[event]);
      $templateCompiler.events.afterLoadevents.push('data-event-'+event);
    }
  }

  if(ele.children){
    for(var child in ele.children){
      element.appendChild(jElementBuilder(ele.children[child],data));
    }
  }

  return element;
}

$templateCompiler.createElement = function(obj,data){
  var ret = [];
  obj.forEach(function(ele){
    ret.push(jElementBuilder(ele,data));
  });
  
  return ret;
};

$templateCompiler.events = {
  afterLoadevents : []
};