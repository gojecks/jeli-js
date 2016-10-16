//background model Watcher

function $backgroundModelWatcher()
{
    findInList.call($modelMapping.$getAll(),function(idx,obj)
    {
        obj.$consume();
    });
}

//generic WatcherObject
function jObserver(obj,callback){

  var _stat = {
    _Id:null,
    lastCount : 0,
    ignoreList : [],
    _watchObj : (($isArray(obj))?[] : {}),
  };



  //Object Checker
  function dirtyChecker(watchObj){
    var cdata = JSON.parse(watchObj),
        cnt = 0;

    function snapshot(){
      var out = {changes:[],insert:[],deleted:[]};
      //search through the object
      function profiler(obj1,obj2,reProfile,path){
        path = path || [];
        var tp;
        expect(obj1).search(null,function(obj,prop){
          //addd new path
          if(obj2 && obj2.hasOwnProperty(prop) && !reProfile)
          {
              tp = path.concat(prop);
              if(obj && typeof obj === 'object' && [Date, RegExp].indexOf(obj.constructor) == -1){
                  profiler(obj1[prop],obj2[prop],reProfile,path.concat(prop));
              }else {
                if(obj1[prop] !== obj2[prop]){
                  out.changes.push({
                    oldValue : obj2[prop],
                    newValue : obj1[prop],
                    path : tp.join('.')
                  });

                  //set the record
                  obj2[prop] = obj1[prop];
                }
              }
          }else{
            //new record found
            tp = path.concat(prop);
            var pushData = ({
                newValue : obj1[prop],
                oldValue : (obj2)?obj2[prop]:obj2,
                path : tp.join('.')
              });

            if(!reProfile)
            {
              out.insert.push(pushData);
                //reset new value on latest object
                setNewValue(obj2,obj1,prop,path);
            }else{
              out.deleted.push(pushData);

              delete obj1[prop];
            }
          }
        });
      }

      //Observer Value setter
      function setNewValue(diff,against,prop,path){
        try{
          diff[prop] = against[prop];
        }catch(e){
            var last = path.pop(),
                paths = path,
                context = _stat._watchObj;
            paths.forEach(function(cprop){
              context = context[cprop];
            });
            context[last] = against;
        }
        
      }

      //start profiler
      profiler(cdata,_stat._watchObj);
      //check for deletedObj
      if(JSON.stringify(_stat._watchObj).length > watchObj.length){
          profiler(_stat._watchObj,cdata,true);
      }

      //return changes
      return out;
    }

    return snapshot();
  }


  //customStringify Fn
  function customStringify(){
    var cache = [],
        _custom = JSON.stringify(obj, function(key, value) {
        if ($isObject(value) && !$isNull(value)) {
            if ($inArray(value,cache)) {
                // Circular reference found, discard key
                return;
            }
            // Store value in our collection
            cache.push(value);
        }

      if($inArray(key,_stat.ignoreList)){
        return;
      }

      return value;    
    });

    cache = null;

    return _custom;
  }

  //WatchChanges
  function WatchChanges()
  {
      var watchObj = customStringify(),
          profile = dirtyChecker(watchObj),
          changesFound = (profile.changes.length || profile.insert.length || profile.deleted.length);

      if(profile){
        if(changesFound > _stat.lastCount){
          callback.call(obj,profile);
        }
      }

       //set next watch list
      _stat._interval = setTimeout(WatchChanges,_stat.timer);
  }

    //Observer Start
    this.start = function(timer,ignoreList){

      //check for ignire list
      if(ignoreList && $isArray(ignoreList)){
        _stat.ignoreList = ignoreList;
      }

      //if Watch obj is an Array or Obj
      if(typeof obj !== 'object'){
        errorBuilder('Invalid Observer');
      }

      //build watch list
      var watchObj = customStringify(),
          cdata = JSON.parse(watchObj);


      //store intial data for reference
      for(var prop in cdata){
        _stat._watchObj[prop] = cdata[prop];
      };

      //set timer
      _stat.timer = timer || 500;

      //setTimeInterval
      WatchChanges();
    };

    this.$destroy = function(){
      if(_stat._interval){
        clearTimeout(_stat.interval);
      }
    }
}

var ignoreList = ["$mId","$$isIsolated","$$asyncQueue","$$subscribers","$previous","$next","$$watchList","$$phase","$child","$$broadcast","$parent","$$childModel"];

  //disgest from changes
  function digestFromChanges(model){

    if(!model.$$phase){
      model.$consume();
    }

    //disgest other binding
    var _childReference = $modelChildReferenceList.$get(model.$mId);
    _childReference.forEach(function(idx){
        var current = $modelMapping.$get(idx);
        //only perform digest if current state is available
        if(current && current.$consume){
          digestFromChanges(current);
        }
    });
  }


//Observer for complete change in Object
function $observe(model,watch){
  var observer = $modelObserverList.$get(model.$mId);
  if(!observer.started)
  {
    //start a new observer
    var _Observer = new jObserver(model,function(changes){
        digestFromChanges(model);
    });

     //start observer
     _Observer.start(500,ignoreList);
     _Observer.started = true;

     //push our observer to stack
     $modelObserverList.$new(model.$mId,_Observer);
  }

   watch(model);

}
