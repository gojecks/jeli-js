Service({
    name: '$jeliWebStateProvider'
})


export function WebStateProvider() {
    var $stateCollection = {},
        $intentCollection = {},
        matchers = ["component"],
        _unregistered = {},
        routeTrial = 0;
    this.isLoaded = false;
    this.intentFallback = null;
    this.fallback = null;
    this.html5Mode = false;
    /**
     * 
     * @param {*} url 
     */
    function createRoute(url) {
        var replacer = "\/(\\w+)",
            paramsMapping = [];
        url = url.replace(/([\/]|)([:]|)+(\w+)/g, function(match) {
            if (match.indexOf(":") > -1) {
                paramsMapping.push(match.split(":")[1]);
                return replacer;
            }
            return match;
        });

        return ({
            params: {},
            paramsMapping: paramsMapping,
            regexp: new RegExp("(?:" + url.split("?")[0] + ")$")
        });
    }

    /**
     * 
     * @param {*} routeConfig 
     * @param {*} requireParent 
     */
    function generateRoute(routeConfig, requireParent) {
        function addViewMatcher(view) {
            //add the required target view to the view scope
            var i = matchers.length;
            while (i--) {
                if (routeConfig[matchers[i]]) {
                    if (!routeConfig.views[view]) {
                        routeConfig.views[view] = {};
                    }

                    routeConfig.views[view][matchers[i]] = routeConfig[matchers[i]];
                    delete routeConfig[matchers[i]];
                }
            }
        }

        /**
         * register the intent
         */
        if (routeConfig.isIntent) {
            $intentCollection[routeConfig.name] = routeConfig;
            return;
        }

        // check for abstract route
        routeConfig.route = createRoute(routeConfig.url || '^');
        // get the view names
        // used to track multiple views
        var _views = Object.keys(routeConfig.views || {});

        /**
         * compile parent
         */
        if (requireParent) {
            var parentRoute = $stateCollection[routeConfig.parent];
            routeConfig.views = routeConfig.views || {}; // create new view
            //copy all views except for
            //targeted view
            for (var view in parentRoute.views) {
                if (view !== routeConfig.targetView) {
                    routeConfig.views[view] = parentRoute.views[view];
                } else {

                    if (!routeConfig.views[view]) {
                        addViewMatcher(view);
                    }
                }
            }

            /*
                 only match when the routeConfig
                 doesn't have the targeted view
                 and has views property
 
                 Pardon usage errors
             */
            if (routeConfig.targetView && !routeConfig.views[routeConfig.targetView]) {
                addViewMatcher(routeConfig.targetView);
            }

            //set resolvers
            if (parentRoute.resolver) {
                routeConfig.resolver = routeConfig.resolver || {};
                for (var resolver in parentRoute.resolver) {
                    routeConfig.resolver[resolver] = routeConfig.resolver[resolver] || parentRoute.resolver[resolver];
                }
            }

            //overwrite our routeConfig
            routeConfig.route.parent = parentRoute;
            //check if parent views exist in child views
            if (!_views.length && !routeConfig.abstract) {
                _views = parentRoute.route.$$views;
            }

            parentRoute = null;
            delete routeConfig.parent;
        }

        if (!routeConfig.url) {
            routeConfig.abstract = true;
        }

        //set the route
        $stateCollection[routeConfig.name] = routeConfig;
        //set the current route view paths
        routeConfig.route.$$views = _views;

        //check if route is parent that needs to register child
        if (_unregistered.hasOwnProperty(routeConfig.name)) {
            var self = this;
            _unregistered[routeConfig.name].forEach(function(uName) {
                setState(uName, $stateCollection[uName]);
            });

            //remove the registra
            delete _unregistered[routeConfig.name];
        }
    }

    /**
     * 
     * @param {*} name 
     * @param {*} routeConfig 
     */
    function setState(name, routeConfig) {
        var requireParent = routeConfig.hasOwnProperty('parent');
        /**
         * current route is binded to a parent
         * check if parent is resolve
         * else move to unregistered holder
         */
        if (requireParent && !$stateCollection.hasOwnProperty(routeConfig.parent)) {
            //push unregistered route to object
            if (!_unregistered.hasOwnProperty(routeConfig.parent)) {
                _unregistered[routeConfig.parent] = [];
            }

            //push to the unregistered watchlist
            _unregistered[routeConfig.parent].push(name);
            $stateCollection[name] = routeConfig;
            return this;
        }

        /**
         * generate the route
         */
        routeConfig.name = name;
        generateRoute(routeConfig, requireParent);

        /**
         * compile children route
         */
        function addChildren(config, parentName) {
            if (config.children) {
                config.children.forEach(function(childConfig) {
                    if (childConfig.name) {
                        childConfig.url = childConfig.url || ['', parentName, childConfig.name].join('/');
                        childConfig.parent = parentName;
                        generateRoute(childConfig, true);
                        addChildren(childConfig, childConfig.name);
                    }
                });
            }
        }

        /**
         * trigger recursive children
         */
        addChildren(routeConfig, name);

        //return the curent state;
        return this;
    }

    /**
     * 
     * @param {*} name 
     * @param {*} routeConfig 
     */
    this.setState = setState;

    //loop through and get route Data
    this.getRequiredRoute = function(routeName) {
        var queryParam = routeName.split("?"),
            foundRoute = (function() {
                for (var prop in $stateCollection) {
                    if (!$stateCollection[prop].abstract && $stateCollection[prop].route.regexp.test(queryParam[0])) {
                        return $stateCollection[prop];
                    }
                }
            })();

        return ({
            get: function() {
                return foundRoute;
            },
            checkParams: function(params) {
                if (foundRoute) {
                    foundRoute.route.params = extend({}, foundRoute.params || {}, params || {});
                    if (foundRoute.route.paramsMapping.length && !params) {
                        foundRoute.route.regexp.exec(queryParam[0]).splice(1)
                            .forEach(function(val, inc) {
                                var isNumber = parseInt(val);
                                foundRoute.route.params[foundRoute.route.paramsMapping[inc]] = !isNaN(isNumber) ? isNumber : val;
                            });
                    }

                    // route contains queryParam
                    if (queryParam[1]) {
                        foundRoute.route.params = extend(
                            foundRoute.route.params,
                            unSerialize(queryParam[1])
                        );
                    }
                }

                return foundRoute;
            }
        });
    }

    this.getAllRoute = function() {
        return $stateCollection;
    };

    this.getRouteObj = function(name) {
        return $stateCollection[name];
    };

    this.getParentRoute = function(name) {
        var parent = $stateCollection[name],
            fnd;
        do {
            if (parent) { fnd = parent; }
        } while (parent = parent.route.parent);

        return fnd;
    };

    this.getIntent = function(intentName) {
        return $intentCollection[intentName];
    };

    /**
     * @param {*} route
     * @param {*} params
     */
    this.getRoute = function(route, params) {
        //Fix for maximum stack
        if (routeTrial > 2) {
            routeTrial = 0;
            return false;
        }
        var webRoutes = this.getRequiredRoute(route).checkParams(params);
        if (webRoutes) {
            return webRoutes;
        }

        //Fallback when the route is not found
        if (this.fallback) {
            location.hash = '#' + this.fallback;
        }
    };
}