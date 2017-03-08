
_defaultRegistry('j-eli', '$jFactoryProvider',  '$jEvents')(function()
{
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
      if(_eventsQueue[name]){
        var _events =  _eventsObj();
        _events.type = name;
        _events.timestamp = +new Date;
        _eventsQueue[name].forEach(function(fn){
            fn.apply(fn,[_events,arg]);
            if(!_events.defaultPrevented){
              _defaultFn(_events);
            }
        });
      }
    };

    this.$destroy = function(name){
      if(name && _eventsQueue[name]){
        delete _eventsQueue[name];
      }
    };
  }

  return $CustomEventHandler;
});