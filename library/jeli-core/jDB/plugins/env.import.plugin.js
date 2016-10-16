
	//Import Plugin
	//Called in env
	//-env -import -tableName

	jEliDB.plugins.jQl('import',{
		help : '',
		fn : jImportPluginFn
	});

	function jImportPluginFn(query,handler)
	{
		var result = {state:query[0],result:{message:null}};
	    return function(db)
	    {
	      var file = db
	                .import(query[1],extend({
	                  logService : $queryDB.getNetworkResolver('logService',db.name),
	                  onselect : function(fileName,file)
	                  {
	                    this.logService("Processing selected file :" + fileName);
	                  }
	                },handler));

	    };
	}