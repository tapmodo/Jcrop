(function($){

  // DragState {{{
  /**
   *  DragState
   *  an object that handles dragging events
   *
   *  This object is used by the built-in selection object to
   *  track a dragging operation on a selection
   */
  //var DragState = function(cx,cy,$box,bx,by,bw,bh,ord,filters){
  var DragState = function(e,selection,ord){
    var t = this;

    t.x = e.pageX;
    t.y = e.pageY;

    t.selection = selection;
    t.orig = selection.get();

    selection.callFilterFunction('refresh');

    var p = selection.core.container.position();
    t.elx = p.left;
    t.ely = p.top;

    t.offsetx = 0;
    t.offsety = 0;
    t.ord = ord;
    t.opposite = t.getOppositeCornerOffset();

    $(document.body).on('mousemove.jcrop',t.createDragHandler())
      .on('mouseup.jcrop',t.createStopHandler());

  };

  $.extend(DragState.prototype,{
    // getOppositeCornerOffset: function(){{{
    // Calculate relative offset of locked corner
    getOppositeCornerOffset: function(){

      var o = this.orig;
      var relx = this.x - this.elx - o.x;
      var rely = this.y - this.ely - o.y;

      switch(this.ord){
        case 'nw':
        case 'w':
          return [ o.w - relx, o.h - rely ];
          return [ o.x + o.w, o.y + o.h ];

        case 'sw':
          return [ o.w - relx, -rely ];
          return [ o.x + o.w, o.y ];

        case 'se':
        case 's':
        case 'e':
          return [ -relx, -rely ];
          return [ o.x, o.y ];

        case 'ne':
        case 'n':
          return [ -relx, o.h - rely ];
          return [ o.w, o.y + o.h ];
      }

      return [ null, null ];
    },
    // }}}
    dragEvent: function(e){
      this.offsetx = e.pageX - this.x;
      this.offsety = e.pageY - this.y;
      this.selection.update(this.getBox(),this.ord);
      this.selection.element.trigger('cropmove');
    },
    endDragEvent: function(e){
      this.selection.element.trigger('cropend');
    },
    createStopHandler: function(){
      var t = this;
      return function(e){
        $(document.body).off('.jcrop');
        t.endDragEvent(e);
        return false;
      };
    },
    createDragHandler: function(){
      var t = this;
      return function(e){
        t.dragEvent(e);
        return false;
      };
    },
    //update: function(x,y){{{
    update: function(x,y){
      var t = this;
      t.offsetx = x - t.x;
      t.offsety = y - t.y;
    },
    //}}}
    //resultWrap: function(d){{{
    resultWrap: function(d){
      var b = {
          x: Math.min(d[0],d[2]),
          y: Math.min(d[1],d[3]),
          x2: Math.max(d[0],d[2]),
          y2: Math.max(d[1],d[3])
        };

      b.w = b.x2 - b.x;
      b.h = b.y2 - b.y;

      return b;
    },
    //}}}
    //getBox: function(){{{
    getBox: function(){
      var t = this;
      var o = t.orig;
      var _c = { x2: o.x + o.w, y2: o.y + o.h };
      switch(t.ord){
        case 'n': return t.resultWrap([ o.x, t.offsety + o.y, _c.x2, _c.y2 ]);
        case 's': return t.resultWrap([ o.x, o.y, _c.x2, t.offsety + _c.y2 ]);
        case 'e': return t.resultWrap([ o.x, o.y, t.offsetx + _c.x2, _c.y2 ]);
        case 'w': return t.resultWrap([ o.x + t.offsetx, o.y, _c.x2, _c.y2 ]);
        case 'sw': return t.resultWrap([ t.offsetx + o.x, o.y, _c.x2, t.offsety + _c.y2 ]);
        case 'se': return t.resultWrap([ o.x, o.y, t.offsetx + _c.x2, t.offsety + _c.y2 ]);
        case 'ne': return t.resultWrap([ o.x, t.offsety + o.y, t.offsetx + _c.x2, _c.y2 ]);
        case 'nw': return t.resultWrap([ t.offsetx + o.x, t.offsety + o.y, _c.x2, _c.y2 ]);
        case 'move':
          _c.nx = o.x + t.offsetx;
          _c.ny = o.y + t.offsety;
          return t.resultWrap([ _c.nx, _c.ny, _c.nx + o.w, _c.ny + o.h ]);
      }
    }
    //}}}
  });
  // }}}
  // RoundFilter {{{
  /**
   *  RoundFilter
   *  a filter to constrain crop selection to bounding element
   *  This filter simply rounds coordinate values to integers
   */
  var RoundFilter = function(){
    this.core = null;
  };
  $.extend(RoundFilter.prototype,{
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
  // }}}
  // GridFilter {{{
  /**
   *  GridFilter
   *  a filter to constrain crop selection to bounding element
   *  This filter simply rounds coordinate values to integers
   */
  var GridFilter = function(){
    this.stepx = 1;
    this.stepy = 1;
    this.core = null;
  };
  $.extend(GridFilter.prototype,{
    priority: 19,
    filter: function(b){
      
      var n = {
        x: Math.round(b.x / this.stepx) * this.stepx,
        y: Math.round(b.y / this.stepy) * this.stepy,
        x2: Math.round(b.x2 / this.stepx) * this.stepx,
        y2: Math.round(b.y2 / this.stepy) * this.stepy
      };
      
      n.w = n.x2 - n.x;
      n.h = n.y2 - n.y;

      return n;
    }
  });
  // }}}
  // ConstrainFilter {{{
  /**
   *  ConstrainFilter
   *  a filter to constrain crop selection to bounding element
   */
  var ConstrainFilter = function(){
    this.core = null;
  };
  $.extend(ConstrainFilter.prototype,{
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
      this.minx = 0 + sel.bound.w;
      this.miny = 0 + sel.bound.n;
      this.maxx = this.elw + sel.bound.e;
      this.maxy = this.elh + sel.bound.s;
    }
  });
  // }}}
  // ExtentFilter {{{
  /**
   *  ExtentFilter
   *  a filter to implement minimum or maximum size
   */
  var ExtentFilter = function(){
    this.core = null;
  };
  $.extend(ExtentFilter.prototype,{
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
        minw: sel.limitmin[0],
        minh: sel.limitmin[1],
        maxw: sel.limitmax[0],
        maxh: sel.limitmax[1]
      };
    }
  });
  // }}}
  // BackoffFilter {{{
  /**
   *  BackoffFilter
   *  a filter to implement minimum or maximum size
   */
  var BackoffFilter = function(){
    this.minw = 40;
    this.minh = 40;
    this.maxw = 0;
    this.maxh = 0;
    this.core = null;
  };
  $.extend(BackoffFilter.prototype,{
    priority: 22,
    filter: function(b){
      var r = this.bound;

      if (b.x < r.minx) { b.x = r.minx; b.x2 = b.w + b.x; }
      if (b.y < r.miny) { b.y = r.miny; b.y2 = b.h + b.y; }
      if (b.x2 > r.maxx) { b.x2 = r.maxx; b.x = b.x2 - b.w; }
      if (b.y2 > r.maxy) { b.y2 = r.maxy; b.y = b.y2 - b.h; }

      return b;
    },
    refresh: function(sel){
      this.elw = sel.core.container.width();
      this.elh = sel.core.container.height();
      this.bound = {
        minx: 0 + sel.bound.w,
        miny: 0 + sel.bound.n,
        maxx: this.elw + sel.bound.e,
        maxy: this.elh + sel.bound.s
      };
    }
  });
  // }}}
  // RatioFilter {{{
  /**
   *  RatioFilter
   *  a filter to implement aspect ratio (partially working)
   */
  var RatioFilter = function(){
    this.ratio = 0;
    this.core = null;
  };
  $.extend(RatioFilter.prototype,{
    priority: 15,
    getLargestBox: function(ratio,w,h){
      if ((w/h) > ratio)
        return [ h * ratio, h ];
          else return [ w, w / ratio ];
    },
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
      var box = this.getLargestBox(this.ratio,b.w,b.h);
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
      this.ratio = sel.aspect;
      this.elw = sel.core.container.width();
      this.elh = sel.core.container.height();
    }
  });
  // }}}
  // ShadeFilter {{{
  /**
   *  ShadeFilter
   *  A filter that implements div-based shading on any element
   *
   *  The shading you see is actually four semi-opaque divs
   *  positioned inside the container, around the selection
   */
  var ShadeFilter = function(opacity,color){
    this.color = color || 'black';
    this.opacity = opacity || 0.5;
    this.core = null;
    this.shades = {};
  };
  $.extend(ShadeFilter.prototype,{
    tag: 'shader',
    fade: true,
    fadeEasing: 'easeInOutSine',
    fadeSpeed: 320,
    priority: 95,
    init: function(){
      var t = this;

      if (!t.attached) {
        t.visible = false;

        t.container = $('<div />').addClass('jcrop-shades')
          .prependTo(this.core.container).hide();

        t.elh = this.core.container.height();
        t.elw = this.core.container.width();

        t.shades = {
          top: t.createShade(),
          right: t.createShade(),
          left: t.createShade(),
          bottom: t.createShade()
        };

        t.attached = true;
      }

      t.refresh();
      //t.filter(this.core.getSelection(1),null,this.core.ui.selection);
    },
    destroy: function(){
      this.container.remove();
    },
    setColor: function(color,instant){
      var t = this;
      this.color = color;
      $.each(t.shades,function(u,i){
        if (!t.fade || instant) i.css('backgroundColor',color);
          else i.animate({backgroundColor:color},{queue:false,duration:t.fadeSpeed,easing:t.fadeEasing});
      });
      return t;
    },
    setOpacity: function(opacity,instant){
      var t = this;
      this.opacity = opacity;
      $.each(t.shades,function(u,i){
        if (!t.fade || instant) i.css({opacity:opacity});
          else i.animate({opacity:opacity},{queue:false,duration:t.fadeSpeed,easing:t.fadeEasing});
      });
      return t;
    },
    createShade: function(){
      return $('<div />').css({
        position: 'absolute',
        backgroundColor: this.color,
        opacity: this.opacity
      }).appendTo(this.container);
    },
    refresh: function(){
      var m = this.core, s = this.shades;
      this.elh = m.container.height();
      this.elw = m.container.width();
      s.right.css('height',this.elh+'px');
      s.left.css('height',this.elh+'px');
    },
    filter: function(b,ord,sel){

      if (!sel.active) return b;

      var t = this,
        s = t.shades;
      
      s.top.css({
        left: Math.round(b.x)+'px',
        width: Math.round(b.w)+'px',
        height: Math.round(b.y)+'px'
      });
      s.bottom.css({
        top: Math.round(b.y2)+'px',
        left: Math.round(b.x)+'px',
        width: Math.round(b.w)+'px',
        height: (t.elh-Math.round(b.y2))+'px'
      });
      s.right.css({
        left: Math.round(b.x2)+'px',
        width: (t.elw-Math.round(b.x2))+'px'
      });
      s.left.css({
        width: Math.round(b.x)+'px'
      });

      if (!t.visible) {
        t.container.show();
        t.visible = true;
      }

      return b;
    }
  });
  // }}}
  // CropAnimator {{{
  /**
   *  CropAnimator
   *  manages smooth cropping animation
   *
   *  This object is called internally to manage animation.
   *  An in-memory div is animated and a progress callback
   *  is used to update the selection coordinates of the
   *  visible selection in realtime.
   */
  var CropAnimator = function(selection){
    this.selection = selection;
    this.core = selection.core;
  };

  $.extend(CropAnimator.prototype,{
    getElement: function(){
      var b = this.core.getSelection(1);

      return $('<div />')
        .css({
          position: 'absolute',
          top: b.y+'px',
          left: b.x+'px',
          width: b.w+'px',
          height: b.h+'px'
        });
    },
    animate: function(x,y,w,h,cb){
      var t = this;
      t.selection.allowResize(false);
      t.getElement().animate({
        top: y+'px',
        left: x+'px',
        width: w+'px',
        height: h+'px'
      },{
        easing: t.core.opt.animEasing,
        duration: t.core.opt.animDuration,
        complete: function(){
          t.selection.allowResize(true);
          cb && cb.call(this);
        },
        progress: function(anim){
          var props = {}, i, tw = anim.tweens;

          for(i=0;i<tw.length;i++){
            props[tw[i].prop] = tw[i].now; }

          var b = {
            x: parseInt(props.left),
            y: parseInt(props.top),
            w: parseInt(props.width),
            h: parseInt(props.height)
          };

          b.x2 = b.x + b.w;
          b.y2 = b.y + b.h;

          t.selection.update(b);
        }
      });
    }
  });
  // }}}
  // KeyWatcher {{{
  /**
   *  KeyWatcher
   *  provides keyboard support
   */
  var KeyWatcher = function(core){
    this.core = core;
    this.init();
  };

  KeyWatcher.defaults = {
    passthru: [ 9 ],
    debug: false
  };

  $.extend(KeyWatcher.prototype,{
    init: function(){
      $.extend(this,KeyWatcher.defaults);
      this.enable();
    },
    disable: function(){
      this.core.container.off('keydown.jcrop');
    },
    enable: function(){
      var t = this, m = t.core;
      m.container.on('keydown.jcrop',function(e){
        var nudge = e.shiftKey? 16: 2;

        if ($.inArray(e.keyCode,t.passthru) >= 0)
          return true;

        switch(e.keyCode){
          case 37: m.nudge(-nudge,0); break;
          case 38: m.nudge(0,-nudge); break;
          case 39: m.nudge(nudge,0); break;
          case 40: m.nudge(0,nudge); break;

          case 46:
          case 8:
            m.requestDelete();
            return false;
            break;

          default: if (t.debug) console.log('keycode: ' + e.keyCode);
        }

        if (!e.metaKey && !e.ctrlKey)
          e.preventDefault();
      });
    }
  });
  // }}}
  // StageDrag {{{
  var StageDrag = function(manager,opt){
    $.extend(this,StageDrag.defaults,opt || {});
    this.manager = manager;
    this.core = manager.core;
  };
  
  StageDrag.defaults = {
    offset: [ -8, -8 ],
    active: true,
    max: null,
    minsize: [ 20, 20 ],
    multi: false
  };

  $.extend(StageDrag.prototype,{
    start: function(e){
      if (!this.active) return false;
      if (this.max && (this.core.ui.multi.length >= this.max)) return false;

      var o = $(e.currentTarget).offset();
      var origx = e.pageX - o.left + this.offset[0];
      var origy = e.pageY - o.top + this.offset[1];
      var m = this.core.ui.multi;

      if (!this.multi) {
        for(var i=0;i<m.length;i++) m[i].remove();
        this.core.ui.multi = [];
      }

      var sel = this.core.newSelection().update(Jcrop.wrapFromXywh([origx,origy,1,1]));
      return sel.startDrag(e,'se');
    },
    end: function(x,y){
      this.drag(x,y);
      var b = this.sel.get();

      if ((b.w < this.minsize[0]) || (b.h < this.minsize[1]))
        this.core.requestDelete();

        else this.sel.focus();
    }
  });
  // }}}
  // StageManager {{{
  var StageManager = function(core){
    this.core = core;
    this.init();
  };

  StageManager.defaults = {
  };

  $.extend(StageManager.prototype,{
    init: function(){
      this.setupEvents();
      this.dragger = new StageDrag(this);
    },
    startDragHandler: function(){
      var t = this;
      return function(e){
        return t.dragger.start(e);
      };
    },
    removeEvents: function(){
      this.core.container.off('.jcrop-stage');
    },
    setupEvents: function(){
      this.core.container.on('mousedown.jcrop.jcrop-stage',this.startDragHandler());
    }
  });
  // }}}
  // Selection {{{
  var Selection = function(core){
    this.core = core;
    this.init();
    this.bound = { n: 0, s: 0, e: 0, w: 0 };
  };

  Selection.defaults = {
    limitmax: [ 0, 0 ],
    limitmin: [ 8, 8 ],
    state: null,
    aspect: 0,
    active: true,
    canDelete: true,
    canDrag: true,
    canResize: true,
    canSelect: true
  };

  $.extend(Selection.prototype,{
    // init: function(){{{
    init: function(){
      var t = this;
      $.extend(t,Selection.defaults);
      t.filters = t.core.getDefaultFilters();

      t.element = $('<div />').addClass('jcrop-selection').data({ selection: t });
      t.frame = $('<button />').addClass('jcrop-box jcrop-drag').data('ord','move');
      t.element.append(t.frame).appendTo(t.core.container);

      // IE background/draggable hack
      if (t.core.opt.is_msie) t.frame.css({
        opacity: 0,
        backgroundColor: 'white'
      });

      t.insertElements();

      // Bind focus and blur events for this selection
      t.frame.on('focus.jcrop',function(e){
        t.element.trigger('cropfocus');
        t.core.setSelection(t);
        t.element.addClass('jcrop-focus');
        t.core.redraw();
      }).on('blur.jcrop',function(e){
        t.element.removeClass('jcrop-focus');
        t.element.trigger('cropblur');
      });
    },
    // }}}
    refresh: function(){
      this.allowResize();
      this.allowDrag();
      this.allowSelect();
      this.callFilterFunction('refresh');
      this.update(this.get(),'se');
    },
    callFilterFunction: function(f,args){
      for(var i=0;i<this.filters.length;i++)
        if (this.filters[i][f]) this.filters[i][f](this);
      return this;
    },
    //addFilter: function(filter){{{
    addFilter: function(filter){
      filter.core = this.core;
      if (!this.hasFilter(filter)) {
        this.filters.push(filter);
        this.sortFilters();
        if (filter.init) filter.init();
        this.refresh();
      }
    },
    //}}}
    // hasFilter: function(filter){{{
    hasFilter: function(filter){
      var i, f = this.filters, n = [];
      for(i=0;i<f.length;i++) if (f[i] === filter) return true;
    },
    // }}}
    // sortFilters: function(){{{
    sortFilters: function(){
      this.filters.sort(
        function(x,y){ return x.priority - y.priority; }
      );
    },
    // }}}
    //clearFilters: function(){{{
    clearFilters: function(){
      var i, f = this.filters;

      for(var i=0;i<f.length;i++)
        if (f[i].destroy) f[i].destroy();

      this.filters = [];
    },
    //}}}
    // removeFiltersByTag: function(tag){{{
    removeFilter: function(tag){
      var i, f = this.filters, n = [];

      for(var i=0;i<f.length;i++)
        if ((f[i].tag && (f[i].tag == tag)) || (tag === f[i])){
          if (f[i].destroy) f[i].destroy();
        }
        else n.push(f[i]);

      this.filters = n;
    },
    // }}}
    runFilters: function(b,ord){
      for(var i=0;i<this.filters.length;i++)
        b = this.filters[i].filter(b,ord,this);
      return b;
    },
    //endDrag: function(){{{
    endDrag: function(){
      if (this.state) {
        $(document.body).off('.jcrop');
        this.focus();
        this.state = null;
      }
    },
    //}}}
    //createDragState: function(x,y,ord){{{
    createDragState: function(x,y,ord){
      var b = this.get();
      this.state = new Jcrop.component.DragState(x,y,this.core.container,b.x,b.y,b.w,b.h,ord,this.filters);
    },
    //}}}
    startDrag: function(e,ord){
      var t = this;
      var m = t.core;

      ord = ord || $(e.target).data('ord');

      this.focus();

      if ((ord == 'move') && t.element.hasClass('jcrop-nodrag'))
        return false;

      this.state = new Jcrop.component.DragState(e,this,ord);
      return false;
    },
    // allowSelect: function(v){{{
    allowSelect: function(v){
      if (v === undefined) v = this.canSelect;

      if (v && this.canSelect) this.frame.attr('disabled',false);
        else this.frame.attr('disabled','disabled');

      return this;
    },
    // }}}
    // allowDrag: function(v){{{
    allowDrag: function(v){
      if (v == undefined) v = this.canDrag;

      if (v && this.canDrag) this.element.removeClass('jcrop-nodrag');
        else this.element.addClass('jcrop-nodrag');

      return this;
    },
    // }}}
    // allowResize: function(v){{{
    allowResize: function(v){
      if (v == undefined) v = this.canResize;

      if (v && this.canResize) this.element.removeClass('jcrop-noresize');
        else this.element.addClass('jcrop-noresize');

      return this;
    },
    // }}}
    remove: function(){
      this.element.remove();
    },
    toBack: function(){
      this.active = false;
      this.element
        .removeClass('jcrop-current')
        .removeClass('jcrop-focus')
        .css({zIndex:20});
    },
    toFront: function(){
      this.active = true;
      this.element
        .addClass('jcrop-current')
        .css({zIndex:30});
      this.callFilterFunction('refresh');
    },
    update: function(b,ord){
      b = this.runFilters(b,ord);
      this.moveTo(b.x,b.y);
      this.resize(b.w,b.h);
      return this;
    },
    // animateTo: function(box,cb){{{
    animateTo: function(box,cb){
      var ca = new Jcrop.component.Animator(this);
      ca.animate(box[0],box[1],box[2],box[3],cb);
    },
    // }}}
    // center: function(instant){{{
    center: function(instant){
      var b = this.get(), m = this.core;
      var elw = m.container.width(), elh = m.container.height();
      var box = [ (elw-b.w)/2, (elh-b.h)/2, b.w, b.h ];
      return this[instant?'setSelect':'animateTo'](box);
    },
    // }}}
    //createElement: function(type,ord){{{
    createElement: function(type,ord){
      return $('<div />').addClass('jcrop-'+type+' ord-'+ord).data('ord',ord);
    },
    //}}}
    //moveTo: function(x,y){{{
    moveTo: function(x,y){
      this.element.css({top: y+'px', left: x+'px'});
    },
    //}}}
    // blur: function(){{{
    blur: function(){
      this.element.blur();
      return this;
    },
    // }}}
    // focus: function(){{{
    focus: function(){
      this.core.setSelection(this);
      this.frame.focus();
      return this;
    },
    // }}}
    //resize: function(w,h){{{
    resize: function(w,h){
      this.element.css({width: w+'px', height: h+'px'});
    },
    //}}}
    //get: function(){{{
    get: function(){
      var b = this.element,
        o = b.position(),
        w = b.width(),
        h = b.height(),
        rv = { x: o.left, y: o.top };

      rv.x2 = o.left + w;
      rv.y2 = o.top + h;
      rv.w = w;
      rv.h = h;

      return rv;
    },
    //}}}
    //insertElements: function(){{{
    insertElements: function(){
      var t = this, i,
        m = t.core,
        fr = t.element,
        b = m.opt.borders,
        h = m.opt.handles,
        d = m.opt.dragbars;

      for(i=0; i<b.length; i++)
        fr.append(t.createElement('border',b[i]));

      for(i=0; i<d.length; i++)
        fr.append(t.createElement('dragbar jcrop-drag',d[i]));

      for(i=0; i<h.length; i++)
        fr.append(t.createElement('handle jcrop-drag',h[i]));
    }
    //}}}
  });
  // }}}
  var ImageLoader = function(src,element,cb){
    this.src = src;
    if (!element) element = new Image;
    this.element = element;
    this.callback = cb;
    this.load();
  };
  $.extend(ImageLoader.prototype,{
    getDimensions: function(){
      var el = this.element;

      if (el.naturalWidth)
        return [ el.naturalWidth, el. naturalHeight ];

      if (el.width)
        return [ el.width, el.height ];

      return null;
    },
    fireCallback: function(){
      if (typeof this.callback == 'function')
        this.callback.apply(this,this.getDimensions());
    },
    isLoaded: function(){
      return this.element.complete;
    },
    load: function(){
      var t = this;
      var el = t.element;

      el.src = t.src;

      if (t.isLoaded()) this.fireCallback();
        else this.element.onload = function(e){ t.fireCallback(); };
    }
  });

  /**
   *  Jcrop
   *  core cropping code
   */
  var Jcrop = function(element,opt){
    var _ua = navigator.userAgent.toLowerCase();
    this.opt = $.extend(true,{},Jcrop.defaults,opt);
    this.opt.is_msie = /msie/.test(_ua);
    this.opt.is_ie6 = /msie [1-6]\./.test(_ua);

    this.container = $(element).addClass('jcrop-active');
    this.ui = {};
    this.state = null;
    this.ui.multi = [];
    this.filters = [];
    this.newSelection();
    this.init();
  };

  $.extend(Jcrop,{
    //defaults: default settings {{{
    defaults: {
      resizable: true,
      draggable: true,
      animEasing: 'easeOutBack',
      animDuration: 400,
      borders:  [ 'n', 's', 'e', 'w' ],
      handles:  [ 'n', 's', 'e', 'w', 'sw', 'ne', 'nw', 'se' ],
      dragbars: [ 'n', 'e', 'w', 's' ]
    },
    //}}}
    //filter: built-in filter collection {{{
    filter: {
      constrain: ConstrainFilter,
      extent: ExtentFilter,
      backoff: BackoffFilter,
      shader: ShadeFilter,
      ratio: RatioFilter,
      round: RoundFilter
    },
    //}}}
    //component: internal components {{{
    component: {
      ImageLoader: ImageLoader,
      DragState: DragState,
      StageManager: StageManager,
      Animator: CropAnimator,
      Selection: Selection,
      Keyboard: KeyWatcher
    },
    //}}}
    // wrapFromXywh: function(xywh){{{
    wrapFromXywh: function(xywh){
      var b = { x: xywh[0], y: xywh[1], w: xywh[2], h: xywh[3] };
      b.x2 = b.x + b.w;
      b.y2 = b.y + b.h;
      return b;
    }
    // }}}
  });

  $.extend(Jcrop.prototype,{
    //init: function(){{{
    init: function(){
      this.initEvents();
      this.ui.keyboard = new $.Jcrop.component.Keyboard(this);
      this.ui.stage = new $.Jcrop.component.StageManager(this);
    },
    //}}}
    // getDefaultFilters: function(){{{
    getDefaultFilters: function(){
      for(var rv=[],i=0,f=this.filters,l=f.length; i<l; i++) rv.push(f[i]);
      return rv;
    },
    // }}}
    // setSelection: function(sel){{{
    setSelection: function(sel){
      var m = this.ui.multi;
      var n = [];
      for(var i=0;i<m.length;i++) {
        if (m[i] !== sel) n.push(m[i]);
        m[i].toBack();
      }
      n.unshift(sel);
      this.ui.multi = n;
      this.ui.selection = sel;
      sel.toFront();
      return sel;
    },
    // }}}
    // getSelection: function(raw){{{
    getSelection: function(raw){
      var b = this.ui.selection.get();
      if (raw) return b;
      // @todo scaled coordinates
      return b;
    },
    // }}}
    // newSelection: function(){{{
    newSelection: function(){
      var sel = new $.Jcrop.component.Selection(this);
      return this.setSelection(sel);
    },
    // }}}
    // hasSelection: function(sel){{{
    hasSelection: function(sel){
      for(var i=0;i<this.ui.multi;i++)
        if (sel === this.ui.multi[i]) return true;
    },
    // }}}
    // removeSelection: function(sel){{{
    removeSelection: function(sel){
      var i, n = [], m = this.ui.multi;
      for(var i=0;i<m.length;i++){
        if (sel !== m[i])
          n.push(m[i]);
        else m[i].remove();
      }
      return this.ui.multi = n;
    },
    // }}}
    //addFilter: function(filter){{{
    addFilter: function(filter){
      for(var i=0,m=this.ui.multi,l=m.length; i<l; i++)
        m[i].addFilter(filter);

      return this;
    },
    //}}}
    // removeFiltersByTag: function(tag){{{
    removeFilter: function(filter){
      for(var i=0,m=this.ui.multi,l=m.length; i<l; i++)
        m[i].removeFilter(filter);

      return this;
    },
    // }}}
    // blur: function(){{{
    blur: function(){
      this.ui.selection.blur();
      return this;
    },
    // }}}
    // focus: function(){{{
    focus: function(){
      this.ui.selection.focus();
      return this;
    },
    // }}}
    //initEvents: function(){{{
    initEvents: function(){
      var t = this;
      t.container.on('selectstart',function(e){ return false; })
        .on('mousedown','.jcrop-drag',t.startDrag());
    },
    //}}}
    // maxSelect: function(){{{
    maxSelect: function(){
      this.setSelect([0,0,this.elw,this.elh]);
    },
    // }}}
    // nudge: function(x,y){{{
    nudge: function(x,y){
      var b = this.getSelection(1);
      b.x += x;
      b.x2 += x;
      b.y += y;
      b.y2 += y;

      if (b.x < 0) { b.x2 = b.w; b.x = 0; }
        else if (b.x2 > this.elw) { b.x2 = this.elw; b.x = b.x2 - b.w; }

      if (b.y < 0) { b.y2 = b.h; b.y = 0; }
        else if (b.y2 > this.elh) { b.y2 = this.elh; b.y = b.y2 - b.h; }
      
      this.update(b);
    },
    // }}}
    // redraw: function(){{{
    redraw: function(){
      this.update(this.getSelection(1));
    },
    // }}}
    // blurAll: function(){{{
    blurAll: function(){
      var m = this.ui.multi;
      for(var i=0;i<m.length;i++) {
        if (m[i] !== sel) n.push(m[i]);
        m[i].toBack();
      }
    },
    // }}}
    // requestDelete: function(){{{
    requestDelete: function(){
      if ((this.ui.multi.length > 1) && (this.ui.selection.canDelete))
        return this.deleteSelection();
    },
    // }}}
    // deleteSelection: function(){{{
    deleteSelection: function(){
      this.removeSelection(this.ui.selection);
      this.ui.multi[0].focus();
      this.redraw();
    },
    // }}}
    // animateTo: function(box){{{
    animateTo: function(box){
      this.ui.selection.animateTo(box);
      return this;
    },
    // }}}
    // setselect: function(box){{{
    setSelect: function(box){
      this.ui.selection.update(Jcrop.wrapFromXywh(box));
      return this;
    },
    // }}}
    //startDrag: function(){{{
    startDrag: function(){
      var t = this;
      return function(e){
        var $targ = $(e.target);
        var selection = $targ.closest('.jcrop-selection').data('selection');
        var ord = $targ.data('ord');
        return selection.startDrag(e,ord);
        return false;
      };
    },
    //}}}
    // update: function(b){{{
    update: function(b){
      this.ui.selection.update(b);
    }
    // }}}
  });

  $.Jcrop = Jcrop;

})(jQuery);

