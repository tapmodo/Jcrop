  // Jcrop component storage
  Jcrop.component = {
    Animator: CropAnimator,
    DragState: DragState,
    EventManager: EventManager,
    ImageLoader: ImageLoader,
    StageManager: StageManager,
    Selection: Selection,
    Keyboard: KeyWatcher,
    Thumbnailer: Thumbnailer,
    CanvasAnimator: CanvasAnimator,
    Touch: JcropTouch
  };

  // Jcrop stage constructors
  Jcrop.stage = {
    Block: AbstractStage,
    Image: ImageStage,
    Canvas: CanvasStage,
    Transform: TransformStage
  };

  // Jcrop static functions
  $.extend(Jcrop,{
    //defaults: default settings {{{
    defaults: {

      // Selection Behavior
      edge: { n: 0, s: 0, e: 0, w: 0 },
      setSelect: null,
      linked: true,
      linkCurrent: true,
      canDelete: true,
      canSelect: true,
      canDrag: true,
      canResize: true,

      // Component constructors
      eventManagerComponent:  Jcrop.component.EventManager,
      keyboardComponent:      Jcrop.component.Keyboard,
      dragstateComponent:     Jcrop.component.DragState,
      stagemanagerComponent:  Jcrop.component.StageManager,
      animatorComponent:      Jcrop.component.Animator,
      selectionComponent:     Jcrop.component.Selection,

      // This is a function that is called, which returns a stage object
      stageConstructor:       Jcrop.stageConstructor,

      // Stage Behavior
      allowSelect: true,
      multi: false,
      multiMax: false,
      multiCleanup: true,
      animation: true,
      animEasing: 'swing',
      animDuration: 400,
      fading: true,
      fadeDuration: 300,
      fadeEasing: 'swing',
      bgColor: 'black',
      bgOpacity: .5,

      // Startup options
      applyFilters: [ 'constrain', 'extent', 'backoff', 'ratio', 'shader', 'round' ],
      borders:  [ 'n', 's', 'e', 'w' ],
      handles:  [ 'n', 's', 'e', 'w', 'sw', 'ne', 'nw', 'se' ],
      dragbars: [ 'n', 'e', 'w', 's' ],

      dragEventTarget: window,

      xscale: 1,
      yscale: 1,

      boxWidth: null,
      boxHeight: null,

      // CSS Classes
      // @todo: These need to be moved to top-level object keys
      // for better customization. Currently if you try to extend one
      // via an options object to Jcrop, it will wipe out all
      // the others you don't specify. Be careful for now!
      css_nodrag: 'jcrop-nodrag',
      css_drag: 'jcrop-drag',
      css_container: 'jcrop-active',
      css_shades: 'jcrop-shades',
      css_selection: 'jcrop-selection',
      css_borders: 'jcrop-border',
      css_handles: 'jcrop-handle jcrop-drag',
      css_button: 'jcrop-box jcrop-drag',
      css_noresize: 'jcrop-noresize',
      css_dragbars: 'jcrop-dragbar jcrop-drag',

      legacyHandlers: {
        onChange: 'cropmove',
        onSelect: 'cropend'
      }
    },
    //}}}
    //filter: built-in filter collection {{{
    filter: {
      constrain: ConstrainFilter,
      extent: ExtentFilter,
      grid: GridFilter,
      backoff: BackoffFilter,
      shader: ShadeFilter,
      ratio: RatioFilter,
      round: RoundFilter
    },
    //}}}
    // attach: function(element,opt){{{
    attach: function(element,opt){
      var obj = new $.Jcrop(element,opt);
      return obj;
    },
    // }}}
    // imgCopy: function(imgel){{{
    imgCopy: function(imgel){
      var img = new Image;
      img.src = imgel.src;
      return img;
    },
    // }}}
    // imageClone: function(imgel){{{
    imageClone: function(imgel){
      return $.Jcrop.supportsCanvas?
        Jcrop.canvasClone(imgel):
        Jcrop.imgCopy(imgel);
    },
    // }}}
    // canvasClone: function(imgel){{{
    canvasClone: function(imgel){
      var canvas = document.createElement('canvas'),
          $canvas = $(canvas).width(imgel.width).height(imgel.height),
          ctx = canvas.getContext('2d');
      canvas.width = imgel.naturalWidth;
      canvas.height = imgel.naturalHeight;
      ctx.drawImage(imgel,0,0,imgel.naturalWidth,imgel.naturalHeight);
      return $canvas;
    },
    // }}}
    // propagate: function(plist,config,obj){{{
    propagate: function(plist,config,obj){
      for(var i=0,l=plist.length;i<l;i++)
        if (config.hasOwnProperty(plist[i]))
          obj[plist[i]] = config[plist[i]];
    },
    // }}}
    // getLargestBox: function(ratio,w,h){{{
    getLargestBox: function(ratio,w,h){
      if ((w/h) > ratio)
        return [ h * ratio, h ];
          else return [ w, w / ratio ];
    },
    // }}}
    // stageConstructor: function(el,options,callback){{{
    stageConstructor: function(el,options,callback){

      // Get a priority-ordered list of available stages
      var stages = [];
      $.each(Jcrop.stage,function(i,e){
        stages.push(e);
      });
      stages.sort(function(a,b){ return a.priority - b.priority; });

      // Find the first one that supports this element
      for(var i=0,l=stages.length;i<l;i++){
        if (stages[i].isSupported(el,options)){
          stages[i].create(el,options,function(obj,opt){
            if (typeof callback == 'function') callback(obj,opt);
          });
          break;
        }
      }
    },
    // }}}
    // supportsColorFade: function(){{{
    supportsColorFade: function(){
      return $.fx.step.hasOwnProperty('backgroundColor');
    },
    // }}}
    // wrapFromXywh: function(xywh){{{
    wrapFromXywh: function(xywh){
      var b = { x: xywh[0], y: xywh[1], w: xywh[2], h: xywh[3] };
      b.x2 = b.x + b.w;
      b.y2 = b.y + b.h;
      return b;
    }
    // }}}
  });
