(function()
{

	// jEli route manager
	// created 10-11-15 7:00pm
	// created by Gojecks Joseph

	jEli
	.jModule('jEli.web.route',[])
	.jProvider('$jviewResolver',jviewResolverFn)
	.jProvider('$jEliWebProvider',jEliWebProviderFn)
	.jProvider('$jEliWebStateProvider',jEliWebStateProviderFn)
	.jFactory('$webState',['$jEliWebStateProvider',$webStateFn])
	.jElement('jView',['$jCompiler','$http','$webState','$jEliWebProvider','$rootModel','$jviewResolver',jViewFn])
	.jElement('go',['$webState',goFn]);


	function jviewResolverFn()
	{

		this.$get = ['$controller',function($controller){
			return ({
				$resolveController : function()
				{
					return $controller;
				}
			});
		}];
	}


	function jEliWebStateProviderFn()
	{
		var $stateCollection = {},
			matchers = ["template","templateUrl","jController"];

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
			routeConfig.route = createRoute(routeConfig.url);
			routeConfig.route.name = name;
			if(routeConfig.parent && $stateCollection[routeConfig.parent]){
				var parentRoute = $stateCollection[routeConfig.parent];
					routeConfig.views = {}; // create new view
					//copy all views except for
					//targeted view
				for(var view in parentRoute.views){
					if(view !== routeConfig.targetView){
						routeConfig.views[view] = parentRoute.views[view];
					}else{
						routeConfig.views[view] = {};
						//add the required target view to the view scope
						var i = matchers.length;
						while(i--){
							if(routeConfig[matchers[i]]){
								routeConfig.views[routeConfig.targetView][matchers[i]] = routeConfig[matchers[i]];
								delete routeConfig[matchers[i]];
							}
						}
					}
				}
				//overwrite our routeConfig
				parentRoute = null;
				routeConfig.route.parent = routeConfig.parent;
				delete routeConfig.parent;
			}

			//set the route
			$stateCollection[name] = routeConfig;

			//return the curent state;
			return this;
		};

		this.$get = function()
		{
			return $stateCollection;
		};
	}

	function jEliWebProviderFn()
	{
		var webRouteFallBack;

		this.fallBack = function(fallback)
		{
			webRouteFallBack = fallback;
		};

		this.$get = ['$jEliWebStateProvider',function($stateCollection)
		{
			var routeTrial = 0;

			//loop through and get route Data
			function getRequiredRoute(routeName){
				var foundRoute;
				for(var i in  $stateCollection)
				{
					var webRoutes =  $stateCollection[i];
					if(webRoutes.route.regexp.test(routeName))
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
					location.replace('#'+this.getFallBack());
				},
				getAllRoute : function()
				{
					return  $stateCollection;
				},
				getParentRoute : function(name){
					return jEli.$extend({},$stateCollection[name] || {});
				},
				getFallBack : function()
				{
					return webRouteFallBack;
				},
				isLoaded : false
			}
		}];

		return this;
	}

	//$location Fn
	function $webStateFn($jEliWebStateProvider)
	{
		var locationStates = null,
			lastState = null;
		//fake path will be overwritten in the directive
		this.go = function(path,params)
		{
			location.hash = this.$href(path,params);
			return this;
		};

	    this.search = function(query)
	    {
	        return window.location.search = query;
	    };

    	//current Location href
    	this.$href = function(stateName,params)
    	{
    		var state = $jEliWebStateProvider[stateName];
			if(state)
			{
				var href = state.url.replace(/\:(\w)+/g,function(index,key)
						{
							var chkr = index.split(":")[1]
							return chkr in params && params[chkr]?params[chkr]:index;
						});

				return href;
			}
    	};

    	this.state = {
    		route : {params : {}}
    	};

    	/*
    		Webstate.replaceWebState
    		replaces the browser history state
    	*/

    	this.replaceWebState = function(hash)
    	{
    		//replace state for jEli webRoute
    		if(!locationStates && !hash){ return; }
    		
    		locationStates = ({
    				state : 'replaceState',
    				hash:'#' + (hash || locationStates.previousHash).replace(/^#/, ''),
    				previousHash : lastState,
    				currentLocation : location.hash 
    			});
    		
    			// Fallback for HTML4 browsers
    			/*@EventName  : locationReplaceState
    			Trigger when replace state is initialized
    			*/
    		jEli.dom(window).triggerHandler('$locationReplaceState');
    		lastState = locationStates.hash;
    	};

    	this.$stateChanged = function(path)
    	{
    		return this.state.url !== path;
    	};

    	/*Webstate.getRootUrl
    		@return {String} url
    	*/

    	this.getRootUrl = function()
    	{
			var rootUrl = document.location.protocol+'//'+(document.location.hostname||document.location.host);
			if ( document.location.port||false ) {
				rootUrl += ':'+document.location.port;
			}
			rootUrl += '/';

			// Return
			return rootUrl;
    	};

    	this.currentState = function(set)
    	{
    		if(!jEli.$isUndefined(set))
    		{
    			locationStates = set;
    			return;
    		}

    		return locationStates;
    	};

    	return this;
	}

	//Directive for mimicking Anchor
	function goFn($webState)
	{
		
		return {
			allowType : 'AE',
			$init : function(ele,attr,model)
			{
				ele.bind('click',function(e)
				{
					var splitWhere = attr.where.split(':'),
						goWhere = splitWhere.shift(),
						param = {};

						//where attr contains a parameter
						if(splitWhere.length)
						{
							//convert the required string to OBJECT
							param = jEli.$stringToObject( splitWhere.join(':') , model);
						}

					// state has changed
					$webState.go( $webState.$href(goWhere , param) );

				});
			}
		}
	}

//j-View Directive Fn
//As an Elemen <j-view ref="default"></j-view>
//as Attribute <element j-view="default"></element>

	function jViewFn($compiler,$http,$webState,jEliWebProvider,$rootModel,ctrlP)
	{
		var eventsHandler = {},
			viewsHolder = {},
			currentView = '',
			locationIsBusy = false,
			isReplaceState = false,
			originalState = location.hash,
			stateChanged = false,
			_jView = null;

		function setViewReference(ele,attr,model)
		{
			viewsHolder[currentView] = ({
				ele : ele,
				attr : attr,
				model : model,
				previousModel : null,
				previousLoaded : false
			});
		}

		//getMainView
		function getView(view)
		{
			return function(name)
			{
				return (name)?viewsHolder[view][name] : viewsHolder[view];
			}
		}

		//set the hash Functionality
		//First checked to see if window supports onhashchange Event
		//@Function window.addEeventListener("haschange",FN,false)
		if("onhashchange" in window)
		{
			if(!jEliWebProvider.isLoaded)
			{
				jEliWebProvider.isLoaded = true;
				jEli.dom(window)
				.bind("hashchange", webRouteChangedFn)
				.on('$locationReplaceState',locationReplaceState);

				//hashChange event doesn't fire on reload
				//work around was to check if location# is not empty
				//set location if its empty
				location.hash = location.hash || jEliWebProvider.getFallBack();

			}
		}

		function locationReplaceState(e)
		{
			var state = $webState.currentState();
			isReplaceState = true;

			if(state.hash !== state.previousHash || stateChanged)
			{
				location.replace(state.hash);
				originalState = state.currentLocation;
				stateChanged = false;
			}
		}


		function webRouteChangedFn(e)
		{
			if(!location.hash.length)
			{
				return false;
			}

			var state = $webState.currentState();
			if(isReplaceState)
			{
				if((originalState !== location.hash) && (location.hash !== state.hash))
				{
					stateChanged = true;
					isReplaceState = false;
					go(refineHash());
				}

				return false;
			}else
			{
				//go to the required hash
				go(refineHash());

			}

		}

		//function refineHash
		function refineHash()
		{
			var hash = getHash();

			if(hash && hash.indexOf('#') > -1)
			{
				return hash.replace('#','');
			}

			return hash;
		}

		function getHash()
		{
			if(isReplaceState)
			{
				return originalState;
			}

			return location.hash;
		}

		//go to path
		function go(path)
		{
			var previousState = jEli.$extend({},$webState.state.route);
			//set up new events
			var route = jEliWebProvider.getRoute(path);
			if( route )
			{
				//initialize state changed 
				stateChanged(path,route);

				var view = getRouteView(),
					viewObjectInstance = getView(currentView)();

				//create an Event
				//Add Default Function to our listener
				//if Slave Function calls preventDefault
				//Master FN is not triggered
				_jView = new jEli.jEvents('addEventListener',function(e){
					if(jEli.$isEqual('$webRouteStart',e.type)){
						if(view.templateUrl)
						{
							$http
							.get(view.templateUrl)
							.done(function(data)
							{
								view.template = data.data;
								compileViewTemplate();
							});
						}
						else if(view.template)
						{
							compileViewTemplate();
						}
					}
				});

				_jView.addEventListener('$webRouteStart',function(e){
					$rootModel.$publish(e.type)(e,route.route,route.data);
				});

				//bind events listener for successfully Route
				_jView.addEventListener('$webRouteSuccess',function(e,args){
					$rootModel.$publish(e.type)(e, route , route.route.params, previousState, (previousState.params || previousState.route.params) );
				});


				_jView.$broadcast('$webRouteStart',[]);
			}

			function compileViewTemplate()
			{
				buildState();
				//dispatch event for webRoute Success
				_jView.$broadcast('$webRouteSuccess', []);
				//destroy the eventListener
				$destroyModel()

				if(view.template)
				{
					var viewInstance = viewObjectInstance.model.$new();
					if(view.jController)
					{
						ctrlP.$resolveController().instantiate( view.jController, viewInstance,view.jResolver,view.jControllerAs);
					}

					//resolve the view instance
					viewObjectInstance.ele.empty().append( view.template ).compile(viewInstance);
					//fire viewContentLoaded Event
					viewInstance.$publish('$viewContentLoaded')(viewObjectInstance.ele);

					//set our reference to current viewInstance
					//used to preform model cleanup
					viewObjectInstance.previousModel = viewInstance;
				}

			}

			function buildState()
			{
				$webState.state = route;
				$webState.state.route.$model = viewObjectInstance.model;
				
				//set the baseUrl to the $webState Object
				//BaseUrl is neccessary when replace state is in use.
				$webState.$$baseUrl = path;
			}

			//destroy the previous Model
			function $destroyModel(){
				var previousModel = getView(currentView)('previousModel');
				if(previousModel){
					//destroy our previous model and its child reference
					previousModel.$$destroy({message:"View changed"});
				}
			}

			//get template
			function getRouteView()
			{
				return (route.views)?route.views[currentView] : route;
			}

			//initialized Fn
			function stateChanged(path,route)
			{
				if($webState.$stateChanged(path))
				{
					if( route.targetView && getView(route.targetView)())
					{
						currentView = route.targetView;
					}

					if(currentView && !route.targetView && !route.views)
					{
						currentView = '';
					}
				}
			}
		};



		return {
			allowType : 'AE',
			$compiler : function(ele,attr)
			{
				return function(ele,attr,model){
					currentView = attr.jView || attr.ref || '';
					//viewSetter for reference
					setViewReference(ele,attr,model);
					//go to route
					go(refineHash());

				}
			}
		};
	}


})({});