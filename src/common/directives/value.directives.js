  //Prototype Binding
  //@Directive <j-value>
  // overwrites the element value with the required binding result.
  /*  
    just like ng-model
    as attr <any j-value="html">

    cannot be used in class list
  */
  commonModule
      .directive({
          selector: ':value',
          priority: 10,
          DI: ['ElementRef', 'Observables'],
          props: [{
              name: 'binding',
              value: ':value'
          }]
      }, ValueDirective);

  function ValueDirective(elementRef, Observables) {
      this.binding = '';
      this.didInit = function() {
          Observables
              .observeForKey(this.binding, function(value) {
                  elementRef.nativeElement.value = value || '';
              });
      }
  }