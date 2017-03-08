  /*
    @Directive <j-for>
    Compiles the required element based on the item provided
    elements are removed from the DOM if condition is not met
    @Usage :
    allowed type Attirbute and Element
   */ 
    var $hashKey = 0
     function jDoForDirective()
     {
        var conf = this.checker.split(" in "),
            Dexp = /(?:orderBy|where|sortBy):/gi;
        //proceed with the checker
        if(conf.length > 1)
        {
            var expression =  conf[1],
                queryParam = expression.split(Dexp),
                queryCondition = expression.match(Dexp),
                query = queryParam.shift(),
                obj = maskedEval(query, this.$model),
                par = this.parentNode,
                cache = [],
                $self = this,
                name,
                trackBy = null,
                whileExpr = $self.cloneNode.getAttribute('while'),
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
                    var nElement = element($self.$createElement()).data({ignoreProcess : [type]})[0];
                        par.insertBefore( nElement , $self.cENode );
                        $templateCompiler( nElement, true)( nModel ) ;
                        cache.push( nElement );
                        //Observe the element
                        $observeElement(nElement, nModel.$mId);
                    nElement = null;
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

                // cleanUp our reference
                function cleanUp(){
                  obj = par = cache = $self = null;
                }

                function finishedRendering(){
                  var _finishRendering = hasAnyAttribute($self.cloneNode, ['on-finish-rendering',':finish-rendering']);
                    // evaluate the _finishedRendering
                    if(_finishRendering){
                      var _trigger = (_finishRendering === '&')?'finishRendering()':_finishRendering;
                      $self.$model.$evaluate(_trigger);
                    }
                  // cleanUp
                  cleanUp();
                }


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
                    elementAppender(nModel, this.type);
                  }


                this.cache = cache;

              // trigger rendering FN
               finishedRendering();
            }

              this.isProcessed = objLength;
        }
     };

    defaultElementInitializer.prototype['for'] = jDoForDirective;
    defaultElementInitializer.prototype['do'] = jDoForDirective;