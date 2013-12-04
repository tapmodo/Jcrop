var AbstractStage = function(){
};

$.extend(AbstractStage,{
  create: function(el,options,callback){
    var obj = new AbstractStage;
    obj.element = el;
    callback.call(this,obj,options);
  },
  prototype: {
    attach: function(core){
      this.core = core;
      core.ui.stage = this;
    },
    getElement: function(){
      return this.element;
    }
  }
});


