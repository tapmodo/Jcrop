  /**
   *  ExtentFilter
   *  a filter to implement minimum or maximum size
   */
  var ExtentFilter = function(){
    this.core = null;
  };
  $.extend(ExtentFilter.prototype,{
    tag: 'extent',
    priority: 12,
    offsetFromCorner: function(corner,box,b){
      var w = box[0], h = box[1];
      switch(corner){
        case 'bl': return [ b.x2 - w, b.y, w, h ];
        case 'tl': return [ b.x2 - w , b.y2 - h, w, h ];
        case 'br': return [ b.x, b.y, w, h ];
        case 'tr': return [ b.x, b.y2 - h, w, h ];
      }
    },
    getQuadrant: function(s){
      var relx = s.opposite[0]-s.offsetx
      var rely = s.opposite[1]-s.offsety;

      if ((relx < 0) && (rely < 0)) return 'br';
        else if ((relx >= 0) && (rely >= 0)) return 'tl';
        else if ((relx < 0) && (rely >= 0)) return 'tr';
        return 'bl';
    },
    filter: function(b,ord,sel){

      if (ord == 'move') return b;

      var w = b.w, h = b.h, st = sel.state, r = this.limits;
      var quad = st? this.getQuadrant(st): 'br';

      if (r.minw && (w < r.minw)) w = r.minw;
      if (r.minh && (h < r.minh)) h = r.minh;
      if (r.maxw && (w > r.maxw)) w = r.maxw;
      if (r.maxh && (h > r.maxh)) h = r.maxh;

      if ((w == b.w) && (h == b.h)) return b;

      return Jcrop.wrapFromXywh(this.offsetFromCorner(quad,[w,h],b));
    },
    refresh: function(sel){
      this.elw = sel.core.container.width();
      this.elh = sel.core.container.height();

      this.limits = {
        minw: sel.minSize[0],
        minh: sel.minSize[1],
        maxw: sel.maxSize[0],
        maxh: sel.maxSize[1]
      };
    }
  });
  Jcrop.registerFilter('extent',ExtentFilter);

