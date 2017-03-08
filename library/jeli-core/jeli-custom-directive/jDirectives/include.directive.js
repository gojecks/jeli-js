         /*
      @Directive <j-include>
      loads the required template and append it to the parent element 
      (content of the parent element will be overwritten)
    
      @Usage 
      element <j-include source="/ui-template.html">
      attr <any j-include="/ui-template.html">

    */

     defaultElementInitializer.prototype['include'] = function()
     {
        var url = (this.checker.indexOf('/') > -1)?this.checker:$modelSetterGetter(this.checker,this.$model),
            templFac = findInProvider('$templateCache'),
            $self = this;
        if(!$isUndefined(url))
        {
            if($isFunction(url)){ url = url(); }

            //check if content is in templateCache
            //If true render the template
            if( !$isEqual(url,this.lastProcessed) )
            {
                $http.get(url).then(function(data)
                {
                   if($isString(data.data))
                   {
                    var parsedHTML = $sce().trustAsHTML(data.data);
                      templFac.put(url, parsedHTML);
                      $includeBuilder( parsedHTML );
                   }
                });
            }
        }

        function $includeBuilder(html)
        {
          //remove previous Element before adding new
            removeCacheElement( $self.cache );
          //create a new instance of Element
          var newEle = $self.$createElement();
          //insert the element to the parentnode
            $self.parentNode.insertBefore( newEle, $self.cENode );
            element(newEle).html(html);
            //transverse the new instance of element with the model
            transverseTemplate( newEle )($self.$model,$self.ref);
            $self.cache = [newEle];
            newEle = null;
        }
        //track  last processed url
        this.lastProcessed = url;
     };