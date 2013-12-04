var ImageStage = function(){
};

ImageStage.prototype = new AbstractStage();

$.extend(ImageStage,{
  create: function(el,options,callback){
    $.Jcrop.component.ImageLoader.attach(el,function(w,h){
      var obj = new ImageStage;
      obj.element = $(el).wrap('<div />').parent();

      obj.element.width(w).height(h);
      obj.imgsrc = el;

      if (typeof callback == 'function')
        callback.call(this,obj,options);
    });
  }
});


