  /**
   * retrieve the Model binded to the current element
   */
  domElementProvider.jModel = function() {
      if (!findInProvider('jDebugProvider').$disableDebugMode) {
          return $modelMapping.$get(this.data('jModel'));
      }

      return undefined;
  };