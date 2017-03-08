  
/*
    Function Name: jConfigProvider
    Instance : Object
    properties:
        - register
        - resolve
*/

  // register config provider
  $provider.registerProvider('$jConfigProvider', function jConfigProvider()
  {
     var _configuration = {};
     this.register = function(module,config)
     {
        if( !_configuration[module] )
        {
          _configuration[module] = [];
        }

        //push to configuration
        _configuration[module].push( config );
     };

     //register configuration
     this.resolve = function(module)
     {
        for(var i in _configuration[module])
        {
          var next = _configuration[module][i];
            if(!next[1])
            {
                next[1] = true;
                q('$jConfigProvider', next[0]);
            }
        }
     };
  });