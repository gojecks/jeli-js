  //@function $jElementProviderWatchListFn
  //@private function
  function $jElementProviderWatchListFn($id) {
      expect($directivesProviderWatchList.$get($id)).each(function($consumeState) {
          /*
            @annonymous fn
            @Binded from directiveProviderChecker
            @Required argument ref key to parent Container
          */
          $consumeState($id);
      });
  }

  //function get all Attributes of an element
  function getAttributes() {
      var attr = this.attributes,
          ret = [],
          i = 0;
      if (!$isUndefined(attr) && !$isNull(attr)) {
          for (i; i < attr.length; i++) {
              if (!$isUndefined(attr[i].nodeType)) {
                  ret.push({ name: attr[i].nodeName, value: attr[i].nodeValue || attr[i].value });
              }
          }
      }
      return ret;
  }

  /**
   * 
   * @param {*} ele 
   */
  function buildAttributes(ele) {
      var attr = ele.attributes,
          len = attr.length,
          ret = {
              hasAttribute: function(name) { return this.hasOwnProperty(name) },
              getAttribute: function(name) { return this[name]; }
          };

      while (len--) {
          ret[attr[len].nodeName] = attr[len].nodeValue || attr[len].value;
      }

      return ret;
  }

  // hasAnyAttribute
  function hasAnyAttribute(ele, list, force) {
      var found = 0;
      list.forEach(function(attr) {
          if (ele.hasAttribute(attr)) {
              found = ele.getAttribute(attr) || force || true;
          }
      });

      return found;
  }

  //function Attribute Deep Checker
  function $attrDeepChecker(watch) {
      if (!watch) return;

      if (watch.length) {
          expect(watch).each(function(obj) {
              if (obj.attr.length) {
                  expect(obj.attr).each(function(attr) {
                      if (attr.value.match(new RegExp(_defaultTemplateExp))) {
                          obj.element.removeAttribute(attr.name);
                          obj.element.setAttribute(attr.name, $jCompiler(attr.value)(obj.$$));
                      }
                  })
              }
          });

      }
  }

  //check if is child of Parent
  function isChildOfParent(refId) {
      return function(ref) {
          return ref === refId;
      }
  }

  function $watchBlockFn(id) {
      var _watchList = $watchBlockList.$get(id);
      if (_watchList.length > 0) {
          domElementProvider.each(_watchList, function(i, n) {
              //change node value
              this.orig.nodeValue = $jCompiler(this.cNode.nodeValue)($modelMapping.$get(id));
          });
      }
  }

  //@Function $ditryChecker
  //Intializies the Attr-binding
  function $dirtyChecker() {
      var $dirtyList = $attrWatchList.$getAll();
      if ($dirtyList) {
          for (var i in $dirtyList) {
              $attrDeepChecker($dirtyList[i]);
          }
      }
  }

  //noTemplate binding
  function noBinding(ele, model) {

      return function(tmpl, name) {
          if (name) {
              ele.setAttribute(name, $jCompiler(tmpl)(model));
          } else {
              //remove filter from textNode and set a new value
              ele.nodeValue = $jCompiler(ele.nodeValue)(model);
          }
      }
  }

  //Global attrWatcher
  function $attrWatcher(ele) {
      return function($model) {
          var attr = getAttributes.call(ele.cloneNode(true));
          findInList.call(attr, function(idx, obj) {
              var _regTest = new RegExp(_defaultTemplateExp).exec(obj.value);
              if (!$isNull(_regTest)) {
                  //ELi Attribute Watcher
                  if (_regTest[1].charAt(0) === ":") {
                      noBinding(ele, $model)(obj.value, obj.name);
                  } else {
                      addClass(ele);
                      $attrWatchList.$push($model.$mId, { element: ele, attr: [obj], $$: $model });
                  }
              }
          });

          $dirtyChecker();
      }
  }

  //Function DirFound
  //@arg : dir, type
  function dirFound(dir, type) {
      if ($isObject(dir)) {
          return (getDirectiveRestriction(dir).indexOf(type) > -1) ? dir : false
      }

      return false;
  }

  function isLocalName(name, stack) {
      if (name) {
          var dir = dirFound(new $dependencyInjector().get(camelCase.call(name)), 'e');
          if (dir) {
              extendDirectiveObj(dir, camelCase.call(name));
              stack.push(dir)
          }
      }
  }

  function isClass(className, stack) {
      if (className) {
          findInList.call(className.split(' '), function(idx, value) {
              var dir = dirFound(new $dependencyInjector().get(camelCase.call(value)), 'c');
              if (dir) {
                  extendDirectiveObj(dir, value);
                  stack.push(dir);
              }
          });
      }
  }

  function hasAttribute(attr, stack) {
      if (attr.length) {
          findInList.call(attr, function(i, v) {
              if (!$inArray(v.name, ['style', 'id', 'name', 'class', 'title', 'href'])) {
                  var dir = dirFound(new $dependencyInjector().get(camelCase.call(v.name)), 'a');
                  if (dir) {
                      extendDirectiveObj(dir, v.name);
                      stack.push(dir);
                  }
              }
          });
      }
  }

  /**
    directive extender
  **/
  function extendDirectiveObj(dir, name) {
      // set the directive name and priority
      // only when missing
      dir.selector = dir.selector || name;
      dir.priority = dir.priority || 1;
  }

  /**
    getDefaultDirectives
    @return Directives Array

  **/
  function getDefaultDirectives(ele, stack) {
      $defaultDirectiveProvider.forEach(function(obj) {
          var set = obj.selector.split('-')[1],
              isDefaultDirective = hasAnyAttribute(ele, [obj.selector, ':' + set]) || $isEqual(ele.localName, obj.selector);
          if (isDefaultDirective) {
              stack.push(obj);
          }
      });
  }

  /**
    directiveByPriority
    @return Directives by priority
  **/
  function directiveByPriority(obj) {
      return obj.sort(function(a, b) {
          if (a.priority > b.priority) {
              return -1
          } else {
              return 1;
          }
      });
  }

  function $isDirective(ele) {
      var directives = [];
      isLocalName(ele.localName, directives);
      isClass(ele.className, directives);
      hasAttribute(getAttributes.call(ele), directives);
      getDefaultDirectives(ele, directives);

      return directiveByPriority(directives);
  }

  //remove filters from string
  function removeFilters(key) {
      var filter = { filterModel: "", filterExpression: [], filterName: [] },
          i;

      var hasFilter = removeSingleOperand(key, '[|]', '^', 'g').split('^');
      filter.filterModel = $removeWhiteSpace(hasFilter[0]);
      if (hasFilter && hasFilter.length > 1) {
          //check if filter has additional requirement;
          //useful to extend filter value
          //@sample : dateTime filter
          var AllFilters = hasFilter.slice(1);
          for (var i in AllFilters) {
              var hasExpression = AllFilters[i].split(':');
              filter.filterName.push($removeWhiteSpace(hasExpression.shift()));
              if (hasExpression.length > 0) {
                  filter.filterExpression.push(hasExpression.join(':'));
              }
          }
      }

      return filter;
  }

  //get children node of an element
  function getChildrenNode(ele) {
      if ($isObject(ele)) {
          ele = ele[0].parentNode;
      }
      var all = [];
      ele.childNodes.forEach(function(node) {
          all.push(node)
      });

      return all;
  }

  //@Function setTemplateValue
  function setTemplateValue(key, model) {
      //remove the noBinding marker
      if ($isEqual(key.charAt(0), ":")) {
          key = key.replace(':', '');
      }

      var filter = removeFilters(key),
          value = maskedEval(filter.filterModel, model);
      if (filter.filterName.length) {
          for (var i in filter.filterName) {
              //initialize the filters
              value = $provider.$jFilterProvider.parse(filter.filterName[i], model)((value || filter.filterModel), filter.filterExpression[i]);
          }
      }

      return !$isUndefined(value) ? value : '';
  }

  function $evalTemplate(tmpl, model) {
      return (tmpl) && (tmpl).replace(this.pattern, function(i, key) {
          return setTemplateValue(key, model);
      });
  }

  //jEli template expression compiler
  function $jCompiler(template) {
      return function(model, ref) {
          var compiled = $templateParser(!$isUndefined(template.outerHTML) ? template.outerHTML : template, model);
          if (!$isUndefined(template.outerHTML)) {
              template = toDOM.call(compiled);
          } else {
              template = compiled;
          }

          return template;
      }
  }

  /**
   * 
   * @param {*} tmpl 
   * @param {*} model 
   * @param {*} definition 
   */
  function $templateParser(tmpl, model, definition) {
      return $evalTemplate.apply(new _Template(definition), arguments);
  }

  //textNode Watcher and compiler
  function textNodeCompiler(textNode) {
      return function($model, ref) {
          var _regTest = new RegExp(_defaultTemplateExp).exec(textNode.nodeValue);
          if (!$isNull(_regTest)) {
              if (!$isEqual(_regTest[1].charAt(0), ":")) {
                  var valueHasFilter = removeFilters(textNode.nodeValue);
                  $watchBlockList.$push($model.$mId, { cNode: textNode.cloneNode(true), orig: textNode, '$object:ref': ref });
              }

              noBinding(textNode, $model)(textNode.nodeValue);
          }
      }
  }