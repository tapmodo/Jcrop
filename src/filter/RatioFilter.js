  /**
   *  RatioFilter
   *  implements aspectRatio locking
   */
  var RatioFilter = function(){
    this.ratio = 0;
    this.core = null;
  };
  $.extend(RatioFilter.prototype,{
    tag: 'ratio',
    priority: 15,
    offsetFromCorner: function(corner,box,b){
      var w = box[0], h = box[1];
      switch(corner){
        case 'bl': return [ b.x2 - w, b.y, w, h ];
        case 'tl': return [ b.x2 - w , b.y2 - h, w, h ];
        case 'br': return [ b.x, b.y, w, h ];
        case 'tr': return [ b.x, b.y2 - h, w, h ];
      }
    },
    getBoundRatio: function(b,quad){
      var box = Jcrop.getLargestBox(this.ratio,b.w,b.h);
      return Jcrop.wrapFromXywh(this.offsetFromCorner(quad,box,b));
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

      if (!this.ratio) return b;

      var rt = b.w / b.h;
      var st = sel.state;

      var quad = st? this.getQuadrant(st): 'br';
      ord = ord || 'se';

      if (ord == 'move') return b;

      switch(ord) {
        case 'n':
          b.x2 = this.elw;
          b.w = b.x2 - b.x;
          quad = 'tr';
          break;
        case 's':
          b.x2 = this.elw;
          b.w = b.x2 - b.x;
          quad = 'br';
          break;
        case 'e':
          b.y2 = this.elh;
          b.h = b.y2 - b.y;
          quad = 'br';
          break;
        case 'w':
          b.y2 = this.elh;
          b.h = b.y2 - b.y;
          quad = 'bl';
          break;
      }

      return this.getBoundRatio(b,quad);
    },
    refresh: function(sel){
      this.ratio = sel.aspectRatio;
      this.elw = sel.core.container.width();
      this.elh = sel.core.container.height();
    }
  });
  Jcrop.registerFilter('ratio',RatioFilter);

