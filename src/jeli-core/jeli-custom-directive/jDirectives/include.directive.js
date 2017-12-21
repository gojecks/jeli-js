         /*
                                              @Directive <j-include>
                                              loads the required template and append it to the parent element 
                                              (content of the parent element will be overwritten)
                                            
                                              @Usage 
                                              element <j-include source="/ui-template.html">
                                              attr <any j-include="/ui-template.html">

                                            */
         $defaultDirectiveProvider.push({
             selector: "j-include",
             priority: 7,
             canDetachElement: true,
             isDefault: true
         });

         defaultElementInitializer.prototype['include'] = function() {
             /**
     Resolve the URL
 **/
             var url = (this.checker.indexOf('/') > -1) ? this.checker : maskedEval(this.checker, this.$model),
                 templFac = findInProvider('$templateCache'),
                 $self = this;

             /**
     check for processed Element
     remove element if cannot resolve URL
 **/
             if (!this.isProcessed) {
                 resetIncludeTemplate();
                 this.isProcessed = true;
             }


             if (url) {
                 //check if content is in templateCache
                 //If true render the template
                 if (!$isEqual(url, this.lastProcessed)) {
                     this.elem.innerHTML = "";
                     // get the required template
                     $http.get(url).then(function(data) {
                         if ($isString(data.data)) {
                             var parsedHTML = $sce().trustAsHTML(data.data);
                             templFac.put(url, parsedHTML);
                             $includeBuilder(parsedHTML);
                         }
                     }, resetIncludeTemplate);
                 }
             } else {
                 resetIncludeTemplate();
             }

             function resetIncludeTemplate() {
                 $self.isDetached = true;
                 $self.parentNode.removeChild($self.elem);
             }

             function $includeBuilder(html) {
                 if ($self.isDetached) {
                     //create a new instance of Element
                     $self.elem = $self.$createElement();
                     //insert the element to the parentnode
                     $self.parentNode.insertBefore($self.elem, $self.cENode);
                 }

                 element($self.elem).html(html).data({ ignoreProcess: [$self.cSelector], reCompileChild: !hasAnyAttribute($self.$attr, [':controller', 'j-controller']) });
                 //transverse the new instance of element with the model
                 $templateCompiler($self.elem)($self.$model, $self.ref);

                 $self.detached = false;
             }
             //track  last processed url
             this.lastProcessed = url;
         };