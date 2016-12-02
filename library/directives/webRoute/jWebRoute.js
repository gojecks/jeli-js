(function()
{

	// jEli route manager
	// created 10-11-15 7:00pm
	// created by Gojecks Joseph

	'use strict';

	jEli
	.jModule('jEli.web.route',[])
	.jProvider('$jEliWebProvider',jEliWebProviderFn)
	.jProvider('$jEliWebStateProvider',jEliWebStateProviderFn)
	.jFactory('$webState',['$jEliWebProvider',$webStateFn])
	.jFactory('jViewHandler',['$http','$webState','$jEliWebProvider','$rootModel','$controller','$resolve',jViewHandlerFn])
	.jElement('jView',['jViewHandler',jViewFn])
	.jElement('go',['$webState',goFn])
	.init(["$jEliWebProvider","$webState","jViewHandler",initjViewFn]);

	function initjViewFn(jEliWebProvider,$webState,jViewHandler){
		var locationIsBusy = false,
			isReplaceState = false,
			originalState = location.hash,
			stateChanged = false,
			html5Mode = jEliWebProvider.getHTML5Mode();


			//regsister an event
			jViewHandler.events.listener('go',function(ev,path){
				jViewHandler.events.$broadcast('go.state', path || refineHash() );
			});

			//register replaceState event
			jViewHandler.events.listener('replaceState',function(ev){
				isReplaceState = true;
			});

		//set the hash Functionality
		//First checked to see if window supports onhashchange Event
		//@Function window.addEeventListener("haschange",FN,false)
		if("onhashchange" in window)
		{

			//hashChange event doesn't fire on reload
			//work around was to check if location# is not empty
			//set location if its empty
			location.hash = refineHash() || jEliWebProvider.getFallBack();

			jEliWebProvider.isLoaded = true;
			jEli.dom(window)
			.bind("hashchange", webRouteChangedFn)
			.on('$locationReplaceState',locationReplaceState);

			/*
				Triggered When user reloads the page
			*/
			if(originalState){
				jViewHandler.events.$broadcast('go');
			}

		}

		//set the PopState Functionality
		//First checked to see if window supports onPopChange Event
		//@Function window.addEeventListener("popState",FN,false)

		if("onpopstate" in window){
			if(html5Mode){
				window.onpopstate = popStateFn;
			}
		}


		//popStateFN
		function popStateFn(e){
			
		}

		function locationReplaceState(e)
		{
			var state = $webState.currentState();
				isReplaceState = true;

			if(state.hash !== state.previousHash || stateChanged)
			{
				location.replace(state.hash);
				originalState = state.currentLocation;
			}
		}


		function webRouteChangedFn(e)
		{
			if(!location.hash.length || !$webState.$stateChanged(refineHash()) || isReplaceState)
			{
				isReplaceState = false;
				return false;
			}
				//go to the required hash
				jViewHandler.events.$broadcast('go');

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
	}


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

	function jEliWebProviderFn()
	{
		var webRouteFallBack,
			self = this;

		this.fallBack = function(fallback)
		{
			webRouteFallBack = fallback;
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
				isLoaded : false,
				getHTML5Mode : function(){
					return self.html5Mode;
				}
			}
		}];

		return this;
	}

	//$location Fn
	function $webStateFn($jEliWebProvider)
	{
		var locationStates = null,
			lastState = null;

	    this.search = function(query)
	    {
	        return window.location.search = query;
	    };

    	/* 
			Method Name : href
			Parameter : stateName (STRING) , Params (OBJECT)
			@returns : Path || Fallback
		*/
    	this.$href = function(stateName,params)
    	{
    		var state = $jEliWebProvider.getRouteObj(stateName);
			if(state)
			{
				var href = state.url.replace(/\:(\w)+/g,function(index,key)
						{
							var chkr = index.split(":")[1]
							return chkr in params && params[chkr]?params[chkr]:index;
						});

				return href;
			}

			return $jEliWebProvider.getFallBack();
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
    			/*@
	    			EventName  : locationReplaceState
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
	};

	/*

	*/
	function jViewHandlerFn($http,$webState,jEliWebProvider,$rootModel,ctrlP,$resolve){
		var viewsHolder = {},
			currentView = '@',
			previousView = '@',
			_jView = null,
			stateInProgress,
			stateQueue = [],
			currentPath = "",
			$stateTransitioned = false,
			currentState = "",
			previousState = "",
			self = this,
			_pendingViewStack = {};

		this.setViewReference = function(ele,attr,model){
			viewsHolder[attr.ref] = ({
				ele : ele,
				attr : attr,
				model : model,
				previousModel : null,
				previousLoaded : false,
				name : attr.ref
			});

			return this;
		};


		/* 
			Method Name : GO
			Parameter : stateName (STRING) , Params (OBJECT)
			@returns : self
		*/

		$webState.go = function(path,params)
		{
			var state = this.$href(path,params);
			self.events.$broadcast('state.changed',state);
			return this;
		};


		//trigger
		this.events = new jEli.jEvents('listener');
		//add an event
		this.events.listener('go.state',function(ev,path){
			//check if state in Progress
			if(!path){
				return false;
			}
				//set the current State
				previousState = currentState;
				currentState = path;

			if(stateInProgress ){
				stateQueue.push(path);
				$stateTransitioned = !jEli.$isEqual(currentState,previousState);
				return false;
			}else{
				//set stateInProgress to true
				stateInProgress = true;
				go(path);
			}
		});

		//check for pending view rendering
		this.events.listener('view.render',function(ev,viewName){
			if(_pendingViewStack[viewName]){
				compileViewTemplate(_pendingViewStack[viewName],viewsHolder[viewName]);
			}
		});

		//state changed event handler
		this.events.listener('state.changed',function(ev,state){
			self.events.$broadcast('go.state',state);
			self.events.$broadcast('replaceState');
			location.hash = state;
		});

		//getMainView
		function getView(view)
		{
			return function(name)
			{
				return ((name)?viewsHolder[view][name] : viewsHolder[view]);
			}
		}

		/*
			get the template View
			Load through http when template is not defined
		*/
		function loadViewTemplate(view,viewName,callback){

			if(jEli.$isDefined(view)){
				if(view.templateUrl)
				{
					$http
					.get(view.templateUrl)
					.done(function(data)
					{
						view.template = data.data;
						callback(viewName,view);
					});
				}
				else if(view.template)
				{
					callback(viewName,view);
				}
			}
		}

		/*
			compile the template when loaded
		*/

		function compileViewTemplate(view,viewObjectInstance)
		{
			var	viewInstance = viewObjectInstance.model.$new(),
				ctrl = view.jController || function(){};

			$webState.state.route.$model = viewObjectInstance.model;
			if(view.template)
			{
				var parent = $webState.state.route.parent;
				if((parent && parent.views[viewObjectInstance.name])){
					parent.route.$model = viewInstance;
				}
				//destroy the eventListener
					var previousModel = viewObjectInstance.previousModel;
					if(previousModel){
						//destroy our previous model and its child reference
						previousModel.$$destroy({message:"View changed"});
					}

				if(view.jController){
					ctrlP
					.instantiate(ctrl, viewInstance,null,view.jControllerAs,$webState.state.route.resolvedData);
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


			/* 
				Method Name : resolveNextStateQueue
				Resolve the paths that were pushed to queue
			*/
		this.resolveNextStateQueue =function(){
			//set Resolver State to false
			stateInProgress = false;
			if(stateQueue.length){
				//go to the state
				var nextState = stateQueue.shift();
				nextState && this.events.$broadcast('go.state',nextState);
			}
		};

		/*
			remove Views from holder
		*/

		function removeViews(views){
			if(views.length){
				for(var view in viewsHolder){
					if(!jEli.$inArray(view,views)){
						//remove the view
						delete viewsHolder[view];
					}
				}
			}
		}

		/*
			trigger the resolved route views
		*/
		this.resolveViews = function(route){
			var _views = [];
			if(route.route.parent && !route.route.parent.resolved){
				route.route.parent.resolved = true;
				_views = Object.keys(route.views).concat();
			}else{
				if(route.targetView){
					//concat the target view
					if(!viewsHolder[route.targetView]){
						//concat the views
						_views = _views.concat(route.route.$$views);
						removeViews(_views);
					}else{
						_views = _views.concat(route.targetView);
					}
				}else{
					//concat the views
					_views = _views.concat(route.route.$$views);
					removeViews(_views);
				}
			}

			return function(){
				var inc = 0;
				//loop through the required views
				do{
					currentView = _views[inc];
					inc++;

				var view = (route.views)?route.views[currentView] : route;
					//Load View Template
					loadViewTemplate( view, currentView , function(vName,_view){
						var viewObjectInstance = getView(vName)();
						if(viewObjectInstance){
							compileViewTemplate(_view, viewObjectInstance);
						}else{
							//Push pending view to stack
							_pendingViewStack[vName] = _view;
						}
					});

				//trigger the success
				if(inc === _views.length - 1){
					//dispatch event for webRoute Success
					_jView.$broadcast('$webRouteSuccess', []);
				}

				}while(_views.length > inc);
			};
		};


		//go to path
		function go(path)
		{
			//set up new events
			var route = jEliWebProvider.getRoute(path);
			if( route)
			{
				//set the state
				$webState.state = route;
				//initialize state changed 
				var previousState = jEli.$extend({},$webState.state.route);
				//set the current view
				//get the RouteView Object
				var locals = {};

				//create an Event
				//Add Default Function to our listener
				//if Slave Function calls preventDefault
				//Master FN is not triggered
				_jView = new jEli.jEvents('addEventListener',function(e){
					if(jEli.$isEqual('$webRouteStart',e.type))
					{
						/*
						 resolve the resolvers if defined
						*/
						if(route.jResolver){
							$resolve
							.instantiate(route.jResolver,locals)
							.then(function(){
								//check for page Transition
								//useful when user state is been resolved and resolver changes the route
								if($stateTransitioned){
									$stateTransitioned = false;
									self.resolveNextStateQueue();
									return;
								}

								/*
									check if view is defined
								*/
								self.resolveViews(route)();

								//set the baseUrl to the $webState Object
								//BaseUrl is neccessary when replace state is in use.
								$webState.$$baseUrl = path;

								self.resolveNextStateQueue();

								//set relovers
								route.resolvedData = locals;
							});
						}else{
							self.resolveViews(route)();
						}
					}
				});

				_jView.addEventListener('$webRouteStart',function(e){
					$rootModel.$publish(e.type)(e,resolveRoute(),route.route.params);
				});

				//bind events listener for successfully Route
				_jView.addEventListener('$webRouteSuccess',function(e,args){
					$rootModel.$publish(e.type)(e, route , route.route.params, previousState, (previousState.params || previousState.route.params) );
				});

				_jView.$broadcast('$webRouteStart',[]);

			}else{

				stateInProgress = false;
			}

			/* 
				route extractor
			*/
			function resolveRoute(){
				var matchers = ['data','jResolver','url','name','views','jController','jControllerAs','template','templateUrl','jResolver'],
					ret = {};
				matchers.forEach(function(name){
					if(route[name]){
						ret[name] = route[name];
					}
				})

				return ret;
			}
		};

		return this;
	}

//j-View Directive Fn
//As an Elemen <j-view ref="default"></j-view>
//as Attribute <element j-view="default"></element>

	function jViewFn(jViewHandler)
	{

		return {
			allowType : 'AE',
			$compiler : function(ele,attr)
			{
				return function(ele,attr,model){
					//viewSetter for reference
					attr.ref =  '@' + (attr.ref || attr.jView || '');
					jViewHandler
					.setViewReference(ele,attr,model)
					.events.$broadcast('view.render',attr.ref);

				}
			}
		};
	}


})({});