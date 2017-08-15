setTimeout = (function( oldsetTimeout){
  var registered=[],
  f = function(a,b){
      return registered[ registered.length ] = oldsetTimeout(a,b);
  };
   f.clearAll = function(){
      var r;
      while( r = registered.pop()) {
        clearInterval( r );
      }
  };
  return f;
})(window.setTimeout);