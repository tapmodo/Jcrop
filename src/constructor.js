  // Jcrop constructor
  var Jcrop = function(element,opt){
    var _ua = navigator.userAgent.toLowerCase();

    this.opt = $.extend({},Jcrop.defaults,opt || {});

    this.container = $(element);

    this.opt.is_msie = /msie/.test(_ua);
    this.opt.is_ie_lt9 = /msie [1-8]\./.test(_ua);

    this.container.addClass(this.opt.css_container);

    this.ui = {};
    this.state = null;
    this.ui.multi = [];
    this.ui.selection = null;
    this.filter = {};

    this.init();
    this.setOptions(opt);
    this.applySizeConstraints();
    this.container.trigger('cropinit',this);
      
    // IE<9 doesn't work if mouse events are attached to window
    if (this.opt.is_ie_lt9)
      this.opt.dragEventTarget = document.body;
  };

