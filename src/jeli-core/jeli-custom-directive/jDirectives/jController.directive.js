/**
 * jEli Controller initializer
 * Build and compile current ELEMENT
 */
$defaultDirectiveProvider.push({
    selector: "j-controller",
    priority: 6,
    transplace: true,
    isDefault: true
});

/**
 * 
 * @param {*} ele 
 * @param {*} model 
 * @param {*} isController 
 */
function initializeController() {
    var useAsChecker = this.checker.split(' as ');

    //add binding class to the object
    //bootStrap Controller
    var jModel = this.$model.$new(),
        ctrlAs = $provider.$jControllerProvider.$initialize(useAsChecker[0], jModel, null, useAsChecker[1]);
    addClass(this.elem);
    $templateCompiler(this.elem)(jModel);
    $observeElement(this.elem, jModel.$mId);

    jModel = null;
}