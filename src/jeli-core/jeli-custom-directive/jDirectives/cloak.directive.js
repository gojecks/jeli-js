//@Directive <j-cloak>
// checks required element if condition is met.
/*  
  as attr <any j-checked="(1==1 || (model[1] === 1))">

  cannot be used in class list
*/
$defaultDirectiveProvider.push({
    selector: "j-cloak",
    priority: 100,
    isDefault: true
});

defaultElementInitializer.prototype['cloak'] = function() {
    var self = this;
    compilerStackWatch.subscribe(this.ref, function() {
        // remove the j-cloak class
        element(self.elem).removeClass('j-cloak');
        self.elem.removeAttribute('j-cloak');
        self.elem.removeAttribute(':cloak');
    });

    // bind the j-cloak class to the element
    if (!this.lastProcessed) {
        this.lastProcessed = true;
        element(self.elem).addClass('j-cloak')
    }
};