  // Jcrop jQuery plugin function
  // $.fn.Jcrop = function(options,callback){{{
  $.fn.Jcrop = function(options,callback){

    var first = this.eq(0).data('Jcrop');
    var args = Array.prototype.slice.call(arguments);

    // Return API if requested
    if (options == 'api') { return first; }

    // Allow calling API methods (with arguments)
    else if (first && (typeof options == 'string')) {

      // Call method if it exists
      if (first[options]) {
        args.shift();
        first[options].apply(first,args);
        return first;
      }

      // Unknown input/method does not exist
      return false;
    }

    // Otherwise, loop over selected elements
    this.each(function(){
      var t = this, $t = $(this);
      var exists = $t.data('Jcrop');
      var obj;

      // If Jcrop already exists on this element only setOptions()
      if (exists)
        exists.setOptions(options);

      // Otherwise, if it's an IMG, create a wrapper
      else if (this.tagName == 'IMG')

        $.Jcrop.component.ImageLoader.attach(this,function(w,h){
          var $wrapper = $t.wrap('<div />').parent();

          $wrapper.width(w).height(h);

          obj = $.Jcrop.attach($wrapper,$.extend({},options,{
            imgTarget: t
          }));

          $t.data('Jcrop',obj);

          if (typeof callback == 'function')
            callback.call(obj);
        });

      // Or hope it's a block element, because we're attaching
      else {

        obj = $.Jcrop.attach(this,options);
        $t.data('Jcrop',obj);

        if (typeof callback == 'function')
          callback.call(obj);
      }

      return this;
    });
  };
  // }}}
