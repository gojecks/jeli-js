

  //register default providers
  _defaultRegistry('j-eli','$jProvideProvider','$controller')(new $controller);

  //register JSON filters
  //return a stringified json object
    _defaultRegistry('j-eli','$jFilterProvider','json')(function(){
        return function(value){
          return JSON.stringify(value);
        }
    });

    //register UPPERCASE filters
  //return a UPPERCASE TEXT
    _defaultRegistry('j-eli','$jFilterProvider','uppercase')(function(){
        return function(value){
          return value.toUpperCase();
        }
    });

  //register LOWERCASE filters
  //return a LOWERCASE TEXT
    _defaultRegistry('j-eli','$jFilterProvider','lowercase')(function(){
        return function(value){
          return value.toLowerCase();
        }
    });

  //register Number filters
  //return a NUMBER
    _defaultRegistry('j-eli','$jFilterProvider','number')(function(){
        return function(value){
          return Number(value);
        }
    });

  function defaultElementBinder(type)
  {
    //arguments
      //type,elem,checker,$model,ref
      var arg = arguments;
      this.binded = function()
      { 
            var self = this,
                arg = new generateArg();
          return function(ref)
          {
            if($isEqual(ref,arg.ref)){
                //initialize the required Function
                (defaultElementInitializer.prototype[type] || function(){}).apply(arg);
            }
          };
      };

       function generateArg()
       {
          //type,elem,checker,$model,ref
          this.type =     arg[0];
          this.elem =     arg[1];
          this.checker =  arg[2];
          this.$model =   arg[3];
          this.ref =      arg[4];
          this.watchListIndex = $directivesProviderWatchList.$get(arg[3].$mId).length;
          //check directive is ['for'] or ['if'] or ['include']


          function prepareModel(){
            var evName = $typeOfModel(this.elem),
                  cVal = $modelSetterGetter(this.checker,this.$model,true),
                  eleVal = $typeOfValue(this.elem),
                  _self = this;
                  this.isProcessed = false;
              bind.call(this.elem,evName,function(ev)
              {
                  setModelValue(_self.checker,_self.$model,$typeOfValue(_self.elem));
                  _self.$model.$consume();
                  //set state
                  _self.isProcessed = true;
              });

              if(!cVal && eleVal)
              {
                  setModelValue(this.checker,this.$model,eleVal);
                  //set state
                  this.isProcessed = true;
              }
              //Check for setting Value
              //onChange Input Types shouldn't change Value
              this.canSetValue = $isEqual('input',evName);
          }

          switch(this.type)
          {
            case("for"):
            case("do"):
            case("include"):
            case("if"):

                 //set the clone node for the object
              var cCase = camelCase.call('j-'+this.type);
              this.cloneNode = this.elem.cloneNode(true);
              this.cNode = toDOM.call('<!--'+cCase+' '+this.checker+'  -->');
              this.cENode = toDOM.call('<!-- end '+cCase+' '+this.checker+'  -->');

              this.parentNode = this.elem.parentNode;
              this.cache = [];

              //replace the element with the commentNode for reference
              this.parentNode.insertBefore( this.cNode, this.elem );
              this.parentNode.insertBefore( this.cENode , this.elem.nextSibling );

              //initialize compiler for the following directives
              //j-for
              //j-include
              //j-do
              if(expect(["for","include","do"]).contains(this.type)){
                this.parentNode.removeChild(this.elem);
                this.isProcessed = false;
                //remove elem
                delete this.elem;
              }else{
                  if(!$logicChecker(this.checker,this.$model)){
                    this.parentNode.removeChild(this.elem);
                    this.isProcessed = false;
                }else{
                  this.isProcessed = true;
                }
              }
            break;
            case("model"):
                prepareModel.call(this);
            break;
            case("controller"):
              initializeController(this.elem)( this.$model, this.checker );
            break;
            case("init"):
              new jEliFnInitializer(this.checker).evaluate(this.$model);
            break;
          }
       }


       
  }

    function defaultElementInitializer(type){}
  //Prototype Binding
  //@Directive <j-value>
    // overwrites the element value with the required binding result.
    /*  
      just like ng-model
      as attr <any j-value="html">

      cannot be used in class list
    */
    defaultElementInitializer.prototype.value = function()
    {
        if(this.elem)
        {
            element(this.elem).val( $modelSetterGetter(this.checker,this.$model) );
        }
    };

    //@Directive <j-html>
    // overwrites the element contents with the required binding result.
    /*  
      works same as the <j-html> directive
      as attr <any j-html="html">

      cannot be used in class list
    */

    defaultElementInitializer.prototype.html = function()
    {
        //compile and set html
        var html = $modelSetterGetter(this.checker,this.$model);
        if(html && !$isEqual(this.lastProcessed,html)){
            element(this.elem).html( html );
        } 

        this.lastProcessed = html;
    };

    //@Directive <j-hide>
    // shows required element if condition is met.
    /*  
    unlike the j-if directive that removes element from DOM
    <j-hide> directive sets the element display to none if condition is met.
      as attr <any j-hide="(1==1 || (model[1] === 1))">

      cannot be used in class list
    */


    defaultElementInitializer.prototype.hide = function()
    {
        var $hide = $logicChecker(this.checker,this.$model);
        element(this.elem)
        .addClass(($hide?'j-hide':'j-show'))
        .removeClass(($hide?'j-show':'j-hide'));  
    };

    //@Directive <j-show>
    // shows required element if condition is met or hide element.
    /*  
      works like j-hide directive
      as attr <any j-show="(1==1 || (model[1] === 1))">

      cannot be used in class list
    */

    defaultElementInitializer.prototype.show = function()
    {
        var $show = $logicChecker(this.checker,this.$model);
        element(this.elem)
        .addClass(($show?'j-show':'j-hide'))
        .removeClass(($show?'j-hide':'j-show'));   
    };

    //@Directive <j-checked>
    // checks required element if condition is met.
    /*  
      as attr <any j-ckecked="(1==1 || (model[1] === 1))">

      cannot be used in class list
    */

    defaultElementInitializer.prototype['checked'] = function()
    {
        var ele = this.elem;
       ( $logicChecker(this.checker,this.$model) )?ele.setAttribute('checked','true') : ele.removeAttribute('checked'); 
    };

    defaultElementInitializer.prototype['selected'] = function()
    {
      this.elem[($logicChecker(this.checker,this.$model))?'setAttribute':'removeAttribute']('selected',true); 
    };


    //@Directive <j-disabled>
    // disables required element if condition is met.
    /*  
      as attr <any j-disabled="(1==1 || (model[1] === 1))">

      cannot be used in class list
    */
    
    defaultElementInitializer.prototype.disabled = function()
    {
        var ele = this.elem;

       ( $logicChecker(this.checker,this.$model) )?ele.setAttribute('disabled','true') : ele.removeAttribute('disabled'); 
    };

    //@Directive <j-style> <j-class>
    // adds a class or style based on logic provided
    /*@Usage 
      allowed type Attirbute and Element
    */
                    
     defaultElementInitializer.prototype.style = defaultElementInitializer.prototype['class'] = function()
     {
        var dis = element(this.elem),
            match = dis.data(this.type).match(/\{(.*?)\}/),
            self = this;
        if( match)
        {
            var cmatch = match[1].split(",");
            domElementProvider.each(cmatch,function(i,n)
            {
                var nMatch = n.split(':'),
                    nClass = nMatch[0],
                    $logic = $logicChecker(nMatch[1],self.$model);

                switch(self.type)
                {
                    case('class'):
                        dis[$logic?'addClass':'removeClass'](removeSingleQuote(nClass));
                    break;
                    case('style'):
                       dis[0].style[nClass] = $logic; 
                    break;
                }

            })
        }
        else{
          var checker = maskedEval(this.checker,this.$model),
              lastAddedClass = this.lastAddedClass;
          if($isEqual(self.type,'class')){
            if(checker){
              dis.removeClass(lastAddedClass);
              dis.addClass(checker);
               if(!lastAddedClass){
                  this.lastAddedClass = checker;
               }
            }else{
              if(lastAddedClass){
                dis.removeClass(lastAddedClass);
              }
            }
          }
        }
      };

    //@Directive <j-if>
    // Compiles the required element based on the logic provided
    //elements are removed from the DOM if condition is not met
    /*@Usage :
      allowed type Attirbute and Element
    */
     
     defaultElementInitializer.prototype['if'] =  function()
     {
        if(!maskedEval(this.checker,this.$model) || !this.checker)
        {    
            if(this.isProcessed)
            {
                element(this.elem).remove();
                this.isProcessed = false; 
            }  
        }
       else
       {
            if(!this.isProcessed)
            {
                this.elem = element(this.cloneNode.cloneNode(true)).data({ignoreProcess : ['if']})[0];
                this.parentNode.insertBefore( $templateCompiler(this.elem)(this.$model) , this.cENode );
                //addClass(this.elem);
                this.isProcessed = true;
            }
       }

     };

     //function to remove cache element
     function removeCacheElement(list)
     {
        var len = list.length;
        while(len--)
        {
          var ele = list[len];
          ele.parentNode.removeChild(ele);
          element(ele).triggerHandler('remove');
        };
     }


    //@Directive <j-for>
    // Compiles the required element based on the item provided
    //elements are removed from the DOM if condition is not met
    /*@Usage :
      allowed type Attirbute and Element
    */
    var $hashKey = 0
     defaultElementInitializer.prototype['for'] = defaultElementInitializer.prototype['do'] = function()
     {

        var conf = this.checker.split(" in "),
            Dexp = /(?:orderBy|where|sortBy):/gi;
        //proceed with the checker
        if(conf.length > 1)
        {
            var expression =  $removeWhiteSpace(conf[1]),
                queryParam = expression.split(Dexp),
                queryCondition = expression.match(Dexp),
                query = queryParam.shift(),
                obj = $modelSetterGetter(query,this.$model) || maskedEval(query),
                tmpl = this.cloneNode,
                par = this.parentNode,
                cache = [],
                $self = this,
                name,
                trackBy = null,
                whileExpr = tmpl.getAttribute('while'),
                $compilerListFn = [],
                setTempScope = function(obj,i)
                {
                    var temp = $self.$model.$new();
                        temp[name] = obj;
                  //set the Object key
                  //trackBy can only be set when its declared in configuration
                    if(trackBy)
                    {
                      temp[trackBy] = !isNaN(Number(i))?Number(i):i;
                    }

                    return temp;
                },
                configureTrackByAndOrderBy = function()
                {
                  var nsplit = $removeWhiteSpace(conf[0]).split(/\W/g);
                      if(nsplit.length > 1)
                      {
                        nsplit.pop();
                        nsplit.shift();
                        trackBy = nsplit.shift();
                      }

                    name = nsplit.pop();

                    //check if queryParam.length > 0
                    if(queryParam.length)
                    {
                      obj = orderByFn();
                    }
                },
                determineLength = function(){
                  return (($isObject(obj))?Object.keys(obj):obj || []).length; 
                },
                elementAppender = function (nModel,type)
                {
                    var nElement = element(tmpl.cloneNode(true)).data({ignoreProcess : [type]})[0];
                        par.insertBefore( nElement , $self.cENode );
                        $templateCompiler( nElement )( nModel ) ;
                        cache.push( nElement );
                        //Observe the element
                        $observeElement(nElement,nModel.$mId);
                },
                orderByFn = function()
                {
                  var condition = queryCondition[0].split(":")[0];
                  switch(condition.toLowerCase())
                  {
                    case('orderby'):
                      return obj[queryParam.pop()]();
                    break;
                    default:
                      return reOrder(condition);
                    break;
                  }
                },
                reOrder = function(condition)
                {
                  return new $query(obj)[condition].apply(null,queryParam.pop().split(","));
                },
                objLength = determineLength();


            if(obj && !$isEqual(this.isProcessed, objLength))
            {
                //initialize configureTrackByAndOrderBy()
                configureTrackByAndOrderBy();
                //remove cache element and free up memory
                //Grabage collection
                removeCacheElement( this.cache );

                 //j-Do Element require while condition to function
                //Make sure all requirement are met
                //else throw an error
                if($isEqual(this.type,'do'))
                {
                  if(!whileExpr){
                    errorBuilder('jDo requires while condition to function');
                  }else
                  {
                    obj = new $query(obj).where(whileExpr);
                  }
                }


                  //render
                  for(var i in obj)
                  {
                    var nModel = setTempScope( obj[i],i );
                    //check if expression has a while
                    elementAppender(nModel,this.type);
                  }


                this.cache = cache;
            }

              this.isProcessed = objLength;
        }
     };

     //@Directive <j-include>
    // loads the required template and append it to the parent element 
    // (content of the parent element will be overwritten)
    /*@Usage 
      element <j-include source="/ui-template.html">
      attr <any j-include="/ui-template.html">

    */

    defaultElementInitializer.prototype['href'] = defaultElementInitializer.prototype['src'] = function()
    {
        if(this.type && this.elem)
        {
          var setter = $logicChecker(this.checker,this.$model);
          if(!$isEqual(setter,this.lastProcessed || this.checker) && setter)
          {
            this.elem.setAttribute(this.type,setter);
            this.lastProcessed = setter;
          }
          
        }
    };

     defaultElementInitializer.prototype['include'] = function()
     {
        var url = (this.checker.indexOf('/') > -1)?this.checker:$modelSetterGetter(this.checker,this.$model),
            templFac = findInProvider('$templateCache'),
            $self = this;
        if(!$isUndefined(url))
        {
            if($isFunction(url)){ url = url(); }

            //check if content is in templateCache
            //If true render the template
            if( !$isEqual(url,this.lastProcessed) )
            {
                $http.get(url).then(function(data)
                {
                   if($isString(data.data))
                   {
                      templFac.put(url,data.data);
                      $includeBuilder(data.data);
                   }
                });
            }
        }

        function $includeBuilder(html)
        {
          //remove previous Element before adding new
            removeCacheElement( $self.cache );
          //create a new instance of Element
          var newEle = toDOM.call($self.cloneNode.outerHTML);
          //insert the element to the parentnode
            $self.parentNode.insertBefore( newEle, $self.cENode );
            element(newEle).html(html);
            //transverse the new instance of element with the model
            transverseTemplate( newEle )($self.$model,$self.ref);
            $self.cache = [newEle];
        }
        //track  last processed url
        this.lastProcessed = url;
     };

     //Model Watcher
     defaultElementInitializer.prototype.model = function(){
          //model was modified
        if(this.canSetValue)
        {
          var val = $modelSetterGetter(this.checker,this.$model),
              eleVal = $typeOfValue(this.elem);
          //set the new value
          if(!$isEqual(val,eleVal)){
              this.elem.value = val || '';
              this.isProcessed = false;
          }
        }
     }; 