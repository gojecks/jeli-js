(function()
{

	// jEli route manager
	// created 10-11-15 7:00pm
	// created by Gojecks Joseph

	// jEliWebState Service

	'use strict';

	jEli
	.jModule('jEli.web.route')
	.jFactory('$webState',['$jEliWebProvider','$rootModel','$jCompiler',$webStateFn]);

	//$location Fn
	function $webStateFn($jEliWebProvider, $rootModel, jCompiler)
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

    	var _currentOpenActivity = [],
    		_activityCache = {};
    	this.currentOpenActivity = function(activityName){
			if(!(_currentOpenActivity.indexOf(activityName) > -1)){
				_currentOpenActivity.push( activityName );
				return false;
			}

			return true;
		};

		this.removeActivity = function(activityName){
			_currentOpenActivity.pop();
			delete _activityCache[activityName];
		};

		this.transitActivity = function(activityName){
			var _activity = jEli.dom('[view-page="'+activityName+'"]');
			if(_activity.length){
				jEli.dom('[view-page]')
					.hide(0,function(){
						_activity.css({display:'block',transform:'translateX(0px)'}).removeAttr('style');
					});
			}
		};

		this.getNextActivity = function(){
			return _currentOpenActivity[_currentOpenActivity.length-1] || $jEliWebProvider.getActivityFallback();
		};

		this.getCurrentActivityDetail = function(activityName){
			return _activityCache[activityName];
		};

		this.openActivity = function(activityName, params){
			var _activity = $jEliWebProvider.getRouteObj(activityName);
			if(!this.currentOpenActivity(activityName) && _activity){
				var _activityView = _activity.views[_activity.route.$$views[0]] || _activity,
					_viewHtml = '<div j-activity-view view-page="'+activityName+'"';
					_viewHtml += ((_activityView.templateUrl)?'template-url="'+_activityView.templateUrl+'"':'');
					_viewHtml += ((_activityView.jController)?'template-controller="'+_activityView.jController+((_activityView.jControllerAs)?' as '+_activityView.jControllerAs:'')+'"':'');
					_viewHtml +='></div>';

				// set out activity to cache
				_activityCache[activityName] = _activity;
				// set the current activity name
				this.$currentActivity = activityName;
				_activity.route.params = params || {};

				//compile the element
				jEli.dom('body').append(jCompiler(_viewHtml)($rootModel.$new(1)));
			}else{
				this.transitActivity(activityName);
			}
		};

    	return this;
	}


})();