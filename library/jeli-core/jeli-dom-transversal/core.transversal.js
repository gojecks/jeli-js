
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

function checkStructuralDirective(dir, restrictA, restrictB){
  if(expect(dir).contains(restrictA) && expect(dir).contains(restrictB)){
    errorBuilder(restrictA +' directive cannot be used with '+restrictB+' directive');
  }
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
        var isDirective = $isDirective(ele),
          _elementDetached = false;
          //compile directive
          if(isDirective.length){
            /**
                check for occurence of DOM structural directive
            **/
            var strDirective = JSON.stringify(isDirective);
            checkStructuralDirective(strDirective, 'j-for', 'j-if');
            checkStructuralDirective(strDirective, 'j-for', 'j-do');
            checkStructuralDirective(strDirective, 'j-min', 'j-minlength');
            checkStructuralDirective(strDirective, 'j-max', 'j-maxlength');


            var nElement = element(ele),
              data = nElement.data('ignoreProcess');
            if(!data)
            {
              nElement.data({ignoreProcess:[]});
            }
            //addEli class to the element
            addClass( ele );

            isDirective.forEach(function(dir){
              var _dirName = camelCase.call( dir.selector );

              if($inArray(_dirName, data || []) || _elementDetached)
              {
                return;
              }

              if(dir.isDefault && !_elementDetached){
                //push the ignoreProcess
                ignoreProcessCheck(ele, _dirName );
                // compile default directives
                defaultElementBinder(dir, ele, $model, ref);
              }else if(!_elementDetached && !dir.isDefault){
                //change template if recompiler is in use
                if(replacerChildren)
                {
                  ele.innerHTML = replacerChildren.innerHTML;
                }

                //push the ignoreProcess
                ignoreProcessCheck(ele, _dirName);
                if(!dir.$isComponent){
                  initializeDirective( dir, nElement , $model );
                }else{
                  initializeComponent( dir, nElement , $model );
                }
              }
                //compile default directive
                if(dir.canDetachElement){
                  _elementDetached = true;
                }
            });
          }

          /**
            Bind Listeners to the Element
          **/
          attachEventProviders(ele)($model,ref);

          // cleanUp
          nElement = null;
          data = null;
         
          
          if(!_elementDetached){
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