  /**
   * Selection
   * Built-in selection object
   */
  var Selection = function(){};

  $.extend(Selection,{
    // defaults: {{{
    defaults: {
      minSize: [ 8, 8 ],
      maxSize: [ 0, 0 ],
      aspectRatio: 0,
      edge: { n: 0, s: 0, e: 0, w: 0 },
      bgColor: null,
      bgOpacity: null,
      last: null,

      state: null,
      active: true,
      linked: true,
      canDelete: true,
      canDrag: true,
      canResize: true,
      canSelect: true
    },
    // }}}
    prototype: {
      // init: function(core){{{
      init: function(core){
        this.core = core;
        this.startup();
        this.linked = this.core.opt.linked;
        this.attach();
        this.setOptions(this.core.opt);
        core.container.trigger('cropcreate',[this]);
      },
      // }}}
      // attach: function(){{{
      attach: function(){
        // For extending init() sequence
      },
      // }}}
      // startup: function(){{{
      startup: function(){
        var t = this, o = t.core.opt;
        $.extend(t,Selection.defaults);
        t.filter = t.core.getDefaultFilters();

        t.element = $('<div />').addClass(o.css_selection).data({ selection: t });
        t.frame = $('<button />').addClass(o.css_button).data('ord','move').attr('type','button');
        t.element.append(t.frame).appendTo(t.core.container);

        // IE background/draggable hack
        if (t.core.opt.is_msie) t.frame.css({
          opacity: 0,
          backgroundColor: 'white'
        });

        t.insertElements();

        // Bind focus and blur events for this selection
        t.frame.on('focus.jcrop',function(e){
          t.core.setSelection(t);
          t.element.trigger('cropfocus',t);
          t.element.addClass('jcrop-focus');
        }).on('blur.jcrop',function(e){
          t.element.removeClass('jcrop-focus');
          t.element.trigger('cropblur',t);
        });
      },
      // }}}
      // propagate: [{{{
      propagate: [
        'canDelete', 'canDrag', 'canResize', 'canSelect',
        'minSize', 'maxSize', 'aspectRatio', 'edge'
      ],
      // }}}
      // setOptions: function(opt){{{
      setOptions: function(opt){
        Jcrop.propagate(this.propagate,opt,this);
        this.refresh();
        return this;
      },
      // }}}
      // refresh: function(){{{
      refresh: function(){
        this.allowResize();
        this.allowDrag();
        this.allowSelect();
        this.callFilterFunction('refresh');
        this.updateRaw(this.get(),'se');
      },
      // }}}
      // callFilterFunction: function(f,args){{{
      callFilterFunction: function(f,args){
        for(var i=0;i<this.filter.length;i++)
          if (this.filter[i][f]) this.filter[i][f](this);
        return this;
      },
      // }}}
      //addFilter: function(filter){{{
      addFilter: function(filter){
        filter.core = this.core;
        if (!this.hasFilter(filter)) {
          this.filter.push(filter);
          this.sortFilters();
          if (filter.init) filter.init();
          this.refresh();
        }
      },
      //}}}
      // hasFilter: function(filter){{{
      hasFilter: function(filter){
        var i, f = this.filter, n = [];
        for(i=0;i<f.length;i++) if (f[i] === filter) return true;
      },
      // }}}
      // sortFilters: function(){{{
      sortFilters: function(){
        this.filter.sort(
          function(x,y){ return x.priority - y.priority; }
        );
      },
      // }}}
      //clearFilters: function(){{{
      clearFilters: function(){
        var i, f = this.filter;

        for(var i=0;i<f.length;i++)
          if (f[i].destroy) f[i].destroy();

        this.filter = [];
      },
      //}}}
      // removeFiltersByTag: function(tag){{{
      removeFilter: function(tag){
        var i, f = this.filter, n = [];

        for(var i=0;i<f.length;i++)
          if ((f[i].tag && (f[i].tag == tag)) || (tag === f[i])){
            if (f[i].destroy) f[i].destroy();
          }
          else n.push(f[i]);

        this.filter = n;
      },
      // }}}
      // runFilters: function(b,ord){{{
      runFilters: function(b,ord){
        for(var i=0;i<this.filter.length;i++)
          b = this.filter[i].filter(b,ord,this);
        return b;
      },
      // }}}
      //endDrag: function(){{{
      endDrag: function(){
        if (this.state) {
          $(document.body).off('.jcrop');
          this.focus();
          this.state = null;
        }
      },
      //}}}
      // startDrag: function(e,ord){{{
      startDrag: function(e,ord){
        var t = this;
        var m = t.core;

        ord = ord || $(e.target).data('ord');

        this.focus();

        if ((ord == 'move') && t.element.hasClass(t.core.opt.css_nodrag))
          return false;

        this.state = new Jcrop.component.DragState(e,this,ord);
        return false;
      },
      // }}}
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
        var t = this, o = t.core.opt;
        if (v == undefined) v = t.canDrag;

        if (v && t.canDrag) t.element.removeClass(o.css_nodrag);
          else t.element.addClass(o.css_nodrag);

        return this;
      },
      // }}}
      // allowResize: function(v){{{
      allowResize: function(v){
        var t = this, o = t.core.opt;
        if (v == undefined) v = t.canResize;

        if (v && t.canResize) t.element.removeClass(o.css_noresize);
          else t.element.addClass(o.css_noresize);

        return this;
      },
      // }}}
      // remove: function(){{{
      remove: function(){
        this.element.trigger('cropremove',this);
        this.element.remove();
      },
      // }}}
      // toBack: function(){{{
      toBack: function(){
        this.active = false;
        this.element.removeClass('jcrop-current jcrop-focus');
      },
      // }}}
      // toFront: function(){{{
      toFront: function(){
        this.active = true;
        this.element.addClass('jcrop-current');
        this.callFilterFunction('refresh');
        this.refresh();
      },
      // }}}
      // redraw: function(b){{{
      redraw: function(b){
        this.moveTo(b.x,b.y);
        this.resize(b.w,b.h);
        this.last = b;
        return this;
      },
      // }}}
      // update: function(b,ord){{{
      update: function(b,ord){
        return this.updateRaw(this.core.scale(b),ord);
      },
      // }}}
      // update: function(b,ord){{{
      updateRaw: function(b,ord){
        b = this.runFilters(b,ord);
        this.redraw(b);
        this.element.trigger('cropmove',[this,this.core.unscale(b)]);
        return this;
      },
      // }}}
      // animateTo: function(box,cb){{{
      animateTo: function(box,cb){
        var ca = new Jcrop.component.Animator(this),
            b = this.core.scale(Jcrop.wrapFromXywh(box));

        ca.animate(b.x,b.y,b.w,b.h,cb);
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
        return $('<div />').addClass(type+' ord-'+ord).data('ord',ord);
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

        rv.x2 = rv.x + w;
        rv.y2 = rv.y + h;
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
          o = t.core.opt,
          b = o.borders,
          h = o.handles,
          d = o.dragbars;

        for(i=0; i<d.length; i++)
          fr.append(t.createElement(o.css_dragbars,d[i]));

        for(i=0; i<h.length; i++)
          fr.append(t.createElement(o.css_handles,h[i]));

        for(i=0; i<b.length; i++)
          fr.append(t.createElement(o.css_borders,b[i]));
      }
      //}}}
    }
  });
  Jcrop.registerComponent('Selection',Selection);

