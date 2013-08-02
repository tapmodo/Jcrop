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
  };

  $.extend(DragState.prototype,{
    //update: function(x,y){{{
    update: function(x,y){
      var t = this;
      t.offsetx = x - t.x;
      t.offsety = y - t.y;
    },
    //}}}
    //resultWrap: function(d){{{
    resultWrap: function(d){
      var f = this.filters,
        b = {
          x: Math.min(d[0],d[2]),
          y: Math.min(d[1],d[3]),
          x2: Math.max(d[0],d[2]),
          y2: Math.max(d[1],d[3])
        };

      b.w = b.x2 - b.x;
      b.h = b.y2 - b.y;

      for(var i=0;i<f.length;i++)
        b = f[i].filter(b);

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
  // ConstrainFilter {{{
  /**
   *  ConstrainFilter
   *  a filter to constrain crop selection to bounding element
   */
  var ConstrainFilter = function(){
    this.master = null;
  };
  $.extend(ConstrainFilter.prototype,{
    filter: function(b,raw){
      var m = this.master, st = m.state;
      if (raw) return b;
      if (st.ord == 'move') {
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
    filter: function(b,raw){
      var rt = b.w / b.h;
      var m = this.master;
      if (raw) return b;
      if (m.state.ord == 'move') return b;
      if (rt < 1) {
        if (rt < this.ratio) {
          b.x2 = b.y2 * this.ratio;
          console.log('n1 ok');
        } else {
          console.log('n2 ok');
          b.y2 = b.x2 / this.ratio;
          b.y2 = b.x2 / this.ratio;
        }
      }
      else {
        if (rt > this.ratio) {
          console.log('n3');
          b.y2 = b.x2 / this.ratio;
        } else {
          console.log('n4');
          b.x2 = b.y2 * this.ratio;
        }
      }
      if (b.y2 > m.elh) {
        if (this.ratio < 1){
          b.y2 = m.elh;
          b.x2 = (b.y2 - b.y) * this.ratio;
        }
      }
      b.w = b.x2 - b.x;
      b.h = b.y2 - b.y;
      return b;
    }
  });
  // }}}
  // ShadeFilter {{{
  /**
   *  ShadeFilter
   *  A filter that implements div-based shading on any element
   */
  var ShadeFilter = function(){
    this.master = null;
    this.shades = {};
  };
  $.extend(ShadeFilter.prototype,{
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

      t.filter(this.master.getSelectionRaw());
    },
    destroy: function(){
      this.container.remove();
    },
    createShade: function(){
      return $('<div />').css({
        position: 'absolute',
        backgroundColor: 'black',
        opacity: .5
      }).appendTo(this.container);
    },
    filter: function(b,raw){
      var t = this,
        m = t.master,
        s = t.shades;
      
      s.top.css({
        left: b.x+'px',
        width: b.w+'px',
        height: b.y+'px'
      });
      s.bottom.css({
        top: b.y2+'px',
        left: b.x+'px',
        width: b.w+'px',
        height: (m.elh-b.y2)+'px'
      });
      s.right.css({
        height: m.elh+'px',
        left: b.x2+'px',
        width: (m.elw-b.x2)+'px'
      });
      s.left.css({
        height: m.elh+'px',
        width: b.x+'px'
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
    animate: function(x,y,w,h){
      var t = this;
      t.addElement();
      t.element.animate({
        top: y+'px',
        left: x+'px',
        width: w+'px',
        height: h+'px'
      },{
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

  /**
   *  CropBox
   *  core cropping code
   */
  var CropBox = function(element,opt){
    this.ui = {
      cropper: $('<div />').addClass('jcrop-selection'),
      box: $('<div />').addClass('jcrop-box jcrop-drag').data('ord','move')
    };
    this.container = $(element).append(this.ui.cropper.append(this.ui.box)).addClass('jcrop-active');
    this.opt = $.extend({},CropBox.defaults,opt);
    this.state = null;
    this.filters = [];
    this.init();
  };

  $.extend(CropBox,{
    //defaults: default settings {{{
    defaults: {
      borders:  [ 'n', 's', 'e', 'w' ],
      handles:  [ 'n', 's', 'e', 'w', 'nw', 'ne', 'sw', 'se' ],
      dragbars: [ 'n', 's', 'e', 'w' ]
    },
    //}}}
    //filter: built-in filter collection {{{
    filter: {
      constrain: ConstrainFilter,
      shader: ShadeFilter,
      ratio: RatioFilter
    },
    //}}}
    //components: internal components {{{
    component: {
      DragState: DragState,
      Animator: CropAnimator
    }
    //}}}
  });

  $.extend(CropBox.prototype,{
    //init: function(){{{
    init: function(){
      this.insertElements();
      this.initEvents();
    },
    //}}}
    callFiltersRaw: function(props){
      var f = this.filters;
      var b = {
        x: parseFloat(props.left),
        y: parseFloat(props.top),
        w: parseFloat(props.width),
        h: parseFloat(props.height)
      };

      b.x2 = b.x + b.w;
      b.y2 = b.y + b.h;

      for(var i=0;i<f.length;i++)
        b = f[i].filter(b,1);

      return b;
    },
    animateTo: function(box){
      var i = 0, t = this;
      this.ui.cropper.animate({
        left: box[0]+'px',
        top: box[1]+'px',
        width: box[2]+'px',
        height: box[3]+'px'
      },{
        progress: function(anim){
          var props = {}, i, tw = anim.tweens;

          for(i=0;i<tw.length;i++){
            props[tw[i].prop] = tw[i].now; }

          t.callFiltersRaw(props);
        }
      });
    },
    //addFilter: function(filter){{{
    addFilter: function(filter){
      this.elw = this.container.width();
      this.elh = this.container.height();
      filter.master = this;
      this.filters.push(filter);
      if (filter.init) filter.init();
    },
    //}}}
    //clearFilters: function(){{{
    clearFilters: function(){
      var i, f = this.filters;

      for(var i=0;i<f.length;i++)
        if (f[i].destroy) f[i].destroy();

      this.filters = [];
    },
    //}}}
    //initEvents: function(){{{
    initEvents: function(){
      var t = this;
      t.container.on('selectstart',function(e){ return false; })
        .on('mousedown','.jcrop-drag',t.startDrag());
    },
    //}}}
    //moveTo: function(x,y){{{
    moveTo: function(x,y){
      this.ui.cropper.css({top: y+'px', left: x+'px'});
    },
    //}}}
    //resize: function(w,h){{{
    resize: function(w,h){
      this.ui.cropper.css({width: w+'px', height: h+'px'});
    },
    //}}}
    //startDrag: function(){{{
    startDrag: function(){
      var t = this;
      return function(e){
        var $targ = $(e.target);
        t.createDragState(e.pageX,e.pageY,$targ.data('ord'));

        $(document.body).on('mousemove.jcrop',t.createDragHandler($targ))
          .on('mouseup.jcrop',function(e){ t.endDrag(); });

        return false;
      };
    },
    //}}}
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
    //createDragState: function(x,y,ord){{{
    createDragState: function(x,y,ord){
      var b = this.getSelectionRaw();
      this.elw = this.container.width();
      this.elh = this.container.height();
      this.state = new CropBox.component.DragState(x,y,this.container,b.x,b.y,b.w,b.h,ord,this.filters);
    },
    //}}}
    redraw: function(){
      var b = this.getSelectionRaw(),
        f = this.filters;
      
      for(var i=0;i<f.length;i++)
        b = f[i].filter(b);

      this.resize(b.w,b.h);
      this.moveTo(b.x,b.y);
    },
    //redrawState: function(){{{
    redrawState: function(){
      var b = this.state.getBox();
      this.resize(b.w,b.h);
      this.moveTo(b.x,b.y);
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
    //endDrag: function(){{{
    endDrag: function(){
      if (this.state) {
        $(document.body).off('.jcrop');
        this.state = null;
      }
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
    //createElement: function(type,ord){{{
    createElement: function(type,ord){
      return $('<div />').addClass('jcrop-'+type+' ord-'+ord).data('ord',ord);
    }
    //}}}
  });

  $.CropBox = CropBox;

})(jQuery);

