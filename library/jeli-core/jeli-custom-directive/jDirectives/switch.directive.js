      /*
    Switch Builder
  */

  function switchBuilder(){
    var _total = this.cloneNode.children.length,
        _children = this.cloneNode.children;
    // set the condition watch
    this.conditions = [];
      while(_total--){
        var _case = hasAnyAttribute(_children[_total],['switch-when',':when']);
          if(_case === 'default'){
            this.$$default = {
              case:_case,
              $index : _total
            };
          }else{
            this.conditions.push({
              case: _case,
              $index: _total
            })
          }
      };
  }     

     defaultElementInitializer.prototype['switch'] = function(){
        var _value = maskedEval(this.checker, this.$model),
        // loop through the elem
          _children = this.cloneNode.children,
          _self = this;
        
        this.$$compiledWith = this.conditions.filter(function(condition){
          return _value == maskedEval(condition.case, _self.$model);
        })[0];

        // if No match found in the case
        // fallback to default if defined
        if(!this.$$compiledWith && this.$$default){
          this.$$compiledWith = this.$$default;
        }

        // only process when the lastProcess !== value
        if(!$isEqual(this.lastProcessed, _value) && this.$$compiledWith){
             //insert the element to the parentnode
          var newEle = _children[this.$$compiledWith.$index].cloneNode(true);
          //empty the elem
          this.elem.innerHTML = "";
          this.elem.appendChild( newEle );
          //transverse the new instance of element with the model
          transverseTemplate( newEle )(this.$model, this.ref);
          this.$$compiledWith = null;
          newEle = null;
        }

        // cleanUp Variables
        _children = null;
        _self = null;

        // set a new watch
        this.lastProcessed = _value;
     };