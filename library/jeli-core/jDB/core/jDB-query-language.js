      //@Function jQueryTaskPerformer
      //@return prototypical object
      //@argument String
    function jQueryTaskPerformer(query,handler)
    {
        function CMDSuccess(res)
        {
          if(handler.onSuccess)
          {
            handler.onSuccess.apply(handler.onSuccess,[res]);
          }
        }

        function CMDError(res)
        {
          if(handler.onError)
          {
            handler.onError.apply(handler.onError,[res]);
          }
        }

        this['_']  = function(db)
        {
          var result = {state:query[0],result:{message:null}};
            function env()
            {
              var task = db.env[query[1]];
              if(task)
              {
                  var ret = task();
                  if($isObject(ret))
                  {
                    result.state = query[1];
                    ret.then(function(res){
                      //set the state
                      result.result.message = res;
                      CMDSuccess(result);
                    },function(err){
                      CMDError(err);
                    })
                    return true;
                  }else{
                    result.result.message = ret;
                    return CMDSuccess(result);
                  }
                
              }
              return CMDError(dbErrorPromiseObject("Invalid command passed, use -help for help"));
            }

            function jExport()
            {
                //export a table
              if(query.length > 2)
              {
                var expRet = db
                            .export(query[2])//type
                            .initialize($queryDB.DB.$getTable( db.name , query[1]).data, query[5]);
                if(expRet && !expRet.state)
                {
                    var type = null;
                      switch(query[3])
                      {
                        case('d'):
                          type= 'download';
                        break;
                        case('p'):
                        case('c'):
                          type = 'print';
                        break
                      }

                    if(type)
                    {
                      result.result.message = expRet[type](query[4]);
                      return CMDSuccess(result);
                    }
                }

                return CMDError(expRet);
              }
            }

            function jImport()
            {
              var file = db
                        .import(query[1],{
                          logService : $queryDB.getNetworkResolver('logService',db.name),
                          onselect : function(fileName,file)
                          {
                            this.logService("Processing selected file :" + fileName);
                          },
                          onSuccess : CMDSuccess,
                          onError : CMDError
                        });

            }

            //@Function generates help list
            function helper()
            {
              var helpers = db.jDBHelpers;
                result.result.message = helpers.get();
                return CMDSuccess(result);
            }

            //@Function clearScreen
            function clearScreen()
            {
              result.result.message = true;
              return CMDSuccess(result);
            }

            function sync()
            {
              db
              .synchronize()
              .Entity(query[1])
              .configSync()
              .processEntity(handler);
            }

            //juser
            function jUsers()
            {
              var _dbUsers = db._users();

                if(_dbUsers && _dbUsers[query[1]] && query.length > 2)
                {
                  var arg = maskedEval(query[2]);

                  _dbUsers[query[1]](arg)
                  .onSuccess(CMDSuccess)
                  .onError(CMDError);

                }else
                {
                  return CMDError(dbErrorPromiseObject("Invalid command passed, use -help for help"));
                }
            }

            var cmd = ({
                env : env,
                export : jExport,
                sync : sync,
                help : helper,
                cls : clearScreen,
                import : jImport,
                _users : jUsers
            });

            var task = cmd[query[0]];
            if(task)
            {
              return  task();
            }

            return CMDError(dbErrorPromiseObject("Invalid command passed, use -help for help"));
        };

          //condition setter
          function setCondition(spltQuery)
          {
              return spltQuery.slice( parseInt(query.indexOf("where") + 1) ).join(' ');
          }

            //select -columns -tableName
            //-join -CLAUSE -on -EXPRESSION
            //-Where -column -like -expression 

            this.select = function(db)
            {
                var spltQuery = query,
                    result = false,
                    qTask,
                    table;

                //@Function buildTable
                function buildTable()
                {
                    if(expect(spltQuery[2]).contains(','))
                    {
                      table = spltQuery[2].split(',');
                    }else
                    {
                      table = spltQuery[2];
                    }
                }

                if(spltQuery.length > 1)
                {
                    //build table
                    buildTable();

                    db
                    .transaction(table)
                    .onSuccess(function(e)
                    {
                      qTask = e.result.select(spltQuery[1]);

                      if(expect(query).contains("join") && expect(query).contains("on"))
                      {
                        qTask
                        .join(spltQuery[parseInt(query.indexOf("join") + 1)])
                        .on(spltQuery[parseInt(query.indexOf("on") + 1)]);
                      }

                      if(expect(query).contains('where'))
                      {
                        var whereTask = spltQuery.slice( parseInt(query.indexOf("where") + 1) );
                          qTask
                          .where(whereTask.join(''));
                      }

                      if(expect(query).contains('limit'))
                      {
                        var limitTask = spltQuery.slice( parseInt(query.indexOf("limit") + 1) );
                            qTask.limit(limitTask.join(''));
                      }

                      qTask
                      .execute()
                      .onSuccess(CMDSuccess)
                      .onError(CMDError);
                    })
                    .onError(CMDError)
                    
                    
                }

            };

            //insert -table name -data
            this.insert = function(db)
            {
                var tblName = query[2],
                    data = maskedEval(query[1]) || [],
                    result = false;
                //insert into the table
                db
                .transaction(tblName,"writeonly")
                .onSuccess(function(ins)
                {
                    var res = ins.result;
                  res
                  .insert.apply(res,data)
                  .execute()
                  .onSuccess(CMDSuccess)
                  .onError(CMDError);
                })
                .onError(CMDError)

            };

            //create -tablename -columns
            this.create = function(db)
            {
                var tblName = query[1],
                    columns = maskedEval(query[2]) || [],
                    result = false;
                //create the table
                if(tblName && columns)
                {
                  db
                  .createTbl(tblName,columns)
                  .onSuccess(CMDSuccess)
                  .onError(CMDError);
                }
            };

            //delete -tableName -expression
            this['delete'] = function(db)
            {
              var table = query[1],
                  condition = setCondition(query),
                  result = false;
              if(table && condition)
              {
                db
                .transaction(table,'writeonly')
                .onSuccess(function(del)
                {
                  del
                  .result
                  .delete(condition)
                  .execute()
                  .onSuccess(CMDSuccess)
                  .onError(CMDError)
                })
                .onError(CMDError)
              }

            };

            //update -table -records
            //Clause -where -columns -like:expression
            this.update = function(db)
            {
              //updating a table
              var result = false;
              if(query.length && query.length > 2)
              {
                  db
                  .transaction(query[1],'writeonly')
                  .onSuccess(function(upd)
                  {
                    upd
                    .result
                    .update(query[2],setCondition(query))
                    .execute()
                    .onSuccess(CMDSuccess)
                    .onError(CMDError)
                  })
                  .onError(CMDError);
              }
            };

            //truncate -table -flag
            this.truncate = function(db)
            {
              //@Function Truncate
              //Empties the required table
              var result = false;

                if(query.length > 2)
                {
                  db
                  .table(query[1])
                  .onSuccess(function(trun)
                  {
                    var flag = simpleBooleanParser(query[2]),
                        state = trun.result.truncate(flag);
                    if(state.status.success)
                    {
                      CMDSuccess(state);
                    }else{
                      CMDError(state);
                    }
                  })
                  .onError(CMDError);
                }

            };

            //check if inProduction
            //drop -table -tablename -flag
            this.drop = function(db)
            {
              // @Function drops the required table
              var result = false;

              if(query.length > 2)
              {
                  var flag = simpleBooleanParser(query[3]) || false;
                  switch(query[1].toLowerCase())
                  {
                    case("table"):
                    case('tbl'):
                    case("t"):
                      db
                      .table(query[2])
                      .onSuccess(function(tbl)
                      {
                         var state = tbl.result.drop(flag);
                          if($isEqual(state.status,'success'))
                          {
                            CMDSuccess(state);
                          }else{
                            CMDError(state);
                          }
                      })
                      .onError(CMDError)
                    break;
                    case('database'):
                    case('db'):
                    case('d'):
                      db
                      .drop(flag)
                      .onSuccess(function(state)
                      {
                          if($isEqual(state.status,'success'))
                          {
                            CMDSuccess(state);
                          }else{
                            CMDError(state);
                          }
                      })
                      .onError(CMDError)
                    break;
                    default:

                    break;
                  }
              }
            };

            //ALTER -tableName -add -new -column:columnName -configuration
            //Alter -tableName -drop:columnName

            this.alter = function(db)
            {
              // @Function drops the required table
              var result = false,
                  taskType ={c:'column',f:'foreign',p:'primary',u:'unique',m:'mode'};

                if(query.length > 2)
                {
                    //alter the table
                    db
                    .table(query[1])
                    .onSuccess(function(alt)
                    {
                        var exp = query[query.length-1],
                            key = query[query.length-2],
                            type = 'new',
                            task = taskType[query[3]];
                      switch(query[2])
                      {
                        case('add'):
                        case('a'):

                            //options refers to "primary" | "foreign" keys
                            //foreignkey requires a table to reference
                            if(!$isEqual(task,'column'))
                            {
                                key = exp;
                                type = 'key';
                            }

                            alt
                            .result
                            .Alter
                            .add( type )[task](key,maskedEval(exp) || exp);

                        break;
                        case('drop'):
                        case('d'):
                          alt
                          .result
                          .Alter.drop(query[3]);
                        break;
                        default:
                        break;
                      }

                      CMDSuccess( dbSuccessPromiseObject("alter","Table("+query[1]+") have been altered."));
                    })
                    .onError(CMDError);
                }

            };
      }