// register encyprtion of data
_defaultRegistry('j-eli', '$jFactoryProvider',  '$jCrypt')(function()
{
  //jEli Encryption
  //@return Object {encrypt : decrypt}
  //@Objectives : Perform Encryption
  function buildLogic()
  {
      var str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=:?><*&%$#@!',
          len = 0,
          chArray = [],
          replace = [];

      while(len < str.length){
        chArray.push(str.charCodeAt(len++));
        replace.push( makeUID(2) );
      }

      return {
        charCode : chArray,
        replacer : replace
      };
  }

  var _logic = buildLogic(),
    publicApi = function(){};

  /*
    encrypt String
  */
  publicApi.prototype.encrypt = function(passer)
  {
    if(passer && passer.length)
    {
      var len = 0,
          encoded = "";
      while(len < passer.length)
      {
        encoded += _logic.replacer[_logic.charCode.indexOf(passer.charCodeAt(len++))];
      }

      return encoded;
    }

    return passer;
  };
  /*
    decrypt encrypted String
  */
  publicApi.prototype.decrypt = function(passer)
  {
    if(passer && passer.length)
    {
      var spltPasser = passer.split(""),
          fakePasser = "",
          cnt=0,
          passer=[]; 
          //loop through and fix
          for(var v in spltPasser)
          { 
            fakePasser +=spltPasser[v]; 
            cnt++; 
            if(cnt > 1)
            { 
                passer.push( String.fromCharCode( _logic.charCode[_logic.replacer.indexOf(fakePasser)] )); 
                cnt=0; 
                fakePasser="";
            } 
          }
    }

    return passer.join("");
  }

  return publicApi;
});