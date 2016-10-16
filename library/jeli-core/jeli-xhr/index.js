/*@Function $httpProvider
@Interceptor : returns promise object*/
function xhr()
{
    if (typeof XMLHttpRequest !== 'undefined' && (!window.ActiveXObject))
    {
      return new XMLHttpRequest();
    } else 
    {
      try {
        return new ActiveXObject('Msxml2.XMLHTTP.6.0');
      } catch (e) {
      }
      try {
        return new ActiveXObject('Msxml2.XMLHTTP.3.0');
      } catch (e) {
      }
      try {
        return new ActiveXObject('Msxml2.XMLHTTP');
      } catch (e) {
      }
    }
    return false;
}


  //@Function Ajax
  function ajax(url, options)
  {
    var request = xhr(),
        promise = new $p,
        response = {},
        interceptor =  $provider.$get('$httpProvider'),
        chain,
        _defaultHeader = ({
        'Accept': 'text/javascript, application/json, text/html, application/xml, text/xml, */*',
        'Content-Type': 'application/x-www-form-urlencoded'
      });

    if(typeof options === 'undefined' && $isObject(url))
    {
      options = url;
    }

    options = options || {};
    options.headers = extend({},_defaultHeader,options.headers);
    options.url = options.url || url;
    options.type = options.type ? options.type.toLowerCase()  : 'get';
    options.asynchronous = options.asynchronous || true;
    options.data = options.data || '';

    if(options.contentType) 
    {
      options.headers['Content-Type'] = options.contentType;
    }



    //$httpProvider Interceptor
    //Request Interceptor
    interceptor.resolveInterceptor('request',{
      headers : options.headers,
      url : options.url,
      type : options.type
    })
    .then(function(_opts){
      options = extend({},options,_opts);
    });

        //Successful Request
    function successfulRequest(request) 
    {
      return (request.status >= 200 && request.status < 300) ||
      request.status == 304 || (request.status == 0 && request.responseText);
    }
    
    function respondToReadyState(readyState)
    {
      var data;
      if (request.readyState == 4)
      {
        var contentType = response.contentType = request.mimeType || request.getResponseHeader('content-type') || '';
        response.status = request.status;
        chain.readyState = request.readyState;
        response.path = options.url;
        if (/json/.test(options.dataType || response.contentType))
        {
          data = JSON.parse(request.responseText);
        } else if (/xml/.test(options.dataType || response.contentType)) 
        {
          data = parseXML(request.responseText);
        } else
        {
            data = request.responseText;
        }

        response.success = successfulRequest(request);
        if (options.callback)
        {
          return options.callback(response, request);
        }

        response.data = data;

        //intercept response
        interceptor
        .resolveInterceptor(((response.success)?'responseSuccess':'responseError'),response);

        //resolve our response
        $ajaxResolver.apply(((response.success)?'success':'error'),[response,request]);
        promise[((response.success)?'resolve':'reject')](response,request);

        //send the response header
        if(options.getResponseHeader){
          options.getResponseHeader.apply(options.getResponseHeader,[getResponseHeaders]);
        }

      }
    }

    //getResponseHeaders
    function getResponseHeaders(name){
      if(!$isObject(name)){
        return request.getResponseHeader(name)
      }else{
        for(var i in name){
          name[i] = request.getResponseHeader(name[i]);
        }

        return name;
      }
    }

    //resolve all binding attached to this call
    //Success and Error Handling
    function $ajaxResolver()
    {
      if(options[this])
      {
        options[this].apply(options[this], arguments);
      }
    }

    //check if header requires withCredentials flag
    if(options.xhrFields && options.xhrFields.withCredentials){
      //set the withCredentials Flag
      request.withCredentials = true;
    }

    function setHeaders()
    {
      for (var name in options.headers) 
      {
        if (unsafeHeaders[name] || /^(Sec-|Proxy-)/.test(name)) {
          throw new Error("Refused to set unsafe header \"" + name + "\"");
        }

        request.setRequestHeader(name, options.headers[name]);
      }
    }


    if (!$isString(options.data)) 
    {
      switch(options.type){
        case("get"):
          options.data = serialize(options.data);
        break;
        default:
          options.data = JSON.stringify(options.data);
        break;
      }
      
    }

    //Set the options data and cache
    if (options.type === 'get')
    {
      if(options.data)
      {
        options.url += ((/\?/).test(options.url) ? '&' : '?') + options.data;
      }

      if (!$isUndefined(options.cache) && !options.cache){
       options.url += ((/\?/).test(options.url) ? '&' : '?') + '_=' + (new Date()).getTime();
      }
    }

    request.onreadystatechange = respondToReadyState;
    request.open(options.type, options.url, options.asynchronous);

    //handle before send
    //function recieves the XMLHTTPREQUEST
    if(options.beforeSend && $isFunction(options.beforeSend))
    {
        options.beforeSend.apply(options.beforeSend,[request]);
    }


    function send()
    {
      try
      {
        var body = $inArray(options.type,['post','put','delete']) ? options.data : null;
        request.send(body);
      } catch (e) 
      {
        if (options.error)
        {
          options.error();
        }
      }
    }

    //set the headers
    setHeaders();

    //send the request
    send();

    chain =
    {
      done: function (fn)
      {
        if (!options.success)
        {
          options.success = fn;
        }

        return chain;
      },
      fail: function (fn)
      {
        if (!options.error)
        {
          options.error = fn;
        }
        return chain;
      },
      end: function (callback) 
      {
        //write callback function
        //only when options.callback is not defined
        if(!options.callback && callback){
          options.callback = callback;
        }
        
        //resend our request
        send();
        return chain;
      },
      then: function () 
      {
        //end request to process binding
        chain.end();
        if (promise) promise.then.apply(promise, arguments);
        return chain;
      }
    };

    return chain;
  }

  /** End of Ajax**/