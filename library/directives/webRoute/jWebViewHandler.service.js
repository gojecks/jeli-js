(function()
{

	// jEli route manager
	// created 10-11-15 7:00pm
	// created by Gojecks Joseph

	// jViewHandler Service

'use strict';

jEli
.jModule('jEli.web.route')
.jFactory('jViewHandler',['$jEvents','$http','$webState','$jEliWebProvider','$rootModel','$controller','$resolve','$jCompiler','$sce',jViewHandlerFn]);

/*

*/
function jViewHandlerFn($jEvents, $http, $webState,jEliWebProvider,$rootModel,ctrlP,$resolve, jCompiler, $sce){
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
	this.events = new $jEvents('listener');
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
					view.template = $sce.trustAsHTML(data.data);
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
				.instantiate(ctrl, viewInstance, null, view.jControllerAs, $webState.state.route.resolvedData);
			}
			//resolve the view instance
			viewObjectInstance.ele.empty().append( jCompiler(view.template)(viewInstance) );

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
		getCurrentView
		@params : Route OBJECT

	*/

	function getCurrentView(route){
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

		return _views;
	}

	/*
		trigger the resolved route views
	*/
	this.resolveViews = function(route,path){
		var _views = getCurrentView(route);
		//set the baseUrl to the $webState Object
		//BaseUrl is neccessary when replace state is in use.
		$webState.$$baseUrl = path;

		//set Resolver State to false
		stateInProgress = false;
		return function(){

			var inc = 0;
			//loop through the required views
			do{
				currentView = _views[inc] || '@';
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
			//initialize state changed 
			var previousState = jEli.$extend({},$webState.state.route);
			//set the current view
			//get the RouteView Object
			var locals = {};

			//create an Event
			//Add Default Function to our listener
			//if Slave Function calls preventDefault
			//Master FN is not triggered
			_jView = new $jEvents('addEventListener',function(e){
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
							self.resolveViews(route,path)();

							self.resolveNextStateQueue();

							//set relovers
							route.resolvedData = locals;
						});
					}else{
						self.resolveViews(route,path)();
					}
				}
			});

			_jView.addEventListener('$webRouteStart',function(e){
				//set the state
				$webState.state = route;
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


})();