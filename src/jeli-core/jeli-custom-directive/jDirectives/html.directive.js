//@Directive <j-html>
// overwrites the element contents with the required binding result.
/*  
  works same as the <j-html> directive
  as attr <any j-html="html">

  cannot be used in class list
*/
$defaultDirectiveProvider.push({
    selector: "j-html",
    priority: 1,
    isDefault: true
});

defaultElementInitializer.prototype.html = function() {
    //compile and set html
    var html = setTemplateValue(this.checker, this.$model),
        newHash = $hashCode(html);
    if (!$isEqual(this.lastProcessed, newHash)) {
        if (hasAnyAttribute(this.$attr, ['trust-html', ':trust-html'])) {
            // create our htmlParse
            this.elem.innerHTML = $sce().trustAsHTML(html);

        } else {
            element(this.elem).html(html);
        }
    }

    this.lastProcessed = newHash;
};