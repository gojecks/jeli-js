  /*
    $template Factory FN
    store template in cache
  */

  // register our Template provider
  $provider.registerProvider('$templateCache',  function $templateFactory()
  {
    var $template = {};
      this.get = function(a)
      {
          return $template[a];
      };

      this.put = function(a,b)
      {
          $template[a] = b;
      };

      this.evaluate = function(a,b)
      {
          return new _Template(a,b).init();
      };
  });

  function  _Template()
  {
      var arg = arguments,
      $self = this;
      this.arg = arg;
      this.callee = function (func) 
      {
          return func($self.arg[1]);
      };

      this.evaluate = function (str)
      {
          return new _Template(str);
      };

      this.extract = function () {};
      this.pattern = _defaultTemplateExp;
      this.init = function (){};
  }

