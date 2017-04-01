(function(){
	//jEli Storage Manager
	//stores data on the client storage system

	jEli
	.jModule('jStorage',{})
	.jProvider('jStorageProvider',jPrefixHandler)
	.jFactory('jSessionStorage',jStorageHandler('sessionStorage'))
	.jFactory('jLocalStorage', jStorageHandler('localStorage'));


	function jPrefixHandler(){
		var _prefix = "j-";
		this.setPrefix = function(prefix){
			_prefix = prefix;
		};

		this.$get = function(){
			return function(){
				return _prefix;
			}
		};
	}

	function jStorageHandler(type){
		var test = window[type],
			publicApis = function(){};

		if(!test){
			throw new error('Your browser does not support '+type);
		}

		var storage = window[type],
			_temp = {};

		//check if storage already have our attribute
		if(storage.jStorage){
			_temp = JSON.parse(storage.jStorage);
		}

		publicApis.prototype.setItem = function(name,item){
			_temp[name] = item;
			storage.setItem('jStorage',JSON.stringify(_temp));
		};

		publicApis.prototype.getItem = function(name){
			return _temp[name];
		};

		publicApis.prototype.removeItem = function(name){
			delete _temp[name];
			storage.setItem('jStorage',JSON.stringify(_temp));
		};

		publicApis.prototype.clear = function(){
			_temp = {};
			storage.removeItem('jStorage');
		};

		return function(){
			return new publicApis()
		};
	}

})();