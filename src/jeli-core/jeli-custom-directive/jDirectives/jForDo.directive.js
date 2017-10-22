  /*
                                      @Directive <j-for> <j-do>
                                      Compiles the required element based on the item provided
                                      elements are removed from the DOM if condition is not met
                                      @Usage :
                                      allowed type Attirbute and Element
                                     */
  var $hashKey = 0

  function jDoForDirective() {
      var conf = this.checker.split(" in "),
          Dexp = /(?:orderBy|where|sortBy):/gi;
      //proceed with the checker
      if (conf.length > 1) {
          var expression = conf[1],
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
              setTempScope = function(obj, i) {
                  var temp = $self.$model.$new();
                  temp[name] = obj;
                  curHash = $hashKey + ":" + i;
                  $hashKey++;

                  if ($isObject(obj)) {
                      obj['$$obj:id'] = curHash;
                  }
                  //set the Object key
                  //trackBy can only be set when its declared in configuration
                  if (trackBy) {
                      temp[trackBy] = !isNaN(Number(i)) ? Number(i) : i;
                  }

                  return temp;
              },
              configureTrackByAndOrderBy = function() {
                  var nsplit = $removeWhiteSpace(conf[0]).split(/\W/g);
                  if (nsplit.length > 1) {
                      nsplit.pop();
                      nsplit.shift();
                      trackBy = nsplit.shift();
                  }

                  name = nsplit.pop();

                  //check if queryParam.length > 0
                  if (queryParam.length) {
                      obj = orderByFn();
                  }
              },
              determineLength = function() {
                  return (($isObject(obj)) ? Object.keys(obj) : obj || []).length;
              },
              elementAppender = function(nModel, type) {
                  var nElement = element($self.$createElement()).data({ ignoreProcess: [type] })[0];
                  par.insertBefore(nElement, $self.cENode);
                  $templateCompiler(nElement, true)(nModel);
                  /**
                   * store to our cache
                   */
                  cache.push({
                      ele: nElement,
                      $$trackId: curHash,
                      $$index: cache.length
                  });

                  //Observe the element
                  $observeElement(nElement, nModel.$mId);
                  nElement = null;
              },
              orderByFn = function() {
                  var condition = queryCondition[0].split(":")[0];
                  switch (condition.toLowerCase()) {
                      case ('orderby'):
                          return obj[queryParam.pop()]();
                          break;
                      default:
                          return reOrder(condition);
                          break;
                  }
              },
              reOrder = function(condition) {
                  return new $query(obj)[condition].apply(null, queryParam.pop().split(","));
              },
              objLength = determineLength();

          // cleanUp our reference
          function cleanUp() {
              obj = par = cache = $self = null;
          }

          //function to remove cache element
          function removeCacheElement(list) {
              var len = list.length;
              while (len--) {
                  var cacheObj = list[len];
                  if (!checkCacheObj(cacheObj.$$trackId)) {
                      cacheObj.ele.parentNode.removeChild(cacheObj.ele);
                      element(cacheObj.ele).triggerHandler('remove');
                      cacheObj = null;
                  }
              };
          }

          function checkCacheObj(trackId) {
              return Object.keys(obj).filter(function(key) {
                  return $isEqual(trackId, obj[key]['$$obj:id']);
              }).length;
          }

          function finishedRendering() {
              var _finishRendering = hasAnyAttribute($self.cloneNode, ['on-finish-rendering', ':finish-rendering']);
              // evaluate the _finishedRendering
              if (_finishRendering) {
                  var _trigger = (_finishRendering === '&') ? 'finishRendering()' : _finishRendering;
                  $self.$model.$evaluate(_trigger);
              }
              // cleanUp
              cleanUp();
          }

          function checkForNewChanges() {
              return Object.keys(obj).filter(function(key) {
                  if ($isObject(obj[key])) {
                      return !Object.hasOwnProperty.call(obj[key], '$$obj:id');
                  }
                  return false;
              });
          }



          /**
            Check if element have been processed

          **/
          if (!this.isProcessed) {
              this.parentNode.removeChild(this.elem);
              this.isProcessed = true;
              this.cache = [];
              this.elem = null;
          }


          if (obj && (!$isEqual(this.cache.length, objLength) || checkForNewChanges().length)) {

              //initialize configureTrackByAndOrderBy()
              configureTrackByAndOrderBy();

              //j-Do Element require while condition to function
              //Make sure all requirement are met
              //else throw an error
              if ($isEqual(this.type, 'do')) {
                  if (!whileExpr) {
                      errorBuilder('jDo requires while condition to function');
                  } else {
                      obj = new $query(obj).where(whileExpr);
                  }
              }


              //remove cache element and free up memory
              //Grabage collection
              removeCacheElement(this.cache);

              //render
              for (var i in obj) {
                  if (!Object.hasOwnProperty.call(obj[i], '$$obj:id')) {
                      //check if expression has a while
                      elementAppender(setTempScope(obj[i], i), this.cSelector);
                  }
              }


              this.cache = cache;

              // trigger rendering FN
              finishedRendering();
          }
      } else {
          errorBuilder("invalid condition received in " + this.cSelector + ", expecting _item_ in _condition_ or (_idx_, _item_) in _condition_");
      }
  };

  $defaultDirectiveProvider.push({
      selector: "j-for",
      priority: 10,
      canDetachElement: true,
      isDefault: true
  });

  $defaultDirectiveProvider.push({
      selector: "j-do",
      priority: 10,
      canDetachElement: true,
      isDefault: true
  });

  defaultElementInitializer.prototype['for'] = jDoForDirective;
  defaultElementInitializer.prototype['do'] = jDoForDirective;