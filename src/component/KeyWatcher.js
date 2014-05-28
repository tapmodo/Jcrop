  /**
   *  KeyWatcher
   *  provides keyboard support
   */
  // var KeyWatcher = function(core){{{
  var KeyWatcher = function(core){
    this.core = core;
    this.init();
  };
  // }}}
  $.extend(KeyWatcher,{
    // defaults: {{{
    defaults: {
      eventName: 'keydown.jcrop',
      passthru: [ 9 ],
      debug: false
    },
    // }}}
    prototype: {
      // init: function(){{{
      init: function(){
        $.extend(this,KeyWatcher.defaults);
        this.enable();
      },
      // }}}
      // disable: function(){{{
      disable: function(){
        this.core.container.off(this.eventName);
      },
      // }}}
      // enable: function(){{{
      enable: function(){
        var t = this, m = t.core;
        m.container.on(t.eventName,function(e){
          var nudge = e.shiftKey? 16: 2;

          if ($.inArray(e.keyCode,t.passthru) >= 0)
            return true;

          switch(e.keyCode){
            case 37: m.nudge(-nudge,0); break;
            case 38: m.nudge(0,-nudge); break;
            case 39: m.nudge(nudge,0); break;
            case 40: m.nudge(0,nudge); break;

            case 46:
            case 8:
              m.requestDelete();
              return false;
              break;

            default:
              if (t.debug) console.log('keycode: ' + e.keyCode);
              break;
          }

          if (!e.metaKey && !e.ctrlKey)
            e.preventDefault();
        });
      }
      // }}}
    }
  });
  Jcrop.registerComponent('Keyboard',KeyWatcher);

