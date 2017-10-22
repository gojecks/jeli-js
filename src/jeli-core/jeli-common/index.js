  /*** Common Method ***/
  /*** Methods are Private **/

  /*@Function stringToObject
  converts  valid JSON string to an Object
  values of each key can be determined by the replacerObj
  @Param : String str
  @Param : Object replacerObj

  It can only generate one level JSON not multi-dimensional 

  @return Object (new Object)
  */
  function stringToObject(str, replacerObj) {
      var newObj;
      try {
          newObj = maskedEval(str, replacerObj || {});
      } catch (e) {
          var splitedStr = str.match(new RegExp("\\" + str.charAt(0) + "(.*?)" + "\\" + str.charAt(str.length - 1))),
              newObj = ($isEqual("{", str.charAt(0)) ? {} : []),
              j;

          splitedStr = (splitedStr && splitedStr[1] || '').split(',');

          for (j in splitedStr) {
              var xSplitedStr = splitedStr[j].split(':'),
                  name = xSplitedStr.shift(),
                  value = maskedEval(xSplitedStr.join(':'), replacerObj || {}) || xSplitedStr[1];

              //set the value to the key Object
              newObj[name] = value;
          }
      }

      return newObj;
  }


  //watchBinding prototype function
  function watchBinding() {
      this._content = {};
  }

  watchBinding.prototype.$get = function(id, mock) {
      return this._content[id] || mock || [];
  };

  watchBinding.prototype.$new = function(id, value) {
      this._content[id] = value;
  };

  watchBinding.prototype.$remove = function(id) {
      if (this._content[id]) {
          delete this._content[id];
      }
  };

  watchBinding.prototype.hasProp = function(prop) {
      return this._content.hasOwnProperty(prop);
  };

  watchBinding.prototype.$push = function(id, value) {
      if (!this._content[id]) {
          this._content[id] = [];
      }
      //push all object
      this._content[id].push(value);
  };

  watchBinding.prototype.$getAll = function() {
      return this._content;
  };

  // remove from array
  watchBinding.prototype.$removeFromArray = function(id, idx) {
      (this._content[id] || []).splice(1, idx);
  };


  function $isObject(obj) {
      return typeof obj === 'object' && obj instanceof Object && Object.prototype.toString.call(obj) === '[object Object]';
  };

  function $isString(str) {
      return typeof str === 'string' && new String(str) instanceof String;
  }

  function $isJsonString(str) {
      return (str && ("{[".indexOf(str.charAt(0)) > -1) && ("}]".indexOf(str.charAt(str.length - 1)) > -1));
  }

  function $isEmptyObject(obj) {
      return (!$isObject(obj) && !$countObject(obj));
  }

  function $isNumber(n) {
      return Number(n) === n && n % 1 === 0;
  }

  function $isFloat(n) {
      return Number(n) === n && n % 1 !== 0;
  }

  function $isDouble(n) {
      return parseFloat(n) > 0;
  }

  function $isArray(obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
  }

  function $isEmptyObject(obj) {
      return obj && !$countObject(obj).length;
  }

  function $isFunction(fn) {
      return typeof fn === 'function';
  }

  function $countObject(obj) {
      return Object.keys(obj);
  }

  function $isBoolean(bool) {
      return Object.prototype.toString.call(bool) === '[object Boolean]';
  }

  function $isUndefined(val) {
      return typeof val === 'undefined';
  }

  function $isDefined(val) {
      return typeof val !== 'undefined';
  }

  //check for null attribute

  function $isNull(val) {
      return null === val;
  }

  //check for empty value
  function $isEmpty(val) {
      return val === "";
  }

  function $isEqual(a, b) {
      return a === b;
  }

  function $inArray(a, b) {
      return b.indexOf(a) > -1;
  }

  /*
  @Function serialize object to string
  @Argument (OBJECT)
  @return Query Param eg(foo=bar&bar=foo)
*/

  function serialize(obj) {
      if ($isUndefined(obj)) return;

      var param = [],
          buildParams = function(prefix, dn) {
              if ($isArray(dn)) {
                  domElementProvider.each(dn, function(i, n) {
                      if ((/\[\]$/).test(prefix)) {
                          add(prefix, n);
                      } else {
                          buildParams(prefix + "[" + ($isObject(n) ? prefix : "") + "]", n)
                      }
                  });
              } else if ($isObject(dn)) {
                  for (var name in dn) {
                      buildParams(prefix + "[" + name + "]", dn[name]);
                  }
              } else {
                  add(prefix, dn);
              }
          },
          add = function(key, value) {
              value = $isFunction(value) ? value() : ($isEmpty(value) ? "" : value);
              param[param.length] = encodeURIComponent(key) + '=' + encodeURIComponent(value);
          };

      if ($isArray(obj) && $isObject(obj)) {
          domElementProvider.each(obj, function(i, n) {
              add(i, n)
          });
      } else {
          for (var name in obj) {
              buildParams(name, obj[name]);
          }
      }

      return param.join("&").replace(/%20/g, '+');
  }

  //@Function unSerialize
  function unSerialize(par) {
      var ret = {};
      if (!$isUndefined(par)) {
          var pairs = par.split("&"),
              i;
          for (i in pairs) {
              var splitPairs = pairs[i].split('=');
              ret[splitPairs[0]] = splitPairs[1]
          }
      }

      return ret;
  }

  //@Function Make ID
  function makeUID(e) {
      var h = '';
      var f = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      for (var g = 0; g < e; g++) {
          h += f.charAt(Math.floor(Math.random() * f.length))
      }
      return h
  }

  //element ref ID
  function getUID() {
      return 'jeli:' + +new Date + ":" + $eUID++;
  }

  //@Function parseJSON
  function parseJSON(string) {
      if (!$isString(string) || !string) return null;

      string = trim(string);
      return $isSupport.jsonParser ? JSON.parse(JSON.stringify(string)) : (new Function('return ' + string))();
  }

  //@Function xmlParser

  function parseXML(text) {
      if ($isSupport.DOMParser) {
          return new DOMParser().parseFromString(text, 'text/xml');
      } else {
          var xml = new ActiveXObject('Microsoft.XMLDOM');
          xml.async = 'false';
          xml.loadXML(text);
          return xml;
      }
  }

  //@Function extend
  function extend() {
      var extended = {},
          deep = $isBoolean(arguments[0]),
          i = 0,
          length = arguments.length;

      if (deep) {
          i++;
          deep = arguments[0];
      }

      var merger = function(source) {
          for (var name in source) {
              if (source.hasOwnProperty(name)) {
                  if (deep && $isObject(source[name]) && !$isEmptyObject(source[name])) {
                      extended[name] = extend(true, extended[name], source[name]);
                  } else {
                      //set the value
                      extended[name] = source[name];
                  }
              }
          }
      };

      // Loop through each object and conduct a merge
      for (; i < length; i++) {
          merger(arguments[i]);
      }

      return extended;
  }

  //function to buildErrors
  function errorBuilder(str) {
      function userException() {
          this.name = "jEliException";
          this.message = str;
      }

      userException.prototype.toString = function() {
          return this.name + ': "' + this.message + '"';
      };

      throw new userException(str);
  }


  function camelCase() {
      return this.replace(/^([A-Z])|[\s-_](\w)/g, function(match, p1, p2, offset) {
          if (p2) { return p2.toUpperCase(); }
          return p1.toLowerCase();
      });
  }

  //function deleteAndReStructure
  function deleteAndReStructure(arr, index) {
      var temp = [],
          i = 0;
      if ($isArray(arr)) {
          for (; i < arr.length; i++) {
              if (i !== index) {
                  temp.push(arr[i]);
              }
          }
      }

      return temp;
  }

  function findInList(fn) {
      var found = false,
          checker;
      for (var i in this) {
          checker = fn(i, this[i]);
          if (checker) {
              found = checker;
          }
      }

      return found;
  }


  function domElementLoop(loop, callback) {
      var last = loop.length - 1,
          i = 0;
      while (last >= i) {
          var val = callback(loop[i], i);
          if (val === false) {
              break;
          }
          i++;
      }
  }

  function $removeWhiteSpace(str) {
      return (str || '').replace(/\s+/g, '');
  }

  var $isBooleanValue = 'true | false | 1 | 0';

  function removeSingleQuote(str) {

      if ($isBooleanValue.indexOf(str) > -1 || $isUndefined(str)) return str;

      return String(str).replace(/[']/g, "");
  }

  function $remArrayWhiteSpace(arr, fn) {
      var nArr = [];
      if (arr && arr.length) {
          arr.filter(function(item, idx) {
              if (item) {
                  nArr.push((fn) ? fn(item) : $removeWhiteSpace(item));
              }

          });

      }

      return nArr;
  }


  function $sce() {
      // trustAsHTML
      // this prevents any overhead from creating the object each time
      var element = document.createElement('div');

      function htmlEscape(s) {
          return s
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;');
      };

      function decodeHTMLEntities(str) {
          if (str && typeof str === 'string') {
              // strip script/html tags
              str = htmlEscape(str).replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
              str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
              element.innerHTML = str;
              str = element.textContent;
              element.textContent = '';
          }

          return str;
      }


      return {
          trustAsHTML: decodeHTMLEntities,
          escapeHTML: htmlEscape
      };
  }

  //remove last white space in a string
  function $remLastWhiteSpace(str) {
      return ($isEqual(str.slice(str.length - 1), " ")) ? str.slice(0, str.length - 1) : str;
  }

  // removeSingle Operand
  function removeSingleOperand(str, matcher, replacer, flags) {
      return str.replace(new RegExp(matcher, flags), function(s, n, t) {
          if ((t.charAt(n + 1) === s && t.charAt(n - 1) !== s) || (t.charAt(n + 1) !== s && t.charAt(n - 1) === s)) {
              return s;
          } else {
              return replacer;
          }

      });
  }

  // string to hashCode
  function $hashCode(code) {
      var hash = 0,
          i, chr, len;
      if (code.length === 0) return hash;
      for (i = 0, len = code.length; i < len; i++) {
          chr = code.charCodeAt(i);
          hash = ((hash << 5) - hash) + chr;
          hash |= 0; // Convert to 32bit integer
      }

      return hash;
  }

  //@Function trim
  var trim = ''.trim ? function(s) { return s.trim(); } : function(s) {
      return s.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  };