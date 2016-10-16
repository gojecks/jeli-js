(function(){
	
	'use strict';

	//jEli Login Service
	//Powered by jEli

	jEli
	.jModule('jeli.auth.service',[])
	.jProvider('jAuthProvider',jAuthProviderFN)
	.jFactory('jAuthService',["$http","Base64","jAuthProvider",jAuthServiceFn]);

	function jAuthProviderFN(){
		//Config Object contains service that we support
		//oAuth
		//jDB
		//openID,
		// customLogin
		var config = {
			oauth : false,
			jdb : false,
			openid : false,
			custom : false
		},
		loginType = false,
		loginServiceConfiguration = {},
		registerServiceConfiguration = {},
		loginTrailCount = 3;

		this.setLoginType  = function( type ){
			if(type && config[type] && !loginType){
				config[type] = true;
			}

			loginType = type;
		};

		// loginServiceConfiguration
		//Accepts Object depending on login type
		// OAUTH SAMPLE
		//{url : "/oauth/token","client_id":"example","client_secret":"example_secret"}
		//jDB SAMPLE
		//{DBNAME:"jFrontEndOnly",resource : {loginMode:1,serviceHost:"http://localhost/jEliDB/","app_id" : "*","app_secret":"*"}}
		//CustomLogin
		//{"url":"/path_to_login_api"}

		this.loginServiceConfiguration = function(obj){
			if(!jEli.$isObject(obj)){
				throw new error('Configuration is expected to be OBJECT not ('+ typeof obj +')');
			}

			loginServiceConfiguration = obj;
		};

		//jDB SAMPLE
		//{DBNAME:"jFrontEndOnly",resource : {serviceHost:"http://localhost/jEliDB/","app_id" : "*","app_secret":"*"}}
		//CustomRegistration
		//{url:"/path_to_login_api"}
		this.registerServiceConfiguration = function(obj){
			if(!jEli.$isObject(obj)){
				throw new error('Configuration is expected to be OBJECT not ('+ typeof obj +')');
			}

			registerServiceConfiguration = obj;
		};

		//Set the number of times an account
		//should be locked after too many attempt
		this.setMaxLoginAttempt = function(num){
			loginTrailCount = num;
		};

		this.$get = function(){
			var publicApis = {};

			publicApis.getLoginConfiguration = function(){
				return loginServiceConfiguration;
			};

			publicApis.getRegisterConfiguration = function(){
				return registerServiceConfiguration;
			};

			publicApis.getLoginType = function(){
				return loginType;
			};

			publicApis.getLoginAttempt = function(){
				return loginTrailCount;
			};

			return publicApis;
		};
	}


	//jAuthServiceFn
	function jAuthServiceFn($http,Base64,jAuthProvider){

		var publicApis = {},
			privateApis = {register:{},login:{},authManager:{}},
			validationFn = {},
			loginAccountTrial = jAuthProvider.getLoginAttempt();

			//register JDB
			privateApis.register.jDB = function(postObj,done,fail){
				new jEli.$jDB(postObj.DBNAME,postObj.version || 1)
				.isClientMode()
				.requiresLogin()
				.open(postObj.resource)
				.onSuccess(function(e)
				{
					//set DB
					var $db = e.result;
					//submit user to DB
					$db._users()
					.add(privateApis.register.postBody)
					.onSuccess(done)
					.onError(fail);

					//close the DB
					$db.close(false);
				});
			};

			privateApis.register.custom = function(postObj,done,fail){
				if(postObj.url){
					$http({
						url : postObj.url,
						dataType:'json',
						data : privateApis.register.postBody
					}).then(done,fail);
				}
			};


			//Login Private Api
			privateApis.login.getHeader = function(){
				return ({
					'Content-Type': 'application/x-www-form-urlencoded',
			    	'Accept': 'application/json'
				});
			};


			privateApis.login.oauth = function(postObj,done,fail){
				//login with OAUTH
				var credentials = privateApis.login.postBody,
					headers = this.getHeader(),
					data = 'username=' +  encodeURIComponent(credentials.username) + '&password=' +
			                encodeURIComponent(credentials.password) + '&grant_type=password&scope=read%20write';
			        headers['Authorization'] =  'Basic ' + Base64.encode(postObj.client_id + ':' + postObj.client_secret);

			    //perform task
			    $http.post(postObj.url, data, headers)
			    .then(done,fail);
			};

			//Login with custom
			privateApis.login.custom = function(postObj,done,fail){
				var credentials = privateApis.login.postBody,
					headers = this.getHeader();

				return $http.post(postObj.url, credentials, headers).then(done,fail);
			};


			privateApis.login.jdb = function(postObj,done,fail){
				var credentials = privateApis.login.postBody;
				new jEli.$jDB(postObj.DBNAME,postObj.version || 1)
				.isClientMode()
				.requiresLogin()
				.open(postObj.resource)
				.onSuccess(function(e)
				{
					//set DB
					var $db = e.result;
					//submit user to DB
					$db
					._users()
					.authorize(credentials)
					.onSuccess(done)
					.onError(fail);

					//close the DB
					$db.close(false);
				})
				.onError(fail);
			};

			//ValidationFn currently supports minLength,maxLength and emailValidation

			//validate length of a string or obj
			validationFn['minlength'] = function(value,requiredLength){
				if(jEli.$isObject(value) || !value){
					return false;
				}

				return String(value).length >= requiredLength;
			};

			validationFn['maxlength'] = function(value,requiredLength){
				if(jEli.$isObject(value) || !value){
					return false;
				}
				
				return String(value).length <= requiredLength;
			};

			// validate Email Address
			validationFn.emailvalidation = function(val){
				var regExp = /^\w+([\.-]?\w+)*@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

				return regExp.test( val );
			};

			//validate Domain Address
			validationFn.domainvalidation = function(domain){

				return /[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/.test(domain);
			};

		//Private Api for form validation
		//Iterate through the required validation	

		privateApis.validate = function(type,obj){
			if(!Object.keys(privateApis[type].postBody).length){
				this[type].requiresValidation = true;
				return;
			}

			//set the validation flag to false
			privateApis[type].validationFailed = false;

			var self = this;
			jEli.forEach(privateApis[type].postBody,function(name,value){
				var _failedValidation =[];
				if(obj[name]){
					_failedValidation = validate(value,obj[name]);
				}

				if(_failedValidation.length){
					privateApis[type].failedValidation[name] = _failedValidation;
					//set validation flag to true
					privateApis[type].validationFailed = true;
				}
			});
		};


		function validate(value,criteria){
			var errorFound = [];
			//iterate through the criteria
			jEli.forEach(criteria,function(name,obj){
				var passed = false;
				if(validationFn[name.toLowerCase()]){
					passed = (validationFn[name.toLowerCase()] || function(){})(value,obj);
				}
				//if is custom function
				else if(jEli.$isFunction(obj)){
					passed = obj(value);
				}else{}

				if(!passed){
					errorFound.push(name);
				}
			});

			return errorFound;
		}

		publicApis.register = {
			setData : function(data){
				privateApis.register.postBody = data;
				return this;
			},
			//set Required Fields is Optional
			//Only use it when you want validation
			//Parameter TYPE : OBJ
			//sample 
				// {fullname:{maxLength:{value:50},minLength:{value:40},email:{minLength:{value:10}},validate:function(value){}}}
			setRequiredFields : function(obj){
				if(!obj && !jEli.$isObject(obj)){
					throw new error('Configuration is expected to be OBJECT not ('+ typeof obj +')');
				}


				//set the validation flag
				privateApis.register.requiresValidation = true;

				//this api is avaliable
				//only when this function is used
				var self = this;
				this.validateFields = function(){
					privateApis.register.requiresValidation = false;
					privateApis.register.failedValidation = {};

					//iterate through the postBody data
					//Make sure it passes validation
					privateApis.validate('register',obj);

					return self;
				};

				return this;
			},
			save : function(success,failure){
				//check if validation is required
				if(privateApis.register.requiresValidation){
					failure({reason:"Form Requires Validation - validateFields : API not called",code:"-101"});

					return;
				}


				if(!privateApis.register.validationFailed){
					var postObj = jAuthProvider.getRegisterConfiguration();
					//check postObj
					if(postObj){
						if(postObj.DBNAME){
							privateApis.register.jDB(postObj,success,failure);
						}else{
							privateApis.register.custom(postObj,success,failure);
						}
					}
				}else{
					failure({reason:"Failed Validation","fields":privateApis.register.failedValidation,code:"-101"});
				}
			}
		};


		//PublicApi to add validation
		publicApis.addValidationRule = function(name,fn){
			if(name && jEli.$isFunction(fn)){
				validationFn[name] = fn;
			}

			return this;
		};


		//PublicApi to Login users
		publicApis.login = {
			setData : function(data){
				privateApis.login.postBody = data;
				return this;
			},
			//set Required Fields is Optional
			//Only use it when you want validation
			//Parameter TYPE : OBJ
			//sample 
				// {fullname:{maxLength:50,minLength:40},email:{minLength:10},validate:function(value){}}}
			setRequiredFields : function(obj){
				if(!obj && !jEli.$isObject(obj)){
					throw new error('Configuration is expected to be OBJECT not ('+ typeof obj +')');
				}


				//set the validation flag
				privateApis.login.requiresValidation = true;

				//this api is avaliable
				//only when this function is used
				var self = this;
				this.validateFields = function(){
					privateApis.login.requiresValidation = false;
					privateApis.login.failedValidation = {};
					//iterate through the postBody data
					//Make sure it passes validation
					privateApis.validate('login',obj);

					return self;
				};

				return this;
			},
			Authorize : function(success,failure){
				//Log user out when Maximum Login
				//is reached
				if(!loginAccountTrial){
					failure({reason:"Too Many Login attempt",code:"-100"});

					return;
				}
				//check if validation is required
				if(privateApis.login.requiresValidation){
					failure({reason:"Form Requires Validation - validateFields : API not called",code:"-101"});

					return;
				}


				if(!privateApis.login.validationFailed){
					var postObj = jAuthProvider.getLoginConfiguration(),
						type = jAuthProvider.getLoginType();
					//check postObj
					privateApis.login[type](postObj,success,failure);
				}else{
					failure({reason:"Failed Validation","fields":privateApis.login.failedValidation,code:"-102"});
				}

				// reduce the limit of attempt
				loginAccountTrial--;
			}
		};

		publicApis.authManager = {
			init : function(data){
				privateApis.authManager.userAuthenticationData = data;
			},
			isAuthentication : function(){
				var _identify = privateApis.authManager.userAuthenticationData ;
				return _identify?true:false;
			},
			destroy : function(){
				delete privateApis.authManager.userAuthenticationData;
			}
		}

		return publicApis;
	}
	
})();