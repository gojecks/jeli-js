$defaultDirectiveProvider.push({
  selector: "j-controller",
  priority: 1,
  isDefault:true
});  
  //controller compiler
  function initializeController(ele)
  {
    return function($model,isController)
    {
        var useAsChecker = isController.split(' as '),
            ctrlName = useAsChecker[0];
                  
      //add binding class to the object
      //bootStrap Controller
      var jModel = $model.$new(),
          ctrlAs = $provider.$jControllerProvider.$initialize(ctrlName , jModel, null, useAsChecker[1]);

      $0 = ele;
      addClass(ele);
      $templateCompiler(ele)(jModel);
      $observeElement(ele,jModel.$mId);

    }
  }