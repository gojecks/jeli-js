//@Directive <j-place>
// include one or more document content into the ELEMENT.
$defaultDirectiveProvider.push({
    selector: "j-place",
    priority: 4,
    isDefault: true,
    allowType: 'AE'
});
defaultElementInitializer.prototype.place = function() {
    /**
     * remove the binding
     */
    this.bindOnce = true;
    var ele = element(this.elem);
    ele.parent().data('$replacerFn')(this.$model, function(clone, model) {
        ele.append(transverseTemplate(clone)(model));
    });
    ele = null;
};