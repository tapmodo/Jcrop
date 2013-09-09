  /**
   *  EventManager
   *  provides internal event support
   */
  var EventManager = function(core){
    this.core = core;
  };
  $.extend(EventManager,{
    prototype: {
      on: function(n,cb){ $(this).on(n,cb); },
      off: function(n){ $(this).off(n); },
      trigger: function(n){ $(this).trigger(n); }
    }
  });
