  //@Directive <j-style> <j-class>
  // adds a class or style based on logic provided
  /*@Usage 
    allowed type Attirbute and Element
  */
                  
   function jCss()
   {
      var dis = element(this.elem),
          match = this.checker.match(/\{(.*?)\}/),
          self = this;
      if( match )
      {
          var cmatch = stringToObject(this.checker, self.$model),
              newHash = $hashCode(JSON.stringify(cmatch));
          // return when !lastProcessed are equal
          if($isEqual(this.lastProcessed, newHash)){
            return; 
          }

          domElementProvider.each(cmatch,function(name,val)
          {
              switch(self.type)
              {
                  case('class'):
                      dis[val?'addClass':'removeClass'](removeSingleQuote(name));
                  break;
                  case('style'):
                     dis[0].style[name] = val; 
                  break;
              }

          });

          this.lastProcessed = newHash;
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

defaultElementInitializer.prototype.style = jCss;
defaultElementInitializer.prototype['class'] = jCss;