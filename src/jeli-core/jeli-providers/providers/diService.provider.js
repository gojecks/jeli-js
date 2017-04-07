// public service providers
$provider.registerProvider('$jEliServices', function(){
	var $publicProviders = 
	{   
	    $http : $http,
	    $defer : $p ,
	    $q : $d,
	    $stacks : new $eventStacks,
	    $cookie : $cookie,
	    $jCompiler : $templateCompiler,
	    $rootModel : new $modelGenerator(),
	    $rootElement : null,
	    $localStorage : window.localStorage,
	    $sessionStorage : window.sessionStorage,
	    $injector : new $dependencyInjector(),
	    $sce: $sce(),
	    "Base64" : Base64Fn,
	    $Observer : jObserver,
	    $deleteIndex : deleteAndReStructure
	};


	this.$get = function(name){
		return $publicProviders[name];
	};

	this.$register = function(name, value){
		$publicProviders[name] = value;

		return this;
	};
});