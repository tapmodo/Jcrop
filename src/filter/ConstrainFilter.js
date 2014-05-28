  /**
   *  ConstrainFilter
   *  a filter to constrain crop selection to bounding element
   */
  var ConstrainFilter = function(){
    this.core = null;
  };
  $.extend(ConstrainFilter.prototype,{
    tag: 'constrain',
    priority: 5,
    filter: function(b,ord){
      if (ord == 'move') {
        if (b.x < this.minx) { b.x = this.minx; b.x2 = b.w + b.x; }
        if (b.y < this.miny) { b.y = this.miny; b.y2 = b.h + b.y; }
        if (b.x2 > this.maxx) { b.x2 = this.maxx; b.x = b.x2 - b.w; }
        if (b.y2 > this.maxy) { b.y2 = this.maxy; b.y = b.y2 - b.h; }
      } else {
        if (b.x < this.minx) { b.x = this.minx; }
        if (b.y < this.miny) { b.y = this.miny; }
        if (b.x2 > this.maxx) { b.x2 = this.maxx; }
        if (b.y2 > this.maxy) { b.y2 = this.maxy; }
      }
      b.w = b.x2 - b.x;
      b.h = b.y2 - b.y;
      return b;
    },
    refresh: function(sel){
      this.elw = sel.core.container.width();
      this.elh = sel.core.container.height();
      this.minx = 0 + sel.edge.w;
      this.miny = 0 + sel.edge.n;
      this.maxx = this.elw + sel.edge.e;
      this.maxy = this.elh + sel.edge.s;
    }
  });
  Jcrop.registerFilter('constrain',ConstrainFilter);
