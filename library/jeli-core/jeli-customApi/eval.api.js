function maskedEval(scr,useScope)
{
    if(!useScope){
      // set up an object to serve as the context for the code
      // being evaluated. 
      var mask = {};
      // mask global properties 
      for (p in this){
        mask[p] = undefined;
      }
    }
    
    // execute script in private context
    return (new Function( "with(this) { try{ return " + scr + " }catch(e){ return undefined; } }")).call(useScope || mask);
}

  //@function simpleBooleanParser
  //credit to  CMCDragonkai for the idea
  function simpleBooleanParser($boolValue)
  {
    switch($boolValue)
    {
      case(true):
      case('true'):
      case(1):
      case('1'):
      case('yes'):
      case('on'):
        return true;
      break;
      case('false'):
      case(false):
      case('0'):
      case(0):
      case('off'):
      case('no'):
        return false;
      break;
      default:
      return undefined;
      break;
    }
  }

//@Function Name simpleTextParse
//@return NUMBER OR STRING
function simpleArgumentParser(arg,sub){
  if(arg){
    return !isNaN(parseInt(arg))?parseInt(arg): (simpleBooleanParser(arg) || arg);
  }
}