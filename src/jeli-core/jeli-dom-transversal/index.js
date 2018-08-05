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
   * @param {*} model 
   */
  function buildAttributes(ele, model, attachEle) {
      var attr = ele.attributes,
          len = attr.length,
          ret = {
              hasAttribute: function(name) { return this.hasOwnProperty(name) },
              getAttribute: function(name) { return this[name]; }
          };

      while (len--) {
          var node = attr[len].nodeName;
          if (node.indexOf('data-') > -1) {
              node = node.replace('data-', '');
          }

          ret[camelCase.call(node)] = $jCompiler(attr[len].nodeValue || attr[len].value)(model);
      }

      if (attachEle) {
          ret.$$ele = ele;
      }

      return ret;
  }

  // hasAnyAttribute
  /**
   * 
   * @param {*} ele 
   * @param {*} list 
   * @param {*} force 
   */
  function hasAnyAttribute(ele, list, force) {
      var found = 0;
      list.forEach(function(attr) {
          if (ele.hasAttribute(attr)) {
              found = ele.getAttribute(attr) || force || true;
          }
      });

      return found;
  }

  //check if is child of Parent
  function isChildOfParent(refId) {
      return function(ref) {
          return ref === refId;
      }
  }

  /**
   * 
   * @param {*} id 
   */
  function $watchBlockFn(id) {
      var _watchList = $watchBlockList.$get(id),
          _model = $modelMapping.$get(id),
          _isModel = $isObject(_model);
      if (_watchList.length > 0 && _isModel) {
          domElementProvider.each(_watchList, function(i, n) {
              //change node value
              this.orig.nodeValue = $jCompiler(this.cNode.nodeValue)(_model);
          });
      }
  }

  //@Function $ditryChecker
  //Intializies the Attr-binding
  function $digestAttr($id) {
      var $list = $attrWatchList.$get($id);
      if ($list) {
          expect($list).each(iterate);
      }

      function iterate(obj) {
          expect(obj.attr).each(function(attr) {
              obj.element.setAttribute(attr.name, $jCompiler(attr.value)(obj.$$));
          });
      }
  }

  //noTemplate binding
  function noBinding(ele, model, tmpl, name) {
      if (name) {
          ele.setAttribute(name, $jCompiler(tmpl)(model));
      } else {
          //remove filter from textNode and set a new value
          ele.nodeValue = $jCompiler(ele.nodeValue)(model);
      }
  }

  //Global attrWatcher
  function $attrWatcher(ele, $model) {
      expect(getAttributes.call(ele.cloneNode(true))).each(function(obj, idx) {
          var _regTest = new RegExp(_defaultTemplateExp).exec(obj.value);
          if (!$isNull(_regTest)) {
              //ELi Attribute Watcher
              if (_regTest[1].charAt(0) === ":") {
                  noBinding(ele, $model, obj.value, obj.name);
              } else {
                  $attrWatchList.$push($model.$mId, { element: ele, attr: [obj], $$: $model });
              }
          }
      });

      $digestAttr($model.$mId);
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
              isAttributeDeclaration = hasAnyAttribute(ele, [obj.selector, ':' + set]) && dirFound(obj, 'a'),
              isLocaNameDeclaration = $isEqual(ele.localName, obj.selector) && dirFound(obj, 'e');
          if (isLocaNameDeclaration || isAttributeDeclaration) {
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
              value = $provider.$jFilterProvider.parse(filter.filterName[i], model)(($isDefined(value) ? value : filter.filterModel), filter.filterExpression[i]);
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
  function textNodeCompiler(textNode, $model, ref) {
      var _match = textNode.nodeValue.match(_defaultTemplateExp);
      if (_match) {
          var findNoWatch = _match.filter(function(key) {
              return !$isEqual(new RegExp(_defaultTemplateExp).exec(key)[1].charAt(0), ":");
          });

          if (findNoWatch.length) {
              $watchBlockList.$push($model.$mId, { cNode: textNode.cloneNode(true), orig: textNode, '$object:ref': ref });
          }

          noBinding(textNode, $model, textNode.nodeValue);
      }
  }

  /**
   * 
   * @param {*} dirType 
   * @param {*} checker 
   */
  function domElementReplacerFn(dirType, checker) {
      var self = this || {};
      checker = checker || '';
      this.cNode = toDOM.call('<!--' + dirType + ': ' + checker + '-->');
      this.cENode = toDOM.call('<!-- end ' + dirType + ': ' + checker + '-->');
      this.cloneNode = this.elem.cloneNode(true);
      this.parentNode = this.elem.parentNode;
      this.$createElement = function() {
          return this.cloneNode.cloneNode(true);
      };

      this.removeCommentNode = function() {
          this.parentNode.removeChild(this.cENode);
          this.parentNode.removeChild(this.cNode);
      };

      //replace the element with the commentNode for reference
      if (this.elem.parentNode) {
          this.elem.parentNode.insertBefore(this.cNode, this.elem);
          this.elem.parentNode.insertBefore(this.cENode, this.elem.nextSibling);
      }

      /**
       * replace : 'element'
       * remove the element from the DOM
       */
      if ($isEqual(this.transplace, 'element')) {
          this.parentNode.removeChild(this.elem);
          this.elem = this.cNode;
          this.isDetachedElem = true;
      }

      /**
       * replace : "true"
       * empty the current element
       */
      if ($isBoolean(this.transplace) && this.transplace) {
          this.elem.innerHTML = "";
          this.removeCommentNode();
      }

      return function(model, fn) {
          if (!fn && $isFunction(model)) {
              fn = model;
              model = null;
          }
          /**
           * only remove the ELEMENT when isProcessed
           */
          var cloneElement = self.$createElement();
          if (!self.isDetachedElem) {
              cloneElement = cloneElement.innerHTML;
              if (cloneElement.indexOf('<') < 0) {
                  cloneElement = jElementBuilder({
                      element: 'span',
                      text: cloneElement
                  })
              };
          }
          (fn || noop)(element(cloneElement), model);
      }
  }