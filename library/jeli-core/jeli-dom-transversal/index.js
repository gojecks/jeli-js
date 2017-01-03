    //@function $jElementProviderWatchListFn
    //@private function

    function $jElementProviderWatchListFn(ref,$id)
    {
      var len = 0,
          $consumeState = $directivesProviderWatchList.$get($id);
      while(len < $consumeState.length)
      {
            /*@annonymous fn
            @Binded from directiveProviderChecker
            @Required argument ref key to parent Container*/       
            $consumeState[len++](ref);
      };
        
    }

    //function get all Attributes of an element
    function getAttributes()
    {
        var attr = this.attributes,
            ret = [],
            i=0;
        if(!$isUndefined(attr) && !$isNull(attr))
        {
            for(i; i<attr.length; i++)
            {
                if(!$isUndefined(attr[i].nodeType))
                {
                    ret.push({name:attr[i].nodeName,value:attr[i].nodeValue || attr[i].value});
                }
            } 
        }
       return ret;
    }

    //function Attribute Deep Checker
    function $attrDeepChecker(watch)
    {
        if(!watch) return;

        if(watch.length)
        {
          findInList.call(watch,function(idx,obj)
          {
              if(obj.attr.length)
              {
                  for(var i in obj.attr)
                  {
                    if(obj.attr[i].value.match(tplRegEx))
                    {
                      obj.element.removeAttribute( obj.attr[i].name );
                      obj.element.setAttribute( obj.attr[i].name, $jCompiler(obj.attr[i].value)( obj.$$ ) );
                    }
                  }
              }
          });
            
        }

    }

    //check if is child of Parent
    function isChildOfParent(refId)
    {
        return function(ref)
        {
            return ref === refId;
        }
    }



    function $watchBlockFn(ctrl,id)
    {
      var _watchList = $watchBlockList.$get(id);
        if(_watchList.length > 0)
        {
            domElementProvider.each(_watchList,function(i,n)
            {
                //change node value
                this.orig.nodeValue = $jCompiler(this.cNode.nodeValue)($modelMapping.$get(id));
            });
        }
    }


    //@Function $ditryChecker
    //Intializies the Attr-binding
    function $dirtyChecker()
    {
      var $dirtyList = $attrWatchList.$getAll();
        if($dirtyList)
        {
            for(var i in $dirtyList)
            {
                $attrDeepChecker($dirtyList[i]);
            }
        }
    }

    //noTemplate binding
    function noBinding(ele,model){

      return function(tmpl,name){
        if(name){
          ele.setAttribute(name,$jCompiler(tmpl)( model ));
        }else{
          //remove filter from textNode and set a new value
          ele.nodeValue = $jCompiler(ele.nodeValue)(model);
        }
      }
    }

    //Global attrWatcher
    function $attrWatcher(ele)
    {
        return function($model)
        {
           var attr = getAttributes.call(ele.cloneNode(true));
             //ELi Attribute Watcher
              addClass(ele);
           findInList.call(attr,function(idx,obj)
           {
              var _regTest = new RegExp(_defaultTemplateExp).exec(obj.value);
              if(!$isNull(_regTest))
              {
                if(_regTest[1].charAt(0) === ":"){
                  noBinding(ele,$model)(obj.value,obj.name);
                }else{
                   $attrWatchList.$push($model.$mId,{element:ele,attr:[obj],$$:$model});
                }
              }
           });

           $dirtyChecker();      
        }
    }


      //Function DirFound
      //@arg : dir, type

      function dirFound(dir,type)
      {
          if($isObject(dir))
          {
            return ( getDirectiveRestriction(dir).indexOf(type) > -1 )?dir : false
          }

          return false;
      }

      function isLocalName(name)
      {
        if(name)
        {
            var dir = dirFound(new $dependencyInjector().get( camelCase.call(name) ),'e');

          return dir?[[name,dir]] : false;
        }
          return false;
      }

      function isClass(className)
      {
        var isClass = [];

        if(className)
        {
            findInList.call(className.split(' '),function(idx,value)
            {
              var dir = dirFound( new $dependencyInjector().get( camelCase.call(value) ),'c');
                if(dir)
                {
                  isClass.push( dir );
                }
            });
        }

          return isClass.length?isClass : false;
      }


      function hasAttribute(attr)
      {
        var isAttr = [];
        if(attr.length)
        {
            findInList.call(attr,function(i,v)
            {
              if(!$inArray(v.name,['style','id','name','class','title','href']))
              {
                  var dir = dirFound(new $dependencyInjector().get( camelCase.call(v.name) ),'a');
                  if(dir)
                  {
                    isAttr.push([v.name,dir]);
                  }
              }
            });
        }

        return isAttr.length?isAttr : false;
      }

      function $isDirective(ele)
      {
        return {
          isLocal : isLocalName(ele.localName),
          isClassName : isClass(ele.className),
          isAttribute : hasAttribute(getAttributes.call(ele))
        };
      }


      function transverseClone()
      {
        this.transverse = transverseTemplate;
      }


      //transverse Template Compiler
      function transverseCompiler(ele)
      {
        return function($scope,ref,replacerChildren)
        {
            //reference the element Scope
            //if DebugMode is enabled
            if(!findInProvider('jDebugProvider').$disableDebugMode)
            {
              element(ele).data({'jModel':$scope.$mId});
            }
            //if Element was a ELEMENT_NODE
            //compile the element

            if(ele.tagName && !$inArray(ele.tagName.toLowerCase(), ["script","link","head","title"]))
            {
                  //find directive
                  //find controller
                  var isDirective = $isDirective(ele);
                    compileDefaultDirectiveProvider(ele)($scope,ref);
                    attachEventProviders(ele)($scope,ref);
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

                      findInList.call(isDirective,function(i,n)
                      {
                          if(n)
                          {
                            findInList.call(n,function(idx,dir)
                            {
                                initializeDirective( dir )(nElement , $scope );
                            });
                          }
                      });


                    }else
                    {
                        //proceed with the compilation
                        //checking child elements
                        var subchildren = getChildrenNode(ele);
                        if(subchildren && subchildren.length)
                        {
                            transverseTemplate(ele)($scope,ref,replacerChildren);
                        }
                      //attribute checker for all element
                      $attrWatcher(ele)($scope);
                    }
            }
            
            else if(!ele.tagName && $isEqual(ele.nodeType,Node.TEXT_NODE))
            {
              textNodeCompiler(ele)($scope,ref);
            }

        };
      }

      //remove filters from string
  function removeFilters(key)
  {
      var filter = {filterModel:"",filterExpression : [],filterName:[] },
          i;

        var hasFilter = removeSingleQuote(key).split('|');
        filter.filterModel = $removeWhiteSpace(hasFilter[0]);
          if(hasFilter && hasFilter.length > 1)
          {
            //check if filter has additional requirement;
            //useful to extend filter value
            //@sample : dateTime filter
            var AllFilters = hasFilter.slice(1);
            for(var i in AllFilters)
            {
                var hasExpression = AllFilters[i].split(':');
                filter.filterName.push($removeWhiteSpace(hasExpression.shift()));
                if(hasExpression.length > 0)
                {
                  filter.filterExpression.push( hasExpression.join(':') );
                }
            }
          }

      return filter;
  }


  //get children node of an element
  function getChildrenNode(ele)
  {
      if($isObject(ele))
      {
        return  ele[0].parentNode.childNodes;
      }

      return ele.childNodes;
  }

  //@Function setTemplateValue
  function setTemplateValue(key,model)
  {
      //remove the noBinding marker
      key = key.replace(':','');

    var filter = removeFilters(key),
        value = $modelSetterGetter(filter.filterModel,model);

      if(filter.filterName.length)
      {
        for(var i in filter.filterName)
        {
          //initialize the filters
          value = $filtersProviderFn(filter.filterName[i])(filter.filterExpression[i],(value || filter.filterModel),model);
        }
        
      }

      return !$isUndefined(value)?value:'';

  }

  function $evalTemplate(obj,setVar,tmpl)
  {
      return (tmpl)&&(tmpl).replace(this.pattern, function (i, key) 
      {
          return setTemplateValue(key,obj);
      });
  }

  //jEli template expression compiler
  function $jCompiler(template)
  {
      return function(model,ref)
      {
          
          var tmpl = !$isUndefined(template.outerHTML)?template.outerHTML : template,
              _tmpl = new _Template();
              _tmpl.init = $evalTemplate;

          var compiled = _tmpl.init(model,ref,tmpl);

          if(!$isUndefined(template.outerHTML))
          {
              template = toDOM.call(compiled);
          }else{
              template = compiled;
          }

          return template;
      }
  }


  //textNode Watcher and compiler
  function textNodeCompiler(textNode)
  {
      return function($model,ref)
      {
          var _regTest = new RegExp(_defaultTemplateExp).exec(textNode.nodeValue);
          if(!$isNull(_regTest) )
          { 
            if(!$isEqual(_regTest[1].charAt(0),":")){
                var valueHasFilter = removeFilters(textNode.nodeValue),
                    cloneNode = textNode.cloneNode(true);
                $watchBlockList.$push($model.$mId,{ cNode:cloneNode,orig:textNode,'$object:ref':ref});
            }

            noBinding(textNode,$model)(textNode.nodeValue);       
          }
      }
  }

      //@Attach eliFunctionality
      //recursive Node checker
      function transverseTemplate(template)
      {
          return function($scope,ref, replacerChildren)
          {
              var children = getChildrenNode(template),
                  lastChild = children.length-1,
                  childrenChecker = [];

              if(replacerChildren)
              {
                childrenChecker = getChildrenNode( replacerChildren );
              }

              if(children.length && children && isValidElement(template))
              {
                  domElementLoop(children , function(ele,i)
                  {
                      transverseCompiler(ele)($scope , ref , childrenChecker[i] );

                      var checker = getChildrenNode(template);

                      if(i == lastChild )
                      {
                        //All Element Must be compiled
                        if(checker.length-1 > lastChild)
                        {
                            for(lastChild; lastChild <= checker.length-1; lastChild++)
                            {
                               //Recompile elements found in this loop
                              transverseCompiler( checker[lastChild] )($scope,ref,childrenChecker[i]);
                            }
                        }
                      }
                  });
              }

          }
      }

      //@Function Unbind
    //set Providers WatchList
    function compileDefaultDirectiveProvider(ele)
    {
        return function($scope,ref)
        {
            findInList.call($defaultDirectiveProvider,function(name,value)
            {
                var isDefaultDirective =  ele.getAttribute(value) || $isEqual( ele.localName,value ),
                    defaultCompileElement = element(ele).data({});

                if( isDefaultDirective )
                {
                    var set = value.split('-')[1],
                    //get the watch value from the element
                    val = ele.getAttribute( value ) || ele.getAttribute('source');
                    //addEli class to the element
                    addClass( ele );

                    var $ignoreList = defaultCompileElement.data('ignoreProcess');
                      if(!$inArray(set,$ignoreList || []))
                      {
                          //push the ignoreProcess
                          ignoreProcessCheck(ele,set);
                          //create a new instance WatchList

                          $directivesProviderWatchList.$push($scope.$mId, new defaultElementBinder( set, ele, val, $scope, ref ).binded() );
                      }                
                }
            });            
        }
    }

    //Template compiler
    function $templateCompiler($template)
    {
        return function($model,watchModel)
        {
            var ref = getUID();

            //check if $template is a string
            //converts to DOM element
            if($isString($template))
            {
              $template = element($template);
            }

            if( $isUndefined($template['$object:id']) && !$isObject($template))
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

            

            return $template;
        };
    }

            /*
    createElement Method
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
      element.innerHTML = $jCompiler(ele.text)(data);
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