  /**
   *  RoundFilter
   *  rounds coordinate values to integers
   */
  var RoundFilter = function(){
    this.core = null;
  };
  $.extend(RoundFilter.prototype,{
    tag: 'round',
    priority: 90,
    filter: function(b){
      
      var n = {
        x: Math.round(b.x),
        y: Math.round(b.y),
        x2: Math.round(b.x2),
        y2: Math.round(b.y2)
      };
      
      n.w = n.x2 - n.x;
      n.h = n.y2 - n.y;

      return n;
    }
  });
  Jcrop.registerFilter('round',RoundFilter);

