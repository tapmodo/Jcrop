  /**
   * StageManager
   * Provides basic stage-specific functionality
   */
  // var StageManager = function(core){{{
  var StageManager = function(core){
    this.core = core;
    this.ui = core.ui;
    this.init();
  };
  // }}}

  $.extend(StageManager.prototype,{
    // init: function(){{{
    init: function(){
      this.setupEvents();
      this.dragger = new StageDrag(this);
    },
    // }}}
    // tellConfigUpdate: function(options,proptype){{{
    tellConfigUpdate: function(options,proptype){
      for(var i=0,m=this.ui.multi,l=m.length;i<l;i++)
        if (m[i].setOptions && (m[i].linked || (this.core.opt.linkCurrent && m[i] == this.ui.selection)))
          m[i].setOptions(options);
    },
    // }}}
    // configUpdateHandler: function(){{{
    configUpdateHandler: function(){
      var t = this;
      return function(e,instance,options,proptype){
        t.tellConfigUpdate(options,proptype);
      };
    },
    // }}}
    // startDragHandler: function(){{{
    startDragHandler: function(){
      var t = this;
      return function(e){
        if (!e.button || t.core.opt.is_ie_lt9) return t.dragger.start(e);
      };
    },
    // }}}
    // removeEvents: function(){{{
    removeEvents: function(){
      this.core.container.off('.jcrop-stage');
    },
    // }}}
    // setupEvents: function(){{{
    setupEvents: function(){
      this.core.container
        .on('mousedown.jcrop.jcrop-stage',this.startDragHandler())
        .on('cropconfig.jcrop-stage',this.configUpdateHandler());
    }
    // }}}
  });
