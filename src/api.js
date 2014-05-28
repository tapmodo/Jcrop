  // Jcrop API methods
  $.extend(Jcrop.prototype,{
    //init: function(){{{
    init: function(){
      this.event = new this.opt.eventManagerComponent(this);
      this.ui.keyboard = new this.opt.keyboardComponent(this);
      this.ui.manager = new this.opt.stagemanagerComponent(this);
      this.applyFilters();

      if ($.Jcrop.supportsTouch)
        new $.Jcrop.component.Touch(this);

      this.initEvents();
    },
    //}}}
    // applySizeConstraints: function(){{{
    applySizeConstraints: function(){
      var o = this.opt,
          img = this.opt.imgsrc;

      if (img){

        var iw = img.naturalWidth || img.width,
            ih = img.naturalHeight || img.height,
            bw = o.boxWidth || iw,
            bh = o.boxHeight || ih;

        if (img && ((iw > bw) || (ih > bh))){
          var bx = Jcrop.getLargestBox(iw/ih,bw,bh);
          $(img).width(bx[0]).height(bx[1]);
          this.resizeContainer(bx[0],bx[1]);
          this.opt.xscale = iw / bx[0];
          this.opt.yscale = ih / bx[1];
        }
          
      }

      if (this.opt.trueSize){
        var dw = this.opt.trueSize[0];
        var dh = this.opt.trueSize[1];
        var cs = this.getContainerSize();
        this.opt.xscale = dw / cs[0];
        this.opt.yscale = dh / cs[1];
      }
    },
    // }}}
    initComponent: function(name){
      if (Jcrop.component[name]) {
        var args = Array.prototype.slice.call(arguments);
        var obj = new Jcrop.component[name];
        args.shift();
        args.unshift(this);
        obj.init.apply(obj,args);
        return obj;
      }
    },
    // setOptions: function(opt){{{
    setOptions: function(opt,proptype){

      if (!$.isPlainObject(opt)) opt = {};

      $.extend(this.opt,opt);

      // Handle a setSelect value
      if (this.opt.setSelect) {

        // If there is no current selection
        // passing setSelect will create one
        if (!this.ui.multi.length)
          this.newSelection();

        // Use these values to update the current selection
        this.ui.multi[0].update(Jcrop.wrapFromXywh(this.opt.setSelect));
        // Set to null so it doesn't get called again
        this.opt.setSelect = null;
      }

      this.event.trigger('configupdate');
      return this;
    },
    // }}}
    //destroy: function(){{{
    destroy: function(){
      if (this.opt.imgsrc) {
        this.container.before(this.opt.imgsrc);
        this.container.remove();
        $(this.opt.imgsrc).removeData('Jcrop');
      } else {
        // @todo: more elegant destroy() process for non-image containers
        this.container.remove();
      }
    },
    // }}}
    // applyFilters: function(){{{
    applyFilters: function(){
      var obj;
      for(var i=0,f=this.opt.applyFilters,l=f.length; i<l; i++){
        if ($.Jcrop.filter[f[i]])
          obj = new $.Jcrop.filter[f[i]];
          obj.core = this;
          if (obj.init) obj.init();
          this.filter[f[i]] = obj;
      }
    },
    // }}}
    // getDefaultFilters: function(){{{
    getDefaultFilters: function(){
      var rv = [];

      for(var i=0,f=this.opt.applyFilters,l=f.length; i<l; i++)
        if(this.filter.hasOwnProperty(f[i]))
          rv.push(this.filter[f[i]]);

      rv.sort(function(x,y){ return x.priority - y.priority; });
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
      return b;
    },
    // }}}
    // newSelection: function(){{{
    newSelection: function(sel){
      if (!sel)
        sel = new this.opt.selectionComponent();

      sel.init(this);
      this.setSelection(sel);

      return sel;
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
        .on('mousedown','.'+t.opt.css_drag,t.startDrag());
    },
    //}}}
    // maxSelect: function(){{{
    maxSelect: function(){
      this.setSelect([0,0,this.elw,this.elh]);
    },
    // }}}
    // nudge: function(x,y){{{
    nudge: function(x,y){
      var s = this.ui.selection, b = s.get();

      b.x += x;
      b.x2 += x;
      b.y += y;
      b.y2 += y;

      if (b.x < 0) { b.x2 = b.w; b.x = 0; }
        else if (b.x2 > this.elw) { b.x2 = this.elw; b.x = b.x2 - b.w; }

      if (b.y < 0) { b.y2 = b.h; b.y = 0; }
        else if (b.y2 > this.elh) { b.y2 = this.elh; b.y = b.y2 - b.h; }
      
      s.element.trigger('cropstart',[s,this.unscale(b)]);
      s.updateRaw(b,'move');
      s.element.trigger('cropend',[s,this.unscale(b)]);
    },
    // }}}
    // refresh: function(){{{
    refresh: function(){
      for(var i=0,s=this.ui.multi,l=s.length;i<l;i++)
        s[i].refresh();
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
    // scale: function(b){{{
    scale: function(b){
      var xs = this.opt.xscale,
          ys = this.opt.yscale;

      return {
        x: b.x / xs,
        y: b.y / ys,
        x2: b.x2 / xs,
        y2: b.y2 / ys,
        w: b.w / xs,
        h: b.h / ys
      };
    },
    // }}}
    // unscale: function(b){{{
    unscale: function(b){
      var xs = this.opt.xscale,
          ys = this.opt.yscale;

      return {
        x: b.x * xs,
        y: b.y * ys,
        x2: b.x2 * xs,
        y2: b.y2 * ys,
        w: b.w * xs,
        h: b.h * ys
      };
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
      if (this.ui.selection) {
        this.removeSelection(this.ui.selection);
        this.ui.multi[0].focus();
        this.ui.selection.refresh();
      }
    },
    // }}}
    // animateTo: function(box){{{
    animateTo: function(box){
      if (this.ui.selection)
        this.ui.selection.animateTo(box);
      return this;
    },
    // }}}
    // setselect: function(box){{{
    setSelect: function(box){
      if (this.ui.selection)
        this.ui.selection.update(Jcrop.wrapFromXywh(box));
      return this;
    },
    // }}}
    //startDrag: function(){{{
    startDrag: function(){
      var t = this;
      return function(e){
        var $targ = $(e.target);
        var selection = $targ.closest('.'+t.opt.css_selection).data('selection');
        var ord = $targ.data('ord');
        t.container.trigger('cropstart',[selection,t.unscale(selection.get())]);
        selection.startDrag(e,ord);
        return false;
      };
    },
    //}}}
    // getContainerSize: function(){{{
    getContainerSize: function(){
      return [ this.container.width(), this.container.height() ];
    },
    // }}}
    // resizeContainer: function(w,h){{{
    resizeContainer: function(w,h){
      this.container.width(w).height(h);
      this.refresh();
    },
    // }}}
    // setImage: function(src,cb){{{
    setImage: function(src,cb){
      var t = this, targ = t.opt.imgsrc;

      if (!targ) return false;

      new $.Jcrop.component.ImageLoader(src,null,function(w,h){
        t.resizeContainer(w,h);

        targ.src = src;
        $(targ).width(w).height(h);
        t.applySizeConstraints();
        t.refresh();
        t.container.trigger('cropimage',[t,targ]);

        if (typeof cb == 'function')
          cb.call(t,w,h);
      });
    },
    // }}}
    // update: function(b){{{
    update: function(b){
      if (this.ui.selection)
        this.ui.selection.update(b);
    }
    // }}}
  });
