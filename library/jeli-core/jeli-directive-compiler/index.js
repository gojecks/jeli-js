  function ignoreProcessCheck(ele,check)
  {
      var elem = element(ele),
          ignore = elem.data('ignoreProcess');

      if(!check)
      {
        return ignore || [];
      }

      if($isUndefined(ignore))
      {
          elem.data({ignoreProcess:[check]})
      }else
      {
        elem.data('ignoreProcess').push( check );
      }
  }



  function organiseFoundElement(list,found)
  {
      if(list.length && list)
      {
          for(var i=0; i < list.length; i++)
          {
              if(list[i].className.indexOf(eliBindedClass) < 0){
                  found.push(list[i]);
              }
          }
      }

      return found;
  }

  //Function directive restriction

  function getDirectiveRestriction(dir)
  {

    return (dir.allowType || 'AE').toLowerCase();
  }


  //Directive Element Matcher
  function findDirective(allowType,name)
  {
      var types = allowType.split(''),
          i,
          ele;

      this.ret = [];

          for(i in types)
          {
             switch(types[i].toLowerCase())
              {
                  case('c'):
                      organiseFoundElement(document.getElementsByClassName('.'+name),this.ret);
                  break;
                  case('e'):
                      organiseFoundElement(document.getElementsByTagName(name),this.ret);
                  break;
                  case('a'):
                      organiseFoundElement(document.querySelectorAll('['+name+']'),this.ret);
                  break;
              } 
          }    
      return this.ret;
  }


  function getParentControllerModel( parentController,module )
  {
      if(!$isUndefined(parentController)) return $controllers[module][parentController].$scope;

      return null;
  }

  //structure require Model 
  //Useful in Directive Compiler

  function structureModel(model,replacerModel)
  {
      return function(attr,attrModel)
      {
          if($isObject(attr) && $isObject(attrModel))
          {
              domElementProvider.each(attrModel,function(name,value)
              {
                  if(value.match(/[&@=]/g))
                  {
                    if($isEqual(value,'='))
                    {
                        model[name] = $modelSetterGetter(attr[name],replacerModel);
                    }else
                    {
                      value = value.split(/[&@=]/g)[1];
                      model[name] = copy( $modelSetterGetter(attr[value],replacerModel) );
                    }
                      
                  }
              });
          }
          return model;
      }
  }

  //compile element scope
  function $compileScope(ele,attr,$model)
  {
      var model,
          myChild = $isMyChild($0)(ele),
          isMe = ($0 === ele),
          isIsolated = $isObject(this.model),
          mID = element(ele).data('$model:id');

      if(!isIsolated)
      {
          if(isMe )
          {
            model = $modelMapping.$get(mID);
          }else
          {
             model = $model;
          }
      }
      else
      {
          model = new $dependencyInjector().get('$rootModel').$new();
          model.$$watchList = [];
          model.$$isIsolated = true;
          addClass(ele,'j-isolated-model');
      }

      //last Element Processed
      $0 = ele;

      return structureModel(model,$model)(attr,this.model);
  }

  //compile element Attribute
  function $compileAttribute()
  {
      var attr = {$$ele : this};
      if(this.attributes)
      {
          findInList.call(getAttributes.call(this),function(name,node)
          {
            if(node.name.indexOf('data-') > -1)
              {
                  node.name = node.name.replace('data-','');
              }

              attr[camelCase.call(node.name)] = node.value;
          });
      }

      return attr;
  }

  function templateAppender(tmpl)
  {
      return function(ele)
      {
        //check if ele is a string or Object
          if($isString(tmpl)){
           ele.innerHTML = tmpl;
          }else{
            ele.append(tmpl);
          }
      }
  }

  //directive template checker
  function directiveTemplateBuilder(obj,ele,attr)
  {
      var defer = new $p(),
          getTemplateValue = function(tempVal){
            return ($isFunction(tempVal))?tempVal.apply(null,[ele,attr]) : tempVal;
          };

        if(obj.template)
        {
          //resolve our template
           templateAppender(getTemplateValue(obj.template))(ele);
           defer.resolve(1); 
        }
        else if(obj.templateUrl)
        {
            var url = getTemplateValue(obj.templateUrl),
                _cache = $provider.$get('$templateCache').get(url);

            //template was stored in templateCache
            if(_cache) 
            {
              templateAppender(_cache)(ele);
              defer.resolve(1);
            }else
            {
              //get resource from server
              $http({url:url,cache:true}).done(function(template)
              {
                  //append the template using template appender
                  templateAppender(template.data)(ele);
                  defer.resolve(1);
              });
            }
        }else
        {
          //element is having children
          defer.resolve(ele.firstChild);
        }

        return defer;
  }

    //jElement compilerFn
    function jElementCompilerFn(){
      this.allowType = 'AE';
      this.replace = false;
      this.model = true;
      //compiler function
      this.$compiler = function(element,attr,init){
          return this.$init;
      };
      //initialize function
      //Only initialized after build
      this.$init = function(ele,attr,model){};

      this.template = "";
      this.templateUrl = "";
    }

  //directives initializer
  //@Private Function initializeDirective
  //@arguments (Object) directive to initializes
  //@argument (String) module name
  //@return function (DOM Element)
  function initializeDirective(obj)
  {
      return function(ele,$model)
      {
        if( !$inArray(obj[0],ele.data('ignoreProcess')))
        {
            var _directive = extend({},new jElementCompilerFn(),obj[1]),
                _linker;
            //set the refID of the directive
              ele[0]['$object:id'] = getUID();

            var attr = $compileAttribute.call(ele[0]);

              //build Directive template
              directiveTemplateBuilder(_directive,ele[0],attr)
              .then(function(canCompile){
                //intialize the compile state
                _linker = _directive.$compiler.apply(_directive,[ele,attr]);
                //Initialize directive
                  var model = $compileScope.call(_directive,ele[0],attr,$model);
                  //bind eli class to element    
                  ele
                  .addClass('j-binded')
                  .data({'$model:id':model.$mId})
                  .data('ignoreProcess').push(obj[0]);
                  //initialize the linker function
                  _linker.apply(_linker,[ele,attr,model]);

                  //element can compile
                  if(canCompile){
                    $templateCompiler(ele[0])(model);
                  }
                  //Add event Watcher to the ele
                  $observeElement(ele,model.$mId);
              });

            }
        }      
  }

  //controller compiler
  function initializeController(ele)
  {
    return function($model,isController)
    {
        var useAsChecker = isController.split(' as '),
            ctrlName = useAsChecker[0];
                  
        if( !$inArray(ctrlName,ignoreProcessCheck(ele)) )
        {
          //add binding class to the object
          //bootStrap Controller
          var jModel = $model.$new(),
              ctrlAs = $provider.$jControllerProvider.$initialize(ctrlName , jModel, null, useAsChecker[1]);

          $0 = ele;
          addClass(ele);
          ignoreProcessCheck(ele,isController);
          $templateCompiler(ele)(jModel);
          $observeElement(ele,jModel.$mId);

        }
    }
  }