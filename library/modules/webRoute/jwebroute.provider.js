(function()
{

	// jEli route manager
	// created 10-11-15 7:00pm
	// created by Gojecks Joseph

	// jEliWebProvider

	jEli
	.jModule('jEli.web.route')
	.jProvider('$jEliWebProvider',jEliWebProviderFn);


	function jEliWebProviderFn()
	{
		var webRouteFallBack,
			activityFallback,
			self = this;

		this.fallBack = function(fallback)
		{
			webRouteFallBack = fallback;
		};

		this.activityFallback = function(fallback){
			activityFallback = fallback;
		};

		this.html5Mode = false;

		this.$get = ['$jEliWebStateProvider',function($stateCollection)
		{
			var routeTrial = 0;

			//loop through and get route Data
			function getRequiredRoute(routeName){
				var foundRoute;
				for(var i in  $stateCollection)
				{
					var webRoutes =  $stateCollection[i];
					if(webRoutes.route.regexp.test(routeName) && !webRoutes.abstract)
					{
						foundRoute = webRoutes;
					}
				}

				return ({
					get : function(){
						return foundRoute;
					},
					checkParams : function(){
						if(foundRoute && foundRoute.route.paramsLength)
						{
							var parameters = foundRoute.route.regexp.exec(routeName).splice(1),
							inc = 0;

								for(var j in foundRoute.route.params)
								{
									var pValue = parameters[inc],
										isNumber = parseInt(pValue);
									foundRoute.route.params[j] = !isNaN(isNumber)?isNumber : pValue;
									inc++;
								}
						}

						return foundRoute;
					}
				});
			}


			return {
				getRoute : function(route)
				{ 
					if(routeTrial > 2) //Fix for maximum stack
					{
						routeTrial = 0;
						return false;
					}

					var webRoutes = getRequiredRoute(route).checkParams();

					if(webRoutes){
						return webRoutes;
					}

					//Fallback when the route is not found
					location.hash = '#'+webRouteFallBack;
				},
				getAllRoute : function()
				{
					return  $stateCollection;
				},
				getRouteObj : function(name){
					return $stateCollection[name];
				},
				getParentRoute : function(name){
					return $stateCollection[name];
				},
				getFallBack : function()
				{
					return webRouteFallBack;
				},
				getActivityFallback: function(){
					return activityFallback;
				},
				isLoaded : false,
				getHTML5Mode : function(){
					return self.html5Mode;
				}
			}
		}];

		return this;
	}



})();