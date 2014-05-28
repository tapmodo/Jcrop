  /**
   *  CropAnimator
   *  manages smooth cropping animation
   *
   *  This object is called internally to manage animation.
   *  An in-memory div is animated and a progress callback
   *  is used to update the selection coordinates of the
   *  visible selection in realtime.
   */
  // var CropAnimator = function(selection){{{
  var CropAnimator = function(selection){
    this.selection = selection;
    this.core = selection.core;
  };
  // }}}

  CropAnimator.prototype = {

    getElement: function(){
      var b = this.selection.get();

      return $('<div />')
        .css({
          position: 'absolute',
          top: b.y+'px',
          left: b.x+'px',
          width: b.w+'px',
          height: b.h+'px'
        });
    },

    animate: function(x,y,w,h,cb){
      var t = this;

      t.selection.allowResize(false);

      t.getElement().animate({
        top: y+'px',
        left: x+'px',
        width: w+'px',
        height: h+'px'
      },{
        easing: t.core.opt.animEasing,
        duration: t.core.opt.animDuration,
        complete: function(){
          t.selection.allowResize(true);
          cb && cb.call(this);
        },
        progress: function(anim){
          var props = {}, i, tw = anim.tweens;

          for(i=0;i<tw.length;i++){
            props[tw[i].prop] = tw[i].now; }

          var b = {
            x: parseInt(props.left),
            y: parseInt(props.top),
            w: parseInt(props.width),
            h: parseInt(props.height)
          };

          b.x2 = b.x + b.w;
          b.y2 = b.y + b.h;

          t.selection.updateRaw(b,'se');
        }
      });
    }

  };
  Jcrop.registerComponent('Animator',CropAnimator);

