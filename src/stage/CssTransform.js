var TransformStage = function(){
  this.angle = 0;
  this.scale = 1;
  this.scaleMin = 0.2;
  this.scaleMax = 1.25;
  this.offset = [0,0];
};

TransformStage.prototype = new ImageStage();

$.extend(TransformStage,{
  isSupported: function(el,o){
    if ($.Jcrop.supportsCSSTransforms && (el.tagName == 'IMG')) return true;
  },
  priority: 101,
  create: function(el,options,callback){
    $.Jcrop.component.ImageLoader.attach(el,function(w,h){
      var obj = new TransformStage;
      obj.$img = $(el);
      obj.element = obj.$img.wrap('<div />').parent();
      obj.element.width(w).height(h);
      obj.imgsrc = el;

      if (typeof callback == 'function')
        callback.call(this,obj,options);
    });
  }
});
$.extend(TransformStage.prototype,{
  init: function(core){
    this.core = core;
  },
  boundScale: function(v){
    if (v<this.scaleMin) v = this.scaleMin;
    else if (v>this.scaleMax) v = this.scaleMax;
    return v;
  },
  // setOffset: function(x,y) {{{
  setOffset: function(x,y) {
    this.offset = [x,y];
    return this;
  },
  // }}}
  // setAngle: function(v) {{{
  setAngle: function(v) {
    this.angle = v;
    return this;
  },
  // }}}
  // setScale: function(v) {{{
  setScale: function(v) {
    this.scale = this.boundScale(v);
    return this;
  },
  // }}}
  // clear: function() {{{
  clear: function() {
  },
  // }}}
  triggerEvent: function(ev){
    this.$img.trigger(ev);
    return this;
  },
  // redraw: function() {{{
  redraw: function() {

    this.$img.css({
      transform:
        'translate('+(-this.offset[0])+'px,'+(-this.offset[1])+'px) '+
        'rotate('+this.angle+'deg) '+
        'scale('+this.scale+','+this.scale+')'
    });

    this.$img.trigger('cropredraw');
    return this;
  },
  // }}}
});
Jcrop.registerStageType('Transform',TransformStage);

