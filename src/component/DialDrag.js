  /**
   * DialDrag component
   * This is a little hacky, it was adapted from some previous/old code
   * Plan to update this API in the future
   */
  var DialDrag = function() { };

  DialDrag.prototype = {

    init: function(core,actuator,callback){
      var that = this;

      if (!actuator) actuator = core.container;
      this.$btn = $(actuator);
      this.$targ = $(actuator);
      this.core = core;

      this.$btn
        .addClass('dialdrag')
        .on('mousedown.dialdrag',this.mousedown())
        .data('dialdrag',this);

      if (!$.isFunction(callback)) callback = function(){ };
      this.callback = callback;
      this.ondone = callback;
    },

    remove: function(){
      this.$btn
        .removeClass('dialdrag')
        .off('.dialdrag')
        .data('dialdrag',null);
      return this;
    },

    setTarget: function(obj){
      this.$targ = $(obj);
      return this;
    },

    getOffset: function(){
      var targ = this.$targ, pos = targ.offset();
      return [
        pos.left + (targ.width()/2),
        pos.top + (targ.height()/2)
      ];
    },

    relMouse: function(e){
      var x = e.pageX - this.offset[0],
          y = e.pageY - this.offset[1],
          ang = Math.atan2(y,x) * (180 / Math.PI),
          vec = Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
      return [ x, y, ang, vec ];
    },

    mousedown: function(){
      var that = this;

      function mouseUp(e){
        $(window).off('.dialdrag');
        that.ondone.call(that,that.relMouse(e));
        that.core.container.trigger('croprotend');
      }

      function mouseMove(e){
        that.callback.call(that,that.relMouse(e));
      }

      return function(e) {
        that.offset = that.getOffset();
        var rel = that.relMouse(e);
        that.angleOffset = -that.core.ui.stage.angle+rel[2];
        that.distOffset = rel[3];
        that.dragOffset = [rel[0],rel[1]];
        that.core.container.trigger('croprotstart');

        $(window)
          .on('mousemove.dialdrag',mouseMove)
          .on('mouseup.dialdrag',mouseUp);

        that.callback.call(that,that.relMouse(e));

        return false;
      };
    }
    
  };
  Jcrop.registerComponent('DialDrag',DialDrag);

