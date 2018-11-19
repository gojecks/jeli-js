//function html compiler
//HTML TO DOM function
function toDOM(ignore) {
    function type(text) {
        if (text.indexOf('tr') > -1 && !ignore) {
            return 'tbody';
        } else {
            return 'div';
        }
    }

    var i,
        ele = document.createElement(type(this)),
        fragment = document.createDocumentFragment();

    ele.innerHTML = this.toString();
    while (i = ele.firstChild) { fragment.appendChild(i) };

    return (ignore) ? fragment.childNodes : fragment.firstChild;
}

function checkStructuralDirective(dir, restrictA, restrictB) {
    if (expect(dir).contains(restrictA) && expect(dir).contains(restrictB)) {
        errorBuilder(restrictA + ' directive cannot be used with ' + restrictB + ' directive');
    }
}

//transverse Template Compiler
function transverseCompiler(ele, $model, ref, replacerChildren) {
    var compileAbleElement = (ele.tagName && !$inArray(ele.tagName.toLowerCase(), ["script", "link", "head", "title", "j-skip"])),
        isTextNode = $isEqual(ele.nodeType, Node.TEXT_NODE),
        canCompile = compileAbleElement || isTextNode;

    function proceedWithCompilation() {
        //attribute checker for all element
        $attrWatcher(ele, $model);
        //proceed with the compilation
        //checking child elements
        if (ele.hasChildNodes()) {
            transverseTemplate(ele, $model, ref);
        }
    }

    if (!canCompile) {
        return;
    }
    //if Element was a ELEMENT_NODE
    //compile the element

    if (compileAbleElement) {
        //reference the element Scope
        //if DebugMode is enabled
        var nElement = element(ele),
            //find directive
            //find controller
            isDirective = $isDirective(ele),
            _elementDetached = false;
        //compile directive
        if (isDirective.length) {
            if (!$provider.jDebugProvider.$disableDebugMode) {
                nElement.data({ 'jModel': $model.$mId });
            }
            /**
                check for occurence of DOM structural directive
            **/
            var strDirective = JSON.stringify(isDirective);
            checkStructuralDirective(strDirective, 'j-for', 'j-if');
            checkStructuralDirective(strDirective, 'j-for', 'j-do');
            checkStructuralDirective(strDirective, 'j-min', 'j-minlength');
            checkStructuralDirective(strDirective, 'j-max', 'j-maxlength');

            var data = nElement.data('ignoreProcess');
            if (!data) {
                nElement.data({ ignoreProcess: [] });
            }

            //addEli class to the element
            addClass(ele);
            isDirective.forEach(function(dir) {
                var _dirName = camelCase.call(dir.selector);
                if ($inArray(_dirName, data || []) || _elementDetached) {
                    if (nElement.data('reCompileChild')) {
                        proceedWithCompilation();
                    }
                    return;
                }

                //push the ignoreProcess
                ignoreProcessCheck(ele, _dirName);
                if (dir.isDefault && !_elementDetached) {
                    // compile default directives
                    defaultElementBinder(dir, ele, $model, ref);
                } else if (!_elementDetached && !dir.isDefault) {
                    //change template if recompiler is in use
                    if (replacerChildren) {
                        ele.innerHTML = replacerChildren.innerHTML;
                    }

                    if (!dir.$isComponent) {
                        initializeDirective(dir, nElement, $model);
                    } else {
                        initializeComponent(dir, nElement, $model);
                    }
                }
                //compile default directive
                if (dir.transplace) {
                    _elementDetached = true;
                }
            });
        }



        if (!_elementDetached) {
            /**
             * Bind Listeners to the Element
             **/
            attachEventProviders(ele)($model, ref);
            proceedWithCompilation();
        }

        // cleanUp
        nElement = null;
        data = null;
    } else if (!compileAbleElement && isTextNode) {
        textNodeCompiler(ele, $model, ref);
    }
}

//@Attach eliFunctionality
//recursive Node checker
function transverseTemplate(template, $model, ref) {
    var childrenNode;
    if (!isValidElement(template)) {
        childrenNode = new Array(template.length - 1);
        template.each(function(idx, ele) {
            childrenNode[idx] = ele;
        });
    } else {
        childrenNode = getChildrenNode(template)
    }

    expect(childrenNode).each(function(ele) {
        transverseCompiler(ele, $model, ref)
    });

    childrenNode = null;

    return template;
}


//Template compiler
var compilerStackWatch = new $eventStacks();

function $templateCompiler($template, attachElementObserver) {
    var ref = $template['$object:id'] || getUID(),
        _fn_ = transverseTemplate;
    //check if $template is a string
    //converts to DOM element
    if ($isString($template)) {
        $template = element($template);
    }

    if ($isUndefined($template['$object:id']) && isValidElement($template)) {
        //set the uniques reference key for the element
        $template['$object:id'] = ref;
        //Compile parent before child
        //transverse the template required for rendering
        _fn_ = transverseCompiler;
    }

    return function($model) {
        _fn_($template, $model, ref);
        //add the object to $modelMapping
        $modelMapping.$new($model.$mId, $model);
        //watch scope
        $model.$watch(function() { $atp(this.$mId); });
        if (attachElementObserver) {
            $observeElement($template, $model.$mId)
        }

        // trigger the template event binder
        compilerStackWatch.broadcast(ref, ['finished.compilations']);
        compilerStackWatch.destroy(ref);

        return $template;
    };
}

/*
 * createElement Method
 * Creates a VIRTUAL EELEMENT
 * Accepts JSON OBJ and Returns an Element
 * eg : {
 *   "element" : "p",
 *   "attr" : {
 *       "class" : "test"
 *   },
 *   "children" : [{}], 
 *   "text" : "I am a Paragraph"
 *   }
 * @return DOM Element
 */
function jElementBuilder(ele, data) {
    var element = document.createElement(ele.element);
    data = data || {};
    if (ele.attr) {
        for (var prop in ele.attr) {
            element.setAttribute(prop, ele.attr[prop]);
        }
    }

    if (ele.text) {
        element.innerHTML = ele.text; //$jCompiler(ele.text)(data);
    }

    //add eventListener
    if (ele.eventListener) {
        for (var event in ele.eventListener) {
            element.setAttribute('data-event-' + event, ele.eventListener[event]);
            $templateCompiler.events.afterLoadevents.push('data-event-' + event);
        }
    }

    if (ele.children) {
        for (var child in ele.children) {
            element.appendChild(jElementBuilder(ele.children[child], data));
        }
    }

    return element;
}

/**
 * 
 * @param {*} ele 
 */
function jDOMParser(ele) {
    var _ele = {
        type: 'element',
        isLoaded: document.contains(ele)
    };
    if (ele.nodeType === 1 && !$inArray(ele.tagName.toLowerCase(), ["script", "style", "j-skip"])) {
        _ele.element = ele.tagName;
        _ele.attr = {};
        _ele.children = [];
        _ele.isDirective = $isDirective(ele);
        for (var i = 0; i < ele.attributes.length; i++) {
            var attr = ele.attributes[i];
            _ele.attr[attr.name] = attr.nodeValue;
        }

        for (var i = 0; i < ele.childNodes.length; i++) {
            _ele.children.push(jDOMParser(ele.childNodes[i]));
        }
    } else if (ele.nodeType === 3) {
        _ele.type = "text";
        _ele.value = ele.nodeValue;
    }

    return _ele;
}

$templateCompiler.createElement = function(obj, data) {
    var ret = [];
    obj.forEach(function(ele) {
        ret.push(jElementBuilder(ele, data));
    });

    return ret;
};

$templateCompiler.events = {
    afterLoadevents: []
};