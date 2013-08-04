(function($){

  // DragState {{{
  /**
   *  DragState
   *  an object that handles dragging events
   */
  var DragState = function(cx,cy,$box,bx,by,bw,bh,ord,filters){
    var t = this;
    t.x = cx;
    t.y = cy;
    var p = $box.position();
    t.elx = p.left;
    t.ely = p.top;
    t.bx = parseInt(bx);
    t.by = parseInt(by);
    t.bw = parseInt(bw);
    t.bh = parseInt(bh);
    t.offsetx = 0;
    t.offsety = 0;
    t.ord = ord;
    t.filters = filters;
    t.opposite = t.getOppositeCornerOffset();

    for(var i=0;i<filters.length;i++)
      if (filters[i].preDrag) filters[i].preDrag(t);
  };

  $.extend(DragState.prototype,{
    // getOppositeCornerOffset: function(){{{
    // Calculate relative offset of locked corner
    getOppositeCornerOffset: function(){

      var relx = this.x - this.elx - this.bx;
      var rely = this.y - this.ely - this.by;

      switch(this.ord){
        case 'nw':
        case 'w':
          return [ this.bw - relx, this.bh - rely ];

        case 'sw':
          return [ this.bw - relx, -rely ];

        case 'se':
        case 's':
        case 'e':
          return [ -relx, -rely ];

        case 'ne':
        case 'n':
          return [ -relx, this.bh - rely ];
      }

      return [ null, null ];
    },
    // }}}
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
      var _c = { x2: t.bx + t.bw, y2: t.by + t.bh };
      switch(t.ord){
        case 'n': return t.resultWrap([ t.bx, t.offsety + t.by, _c.x2, _c.y2 ]);
        case 's': return t.resultWrap([ t.bx, t.by, _c.x2, t.offsety + _c.y2 ]);
        case 'e': return t.resultWrap([ t.bx, t.by, t.offsetx + _c.x2, _c.y2 ]);
        case 'w': return t.resultWrap([ t.bx + t.offsetx, t.by, _c.x2, _c.y2 ]);
        case 'sw': return t.resultWrap([ t.offsetx + t.bx, t.by, _c.x2, t.offsety + _c.y2 ]);
        case 'se': return t.resultWrap([ t.bx, t.by, t.offsetx + _c.x2, t.offsety + _c.y2 ]);
        case 'ne': return t.resultWrap([ t.bx, t.offsety + t.by, t.offsetx + _c.x2, _c.y2 ]);
        case 'nw': return t.resultWrap([ t.offsetx + t.bx, t.offsety + t.by, _c.x2, _c.y2 ]);
        case 'move':
          _c.nx = t.bx + t.offsetx;
          _c.ny = t.by + t.offsety;
          return t.resultWrap([ _c.nx, _c.ny, _c.nx + t.bw, _c.ny + t.bh ]);
      }
    }
    //}}}
  });
  // }}}
  // RoundFilter {{{
  /**
   *  RoundFilter
   *  a filter to constrain crop selection to bounding element
   */
  var RoundFilter = function(){
    this.master = null;
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
  // ConstrainFilter {{{
  /**
   *  ConstrainFilter
   *  a filter to constrain crop selection to bounding element
   */
  var ConstrainFilter = function(){
    this.master = null;
  };
  $.extend(ConstrainFilter.prototype,{
    priority: 5,
    filter: function(b){
      var m = this.master, st = m.state;
      if (st && st.ord && (st.ord == 'move')) {
        if (b.x < 0) { b.x = 0; b.x2 = b.w; }
        if (b.y < 0) { b.y = 0; b.y2 = b.h; }
        if (b.x2 > m.elw) { b.x2 = m.elw; b.x = b.x2 - st.bw; }
        if (b.y2 > m.elh) { b.y2 = m.elh; b.y = b.y2 - st.bh; }
      } else {
        if (b.x < 0) { b.x = 0; }
        if (b.y < 0) { b.y = 0; }
        if (b.x2 > m.elw) { b.x2 = m.elw; }
        if (b.y2 > m.elh) { b.y2 = m.elh; }
      }
      b.w = b.x2 - b.x;
      b.h = b.y2 - b.y;
      return b;
    }
  });
  // }}}
  // RatioFilter {{{
  /**
   *  RatioFilter
   *  a filter to implement aspect ratio (not working yet)
   */
  var RatioFilter = function(ratio){
    this.ratio = ratio;
    this.master = null;
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
    filter: function(b){
      var rt = b.w / b.h;
      var m = this.master;
      var st = m.state;

      var quad = st? this.getQuadrant(st): 'br';
      var ord = (st && st.ord) ? st.ord: 'se';

      if (ord == 'move') return b;

      switch(this.ord) {
        case 'n':
          b.x2 = m.elw;
          b.w = b.x2 - b.x;
          quad = 'tr';
          break;
        case 's':
          b.x2 = m.elw;
          b.w = b.x2 - b.x;
          quad = 'br';
          break;
        case 'e':
          b.y2 = m.elh;
          b.h = b.y2 - b.y;
          quad = 'br';
          break;
        case 'w':
          b.y2 = m.elh;
          b.h = b.y2 - b.y;
          quad = 'bl';
          break;
      }

      return this.getBoundRatio(b,quad);
    }
  });
  // }}}
  // ShadeFilter {{{
  /**
   *  ShadeFilter
   *  A filter that implements div-based shading on any element
   */
  var ShadeFilter = function(opacity,color){
    this.color = color || 'black';
    this.opacity = opacity || 0.5;
    this.master = null;
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
      t.visible = false;

      t.container = $('<div />').addClass('jcrop-shades')
        .appendTo(this.master.container).hide();

      t.elh = this.master.container.height();
      t.elw = this.master.container.width();

      t.shades = {
        top: t.createShade(),
        right: t.createShade(),
        left: t.createShade(),
        bottom: t.createShade()
      };

      t.reheighten();
      t.filter(this.master.getSelectionRaw());
    },
    reheighten: function(){
      var m = this.master, s = this.shades;
      this.elh = m.elh;
      this.elw = m.elw;
      s.right.css('height',m.elh+'px');
      s.left.css('height',m.elh+'px');
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
    preDrag: function(st){
      this.reheighten();
    },
    filter: function(b){
      var t = this,
        m = t.master,
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
   */
  var CropAnimator = function(master){
    this.master = master;
  };

  $.extend(CropAnimator.prototype,{
    addElement: function(){
      var b = this.master.getSelectionRaw();
      this.element = $('<div />')
        .css({
          position: 'absolute',
          top: b.y+'px',
          left: b.x+'px',
          width: b.w+'px',
          height: b.h+'px'
        });

      this.master.container.append(this.element);
    },
    removeElement: function(){
      this.element.remove();
    },
    animate: function(x,y,w,h,cb){
      var t = this;
      t.master.allowResize(false);
      t.addElement();
      t.element.animate({
        top: y+'px',
        left: x+'px',
        width: w+'px',
        height: h+'px'
      },{
        easing: t.master.opt.animEasing,
        duration: t.master.opt.animDuration,
        complete: function(){
          t.master.allowResize(true);
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

          t.master.update(b);
        }
      });
      t.removeElement();
    }
  });
  // }}}
  // KeyWatcher {{{
  /**
   *  KeyWatcher
   *  provides keyboard support
   */
  var KeyWatcher = function(master){
    this.master = master;
    this.init();
  };

  KeyWatcher.defaults = {
    passthru: [ 9 ],
    debug: false
  };

  $.extend(KeyWatcher.prototype,{
    init: function(){
      $.extend(this,KeyWatcher.defaults);
      this.initEvents();
    },
    initEvents: function(){
      var t = this, m = t.master;
      m.container.on('keydown',function(e){
        var nudge = e.shiftKey? 16: 2;

        if ($.inArray(e.keyCode,t.passthru) >= 0)
          return true;

        switch(e.keyCode){
          case 37: m.nudge(-nudge,0); break;
          case 38: m.nudge(0,-nudge); break;
          case 39: m.nudge(nudge,0); break;
          case 40: m.nudge(0,nudge); break;
          default: if (t.debug) console.log('keycode: ' + e.keyCode);
        }

        if (!e.metaKey && !e.ctrlKey)
          e.preventDefault();
      });
    }
  });
  // }}}

  /**
   *  Jcrop
   *  core cropping code
   */
  var Jcrop = function(element,opt){
    this.ui = {
      cropper: $('<button />').addClass('jcrop-selection'),
      box: $('<div />').addClass('jcrop-box jcrop-drag').data('ord','move')
    };
    this.container = $(element).append(this.ui.cropper.append(this.ui.box)).addClass('jcrop-active');
    this.opt = $.extend({},Jcrop.defaults,opt);
    this.state = null;
    this.filters = [];
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
      shader: ShadeFilter,
      ratio: RatioFilter,
      round: RoundFilter
    },
    //}}}
    //components: internal components {{{
    component: {
      DragState: DragState,
      Animator: CropAnimator,
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
      this.insertElements();
      this.initEvents();
    },
    //}}}
    //addFilter: function(filter){{{
    addFilter: function(filter){
      this.elw = this.container.width();
      this.elh = this.container.height();
      filter.master = this;
      if (!this.hasFilter(filter)) {
        this.filters.push(filter);
        this.sortFilters();
        if (filter.init) filter.init();
        this.redraw();
      }
    },
    //}}}
    // allowDrag: function(v){{{
    allowDrag: function(v){
      if (v == undefined) v = this.opt.draggable;

      if (v && this.opt.draggable) this.container.removeClass('jcrop-nodrag');
        else this.container.addClass('jcrop-nodrag');

      return this;
    },
    // }}}
    // allowResize: function(v){{{
    allowResize: function(v){
      if (v == undefined) v = this.opt.resizable;

      if (v && this.opt.resizable) this.container.removeClass('jcrop-noresize');
        else this.container.addClass('jcrop-noresize');

      return this;
    },
    // }}}
    // animateTo: function(box,cb){{{
    animateTo: function(box,cb){
      var ca = new Jcrop.component.Animator(this);
      ca.animate(box[0],box[1],box[2],box[3],cb);
    },
    // }}}
    // blur: function(){{{
    blur: function(){
      this.ui.cropper.blur();
      return this;
    },
    // }}}
    // centerSelection: function(instant){{{
    centerSelection: function(instant){
      var b = this.getSelectionRaw();
      var box = [ (this.elw-b.w)/2, (this.elh-b.h)/2, b.w, b.h ];
      return this[instant?'setSelect':'animateTo'](box);
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
    //createDragHandler: function($targ){{{
    createDragHandler: function($targ){
      var t = this;
      return function(e){
        t.state.update(e.pageX,e.pageY);
        t.redrawState();
      };
    },
    //}}}
    //createDragState: function(x,y,ord){{{
    createDragState: function(x,y,ord){
      var b = this.getSelectionRaw();
      this.elw = this.container.width();
      this.elh = this.container.height();
      this.state = new Jcrop.component.DragState(x,y,this.container,b.x,b.y,b.w,b.h,ord,this.filters);
    },
    //}}}
    //createElement: function(type,ord){{{
    createElement: function(type,ord){
      return $('<div />').addClass('jcrop-'+type+' ord-'+ord).data('ord',ord);
    },
    //}}}
    //endDrag: function(){{{
    endDrag: function(){
      if (this.state) {
        $(document.body).off('.jcrop');
        this.focus();
        this.state = null;
      }
    },
    //}}}
    // focus: function(){{{
    focus: function(){
      this.ui.cropper.focus();
      return this;
    },
    // }}}
    //getSelectionRaw: function(){{{
    getSelectionRaw: function(){
      var b = this.ui.cropper,
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
    // hasFilter: function(filter){{{
    hasFilter: function(filter){
      var i, f = this.filters, n = [];
      for(i=0;i<f.length;i++) if (f[i] === filter) return true;
    },
    // }}}
    //initEvents: function(){{{
    initEvents: function(){
      var t = this;
      t.container.on('selectstart',function(e){ return false; })
        .on('mousedown','.jcrop-drag',t.startDrag());
    },
    //}}}
    //insertElements: function(){{{
    insertElements: function(){
      var t = this, i,
        b = t.opt.borders,
        h = t.opt.handles,
        d = t.opt.dragbars;

      for(i=0; i<b.length; i++)
        t.ui.box.append(t.createElement('border',b[i]));

      for(i=0; i<d.length; i++)
        t.ui.box.append(t.createElement('dragbar jcrop-drag',d[i]));

      for(i=0; i<h.length; i++)
        t.ui.box.append(t.createElement('handle jcrop-drag',h[i]));
    },
    //}}}
    // maxSelect: function(){{{
    maxSelect: function(){
      this.setSelect([0,0,this.elw,this.elh]);
    },
    // }}}
    //moveTo: function(x,y){{{
    moveTo: function(x,y){
      this.ui.cropper.css({top: y+'px', left: x+'px'});
    },
    //}}}
    // nudge: function(x,y){{{
    nudge: function(x,y){
      var b = this.getSelectionRaw();
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
    //resize: function(w,h){{{
    resize: function(w,h){
      this.ui.cropper.css({width: w+'px', height: h+'px'});
    },
    //}}}
    // redraw: function(){{{
    redraw: function(){
      this.update(this.getSelectionRaw());
    },
    // }}}
    //redrawState: function(){{{
    redrawState: function(){
      var b = this.state.getBox();
      this.update(this.state.getBox());
    },
    //}}}
    // removeFiltersByTag: function(tag){{{
    removeFiltersByTag: function(tag){
      var i, f = this.filters, n = [];

      for(var i=0;i<f.length;i++)
        if ((f[i].tag && (f[i].tag == tag)) || (tag === f[i])){
          if (f[i].destroy) f[i].destroy();
        }
        else n.push(f[i]);

      this.filters = n;
    },
    // }}}
    // setSelect: function(box){{{
    setSelect: function(box){
      this.update(Jcrop.wrapFromXywh(box));
      return this;
    },
    // }}}
    // sortFilters: function(){{{
    sortFilters: function(){
      this.filters.sort(
        function(x,y){ return x.priority - y.priority; }
      );
    },
    // }}}
    //startDrag: function(){{{
    startDrag: function(){
      var t = this;
      return function(e){
        var $targ = $(e.target);
        var ord = $targ.data('ord');

        if ((ord == 'move') && t.container.hasClass('jcrop-nodrag'))
          return false;

        t.createDragState(e.pageX,e.pageY,ord);

        $(document.body).on('mousemove.jcrop',t.createDragHandler($targ))
          .on('mouseup.jcrop',function(e){ t.endDrag(); });

        return false;
      };
    },
    //}}}
    // update: function(b){{{
    update: function(b){
      var f = this.filters;

      for(var i=0;i<f.length;i++)
        b = f[i].filter(b);

      this.resize(b.w,b.h);
      this.moveTo(b.x,b.y);

      this.container.trigger('cropmove',b);
    }
    // }}}
  });

  $.Jcrop = Jcrop;

})(jQuery);

