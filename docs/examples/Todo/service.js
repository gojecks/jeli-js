(function() {
    "use strict";
    var module = (function() {
        "use strict";
        module.annotations = function() {
            return ({
                directives: [
                    TestResource
                ]
            });
        }

        return module;

        function module() {}
    })();

    console.log(module.annotations());

    var TestResource = (function() {
        "use strict";
        TestResource.annotations = {

        };
        return TestResource;

        function TestResource(elementRef) {
            console.log(elementRef);
        }
    })();
})();