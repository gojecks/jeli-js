
//$CustomEventHandler Function
//Create Custom events that can be reused
//anywhere within the application
function $CustomEventHandler(type,defaultFn){
  if(!type){  type = 'on'};
  var handlers = ['on','emit'],
  _eventsQueue = {},
  _eventsObj  = function(){
   return ({
      type : "",
      registered : +new Date,
      timestamp : +new Date,
      isTrusted : true,
      returnValue : true,
      target:null,
      defaultPrevented : false,
      preventDefault : function(){
        this.defaultPrevented  = true;
      }
    });
    },
  _defaultFn = defaultFn || function(){};

  this[type] = function(name,fn){
    if(!_eventsQueue[name]){
      _eventsQueue[name] = [];
    }
    _eventsQueue[name].push(fn);
  };

  this.$broadcast = function(name,arg){
    var _events =  _eventsObj();
      _events.type = name;
      _events.timestamp = +new Date;
      
    if(_eventsQueue[name]){
      _eventsQueue[name].forEach(function(fn){
          fn.apply(fn,[_events,arg]);
      });

    }
    // trigger the defaultFn
      if(!_events.defaultPrevented){
        _defaultFn.apply(_defaultFn, [_events,arg]);
      }
      
  };

  this.$destroy = function(name){
    if(name && _eventsQueue[name]){
      delete _eventsQueue[name];
    }
  };
}

_defaultRegistry('j-eli', '$jFactoryProvider',  '$jEvents')(function()
{
  return $CustomEventHandler;
});