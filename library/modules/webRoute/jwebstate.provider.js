(function()
{

	// jEli route manager
	// created 10-11-15 7:00pm
	// created by Gojecks Joseph

	'use strict';

	jEli
	.jModule('jEli.web.route')
	.jProvider('$jEliWebStateProvider',jEliWebStateProviderFn);


	
	function jEliWebStateProviderFn()
	{
		var $stateCollection = {},
			matchers = ["template","templateUrl","jController","jControllerAs"],
			_unregistered = {};
		//Route Creator
		function createRoute(name)
		{
			var splt = name.split('/').splice(1),
				replacer = "\/(\\w+)",
				param = {},
				inc = 0;
			for(var i in splt)
			{
				if(splt[i].indexOf(':') > -1)
				{
					param[ splt[i].replace(':','') ] = null;
					splt[i] = replacer;
				}else
				{
					if(splt[i] && inc > 0)
					{
						splt[i] = "/"+splt[i];
					}
				}
				//set a tracker to splt Array
				inc++;
			}

			//return the newly generated route Object
			return {
						params : param,
						regexp : new RegExp("^/(?:"+splt.join('')+")$"),
						paramsLength : Object.keys(param).length,
					};
		}

		this.setState = function(name,routeConfig)
		{
			function addViewMatcher(view){
				//add the required target view to the view scope
				var i = matchers.length;
				while(i--){
					if(routeConfig[matchers[i]]){
						if(!routeConfig.views[view]){
							routeConfig.views[view] = {};
						}

						routeConfig.views[view][matchers[i]] = routeConfig[matchers[i]];
						delete routeConfig[matchers[i]];
					}
				}
			}

			//check for abstract route
			routeConfig.route = createRoute(routeConfig.url || '^');

			//get the view names
			//used to track multiple views
			var _views  = Object.keys(routeConfig.views || {});
			routeConfig.name = name;

			if(routeConfig.parent){
				if($stateCollection[routeConfig.parent]){
					var parentRoute = $stateCollection[routeConfig.parent];
					routeConfig.views = routeConfig.views || {}; // create new view
					//copy all views except for
					//targeted view
					for(var view in parentRoute.views){
						if(view !== routeConfig.targetView){
							routeConfig.views[view] = parentRoute.views[view];
						}else{

							if(!routeConfig.views[view]){
								addViewMatcher(view);
							}
						}
					}

					/*
						only match when the routeConfig
						doesn't have the targeted view
						and has views property

						Pardon user errors
					*/
					var targetView = routeConfig.targetView;
					if(targetView && !routeConfig.views[targetView]){
						addViewMatcher(targetView);
					}

					//set resolvers
					if(parentRoute.jResolver){
						routeConfig.jResolver = routeConfig.jResolver || {};
						for(var resolver in parentRoute.jResolver){
							routeConfig.jResolver[resolver] = routeConfig.jResolver[resolver] || parentRoute.jResolver[resolver];
						}
					}

					//overwrite our routeConfig
					routeConfig.route.parent = parentRoute;

					//check if parent views exist in child views
					if(!_views.length && !routeConfig.abstract){
						_views = parentRoute.route.$$views;
					}
					parentRoute.route.$$views.forEach(function(cView){
						if(!jEli.$inArray(_views,cView)){
							_views.push()
						}
					});

					parentRoute = null;
					delete routeConfig.parent;

				}else{
					//push unregistered route to object
					if(!_unregistered[routeConfig.parent]){
						_unregistered[routeConfig.parent] = [];
					}

					//push to the unregistered watchlist
					_unregistered[routeConfig.parent].push(routeConfig.name);
				}

			}

			if(!routeConfig.url){
				routeConfig.abstract = true;
			}

			//set the route
			$stateCollection[name] = routeConfig;

			//set the current route view paths
			routeConfig.route.$$views = _views;

			//check if route is parent that needs to register child
			if(_unregistered[routeConfig.name]){
				var self = this;
				_unregistered[routeConfig.name].forEach(function(uName){
					self.setState(uName,$stateCollection[uName]);
				});

				//remove the registra
				delete _unregistered[routeConfig.name];
			}

			//return the curent state;
			return this;
		};

		this.$get = function()
		{
			return $stateCollection;
		};

	}

})();