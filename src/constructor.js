  // Jcrop constructor
  // var Jcrop = function(element,opt){{{
  var Jcrop = function(element,opt){
    var _ua = navigator.userAgent.toLowerCase();

    this.opt = $.extend(true,{},Jcrop.defaults);

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
      
    if (/msie [1-8]\./.test(_ua)) {
      this.opt.dragEventTarget = document.body;
    }

  };
  // }}}
