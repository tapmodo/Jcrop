import extend from './util/extend';
import Defaults from './defaults';
import Cropper from './cropper';
import Shade from './shade';
import Handle from './handle';
import Dragger from './dragger';
import Rect from './rect';
import Sticker from './sticker';
import DomObj from './domobj';
import Easing from './easing';

class Stage {
  constructor(el,options) {
    if (typeof el == 'string') el = document.getElementById(el);
    this.options = extend({},Defaults,options);
    this.el = el;
    this.crops = new Set;
    this.active = null;
    this.init();
  }

  init() {
    this.initListeners();
    this.initStageDrag();
    Shade.Manager.attach(this);
    console.info('Jcrop initialized stage');
  }

  canCreate() {
    const n = this.crops.size;
    const o = this.options;
    if (!o.maxCroppers) return true;
    if (n >= o.maxCroppers) return false;
    if (!o.multi && (n >= o.minCroppers)) return false;
    return true;
  }

  canRemove() {
    const n = this.crops.size;
    const o = this.options;
    if (this.active && !this.active.options.canRemove) return false;
    if (!o.canRemove || (n <= o.minCroppers)) return false;
    return true;
  }

  initStageDrag() {
    var crop, pos, w, h;
    Dragger(this.el,
      (x,y,e) => {
        if (!this.canCreate()) return false;
        crop = Cropper.create();
        pos = crop.pos;
        pos.x = e.pageX - this.el.offsetLeft;
        pos.y = e.pageY - this.el.offsetTop;
        w = this.el.offsetWidth;
        h = this.el.offsetHeight;
        crop.render(pos);
        this.addCropper(crop);
        crop.el.focus();
        return true;
      },
      (x,y) => {
        pos.x2 = pos.x + x;
        pos.y2 = pos.y + y;
        if (pos.x2 < 0) pos.x2 = 0;
        if (pos.y2 < 0) pos.y2 = 0;
        if (pos.x2 > w) pos.x2 = w;
        if (pos.y2 > h) pos.y2 = h;
        crop.render(pos.normalize());
      },
      () => {
        console.log('done');
      }
    );
  }

  initListeners() {
    this.el.addEventListener('crop.activate',(e) => {
      this.activate(e.cropTarget);
    },false);
    this.el.addEventListener('crop.update',(e) => {
      const targ = e.cropTarget;
      if ((targ === this.active) && targ.options.shading)
        this.shades.adjust(targ.pos);
    },false);
    this.el.addEventListener('crop.attach',function(e){
      console.info('Cropper attached');
    });
    this.el.addEventListener('crop.remove',(e) => {
      this.removeCropper(e.cropTarget);
    });
  }

  reorderCroppers() {
    var z = 1000;
    this.crops.forEach(crop => {
      crop.el.style.zIndex = z++;
      if (this.active === crop) crop.addClass('active');
        else crop.removeClass('active');
    });
    this.options.shading && this.shades.adjust(this.active.pos);
  }

  activate(cropper) {
    cropper = cropper || Array.from(this.crops).pop();
    if (cropper) {
      this.shades.enable();
      this.active = cropper;
      this.crops.delete(cropper);
      this.crops.add(cropper);
      this.reorderCroppers();
      this.active.el.focus();
    } else {
      this.shades.disable();
    }
    return this;
  }

  addCropper(cropper) {
    cropper.attachToStage(this);
    cropper.appendTo(this.el);
    cropper.init();
    this.activate(cropper);
    return this;
  }

  removeCropper(cropper) {
    if (!this.canRemove()) return false;
    cropper.el.remove();
    this.crops.delete(cropper);
    this.activate();
  }
}

Stage.attach = function(el,options={}) {
  options = extend({},Defaults,options);

  if (el.tagName == 'IMG') return new ImageStage(el,options);

  return new Stage(el,options);
}

Stage.defaults = Defaults;
Stage.Dragger = Dragger;
Stage.Cropper = Cropper;
Stage.Rect = Rect;
Stage.Handle = Handle;
Stage.Sticker = Sticker;
Stage.Easing = Easing;

export default Stage;

