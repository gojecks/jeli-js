(function()
{

	// jEli route manager
	// created 10-11-15 7:00pm
	// created by Gojecks Joseph

	'use strict';

	jEli
	.jModule('jEli.web.route')
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


})();