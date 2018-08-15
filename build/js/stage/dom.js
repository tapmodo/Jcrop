import extend from '../util/extend';
import Widget from '../widget';
import Shade from '../shade';
import Dragger from '../dragger';
import ConfObj from '../confobj';
import Sticker from '../sticker';

class Stage extends ConfObj {

  constructor(el,options) {
    super(el,options);
    this.crops = new Set;
    this.active = null;
    this.init();
  }

  init() {
    this.initListeners();
    this.initStageDrag();
    Shade.Manager.attach(this);
  }

  initOptions(){
    this._optconf['multi'] = v => { if (!v) this.limitWidgets() };
  }

  focus() {
    if (this.active) this.active.el.focus();
    else this.el.focus();
    return this;
  }

  limitWidgets(n=1) {
    if (!this.crops || (n<1)) return false;
    const crops = Array.from(this.crops);

    while(crops.length > n)
      this.removeWidget(crops.shift());

    return this;
  }

  canCreate() {
    const n = this.crops.size;
    const o = this.options;
    if ((o.multiMax!==null) && (n >= o.multiMax)) return false;
    if (!o.multi && (n >= o.multiMin)) return false;
    return true;
  }

  canRemove() {
    const n = this.crops.size;
    const o = this.options;
    if (this.active && !this.active.options.canRemove) return false;
    if (!o.canRemove || (n <= o.multiMin)) return false;
    return true;
  }

  initStageDrag() {
    var crop, pos, w, h, stick;
    Dragger(this.el,
      (x,y,e) => {
        if (!this.canCreate()) return false;
        crop = Widget.create(this.options);
        pos = crop.pos;
        pos.x = e.pageX - this.el.offsetParent.offsetLeft - this.el.offsetLeft;
        pos.y = e.pageY - this.el.offsetParent.offsetTop - this.el.offsetTop;
        w = this.el.offsetWidth;
        h = this.el.offsetHeight;
        this.addWidget(crop);
        stick = Sticker.create(pos,w,h,'se');
        if (this.options.aspectRatio) stick.aspect = this.options.aspectRatio;
        crop.render(pos);
        this.focus();
        return true;
      },
      (x,y) => {
        crop.render(stick.move(x,y))
      },
      () => { }
    );
  }

  initListeners() {
    this.listen('crop.activate',c => this.activate(c),false);
    this.listen('crop.attach',c => console.info('Cropper attached'));
    this.listen('crop.remove',c => this.removeWidget(c));
  }

  reorderWidgets() {
    var z = 1000;
    this.crops.forEach(crop => {
      crop.el.style.zIndex = z++;
      if (this.active === crop) crop.addClass('active');
        else crop.removeClass('active');
    });
    this.refresh();
  }

  activate(widget) {
    widget = widget || Array.from(this.crops).pop();
    if (widget) {
      this.active = widget;
      this.crops.delete(widget);
      this.crops.add(widget);
      this.reorderWidgets();
      this.active.el.focus();
    } else {
      this.shades.disable();
    }
    return this;
  }

  addWidget(widget) {
    widget.attachToStage(this);
    widget.appendTo(this.el);
    widget.init();
    this.activate(widget);
    return this;
  }

  newWidget(rect,options={}) {
    options = extend({},options,this.options);
    const crop = Widget.create(options);
    crop.render(rect);
    this.addWidget(crop);
    crop.el.focus();
    return crop;
  }

  removeWidget(widget) {
    if (!this.canRemove()) return false;
    widget.el.remove();
    this.crops.delete(widget);
    this.activate();
  }

  refresh() {
    this.options.shading && this.active &&
      this.shades.adjust(this.active.pos);
  }

  updateShades() {
    if (!this.shades) return;

    if (this.options.shading) this.shades.enable();
      else this.shades.disable();

    this.options.shading && this.active &&
      this.shades.adjust(this.active.pos);

    return this;
  }

  setOptions(options={}){
    super.setOptions(options);

    if (this.crops)
      Array.from(this.crops)
        .forEach(i => i.setOptions(options));
  }
}

export default Stage;

