    //eli app compiler
    function $compileApp() {
        var elementToBootStrap = $compileTracker.lastCompiledWith;
        if ($isEqual(elementToBootStrap.nodeName, 'HTML') || $isEqual(elementToBootStrap.nodeType, document.DOCUMENT_NODE)) {
            elementToBootStrap = document.body;
            $compileTracker.lastCompiledWith = document;
        }

        //reference the elementToBootStrap
        $0 = elementToBootStrap;

        // register the rootElement
        $provider.$get('$jEliServices').$register('$rootElement', elementToBootStrap);

        $templateCompiler(elementToBootStrap)($provider.$jEliServices.$get('$rootModel'));

    }

    //@Objectives : register all Factory,Directives,Filters
    function moduleCompiler(moduleName) {
        var queue = module.$get(moduleName)._jQueue;

        if (queue.length) {
            var len = 0;
            while (len < queue.length) {
                var _list = queue[len++],
                    currentProvider = $provider.$get(_list[0]);

                switch (_list[0]) {
                    case ('$jElementProvider'):
                    case ('jFilterProvider'):
                        //case ('$jFactoryProvider'):
                        var _fn = currentProvider.resolve(moduleName, _list[1][0]);
                        //initialize the fn and re-register the module
                        currentProvider.register(moduleName, _list[1][0], dependencyInjectorMain(_list[0], _fn));
                        _list[1][1] = 'registered';
                        break;
                    case ('$jComponentProvider'):
                        var _component = currentProvider.resolve(moduleName, _list[1][0]);
                        if (_component.controller) {
                            // check for DI
                            if (_component.controllerDI) {
                                _component.controller.$injector = _component.controllerDI.concat();
                            }
                        }
                        break;
                }
            };
        }
    }



    /*
      BootStrapApplication
    */
    var _jInitModuleCompiler = [];

    function $jBootStrapApplication() {
        if (!$isCompiled) {
            //app BootStrap
            domElementProvider.each($compileTracker.compiledModule, function(idx, moduleName) {

                if (module[moduleName]) {
                    $provider.$jConfigProvider.resolve(moduleName);
                    $provider.$get('$httpProvider').register();
                    //compile jFactory,jFilter,jElement
                    moduleCompiler(moduleName);
                    _jInitModuleCompiler.push(moduleName);
                }
            });

            return function() {
                _jInitModuleCompiler.reverse().forEach(function(moduleName) {
                    $provider.$jInitProvider.resolve(moduleName);
                });

                $isCompiled = true;
            };
        }
    }

    //eli initializer and compiler
    function $eliInitializer(elementToBootStrap, moduleToBootStrap) {
        if (elementToBootStrap.length && $isArray(moduleToBootStrap)) {
            var moduleName = moduleToBootStrap[0];
            $compileTracker.lastCompiledWith = elementToBootStrap[0];
            $compileTracker.compiledModule = moduleToBootStrap;
            $compileTracker.injectors.$new('$rootModel', $provider.$get('$jEliServices').$get('$rootModel'));
            $compileTracker.injectors.$new(moduleName, module.$get(moduleName)._jQueue);
            injectRequiredModule(module.$get(moduleName).require);
            $jBootStrapApplication()();
            $compileApp();
            $isAfterBootStrap = true;
        }
    }


    //jEli Queue Builder
    function queueBuilder(providername, injectors) {
        return [providername, injectors];
    }

    //@ Private Function injectRequiredModule
    function injectRequiredModule(required) {
        required.forEach(function(moduleName, idx) {
            $compileTracker.injectors.$new(moduleName, module.$get(moduleName)._jQueue);
            $provider.$jConfigProvider.resolve(moduleName);
            _jInitModuleCompiler.push(moduleName);
            //add the required Module to the bootstraped App
            var req = module.$get(moduleName).require;
            if (req.length) {
                injectRequiredModule(req);
            }
        });
    }