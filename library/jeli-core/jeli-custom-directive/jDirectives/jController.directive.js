  
  //controller compiler
  function initializeController(ele)
  {
    return function($model,isController)
    {
        var useAsChecker = isController.split(' as '),
            ctrlName = useAsChecker[0];
                  
        if( !$inArray(ctrlName,ignoreProcessCheck(ele)) )
        {
          //add binding class to the object
          //bootStrap Controller
          var jModel = $model.$new(),
              ctrlAs = $provider.$jControllerProvider.$initialize(ctrlName , jModel, null, useAsChecker[1]);

          $0 = ele;
          addClass(ele);
          ignoreProcessCheck(ele,isController);
          $templateCompiler(ele)(jModel);
          $observeElement(ele,jModel.$mId);

        }
    }
  }