  //watchBinding prototype function
  function watchBinding() {
      this._content = {};
  }

  /**
   * 
   * @param {*} id 
   * @param {*} mock 
   */
  watchBinding.prototype.$get = function(id, mock) {
      return this._content[id] || mock || [];
  };

  /**
   * 
   * @param {*} id 
   * @param {*} value 
   */
  watchBinding.prototype.$new = function(id, value) {
      this._content[id] = value;
  };

  /**
   * 
   * @param {*} id 
   */
  watchBinding.prototype.$remove = function(id) {
      if (this._content[id]) {
          delete this._content[id];
      }
  };

  /**
   * 
   * @param {*} prop 
   */
  watchBinding.prototype.hasProp = function(prop) {
      return this._content.hasOwnProperty(prop);
  };

  /**
   * 
   * @param {*} id 
   * @param {*} value 
   */
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
  /**
   * 
   * @param {*} id 
   * @param {*} idx 
   */
  watchBinding.prototype.$removeFromArray = function(id, idx) {
      (this._content[id] || []).splice(idx, 1);
  };