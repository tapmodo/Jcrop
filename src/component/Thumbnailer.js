  var Thumbnailer = function(){
  };

  $.extend(Thumbnailer,{
    defaults: {
      // Set to a specific Selection object
      // If this value is set, the preview will only track that Selection
      selection: null,

      fading: true,
      fadeDelay: 1000,
      fadeDuration: 1000,
      autoHide: false,
      width: 80,
      height: 80,
      _hiding: null
    },

    prototype: {
      recopyCanvas: function(){
        var s = this.core.ui.stage, cxt = s.context;
        this.context.putImageData(cxt.getImageData(0,0,s.canvas.width,s.canvas.height),0,0);
      },
      init: function(core,options){
        var t = this;
        this.core = core;
        $.extend(this,Thumbnailer.defaults,options);
        t.initEvents();
        t.refresh();
        t.insertElements();
        if (t.selection) {
          t.renderSelection(t.selection);
          t.selectionTarget = t.selection.element[0];
        } else if (t.core.ui.selection) {
          t.renderSelection(t.core.ui.selection);
        }

        if (t.core.ui.stage.canvas) {
          t.context = t.preview[0].getContext('2d');
          t.core.container.on('cropredraw',function(e){
            t.recopyCanvas();
            t.refresh();
          });
        }
      },
      updateImage: function(imgel){
        this.preview.remove();
        this.preview = $($.Jcrop.imageClone(imgel));
        this.element.append(this.preview);
        this.refresh();
        return this;
      },
      insertElements: function(){
        this.preview = $($.Jcrop.imageClone(this.core.ui.stage.imgsrc));

        this.element = $('<div />').addClass('jcrop-thumb')
          .width(this.width).height(this.height)
          .append(this.preview)
          .appendTo(this.core.container);
      },
      resize: function(w,h){
        this.width = w;
        this.height = h;
        this.element.width(w).height(h);
        this.renderCoords(this.last);
      },
      refresh: function(){
        this.cw = (this.core.opt.xscale * this.core.container.width());
        this.ch = (this.core.opt.yscale * this.core.container.height());
        if (this.last) {
          this.renderCoords(this.last);
        }
      },
      renderCoords: function(c){
        var rx = this.width / c.w;
        var ry = this.height / c.h;

        this.preview.css({
          width: Math.round(rx * this.cw) + 'px',
          height: Math.round(ry * this.ch) + 'px',
          marginLeft: '-' + Math.round(rx * c.x) + 'px',
          marginTop: '-' + Math.round(ry * c.y) + 'px'
        });

        this.last = c;
        return this;
      },
      renderSelection: function(s){
        return this.renderCoords(s.core.unscale(s.get()));
      },
      selectionStart: function(s){
        this.renderSelection(s);
      },
      show: function(){
        if (this._hiding) clearTimeout(this._hiding);

        if (!this.fading) this.element.stop().css({ opacity: 1 });
        else this.element.stop().animate({ opacity: 1 },{ duration: 80, queue: false });
      },
      hide: function(){
        var t = this;
        if (!t.fading) t.element.hide();
        else t._hiding = setTimeout(function(){
          t._hiding = null;
          t.element.stop().animate({ opacity: 0 },{ duration: t.fadeDuration, queue: false });
        },t.fadeDelay);
      },
      initEvents: function(){
        var t = this;
        t.core.container.on('croprotstart croprotend cropimage cropstart cropmove cropend',function(e,s,c){
          if (t.selectionTarget && (t.selectionTarget !== e.target)) return false;

          switch(e.type){

            case 'cropimage':
              t.updateImage(c);
              break;

            case 'cropstart':
              t.selectionStart(s);
            case 'croprotstart':
              t.show();
              break;

            case 'cropend':
              t.renderCoords(c);
            case 'croprotend':
              if (t.autoHide) t.hide();
              break;

            case 'cropmove':
              t.renderCoords(c);
              break;
          }
        });
      }
    }
  });
  Jcrop.registerComponent('Thumbnailer',Thumbnailer);

