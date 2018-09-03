import extend from './util/extend';
import Handle from './handle';
import Defaults from './defaults';
import Dragger from './dragger';
import Rect from './rect';
import Sticker from './sticker';
import ConfObj from './confobj';
import Keyboard from './keyboard';
import Animate from './animate';

class Widget extends ConfObj {

  constructor (el,options={}) {
    super(el,options);
    this.pos = Rect.from(this.el);
    this.init();
  }

  init () {
    this.createHandles();
    this.createMover();
    this.attachFocus();
    Keyboard.attach(this);
    return this;
  }

  initOptions () {
    this._optconf['aspectRatio'] = ar => {
      const p = this.pos;
      this.aspect = ar || null;
      if (this.aspect && p) {
        var [w,h] = Rect.getMax(p.w,p.h,ar);
        this.render(Rect.fromPoint([p.x,p.y],w,h));
      }
    };
  }

  attachToStage (stage) {
    this.stage = stage;
    this.emit('crop.attach');
  }

  attachFocus () {
    this.el.addEventListener('focus',(e) => {
      this.stage.activate(this);
      this.emit('crop.update');
    },false);
  }

  animate (rect,frames,efunc) {
    const t = this;
    efunc = efunc || t.options.animateEasingFunction || 'swing';
    frames = frames || t.options.animateFrames || 30;
    return Animate(t.el,t.pos,rect,r => t.render(r.normalize()),frames,efunc)
      .then(() => this.emit('crop.change'));
  }

  createMover () {
    var w,h;
    this.pos = Rect.from(this.el);
    var stick;
    Dragger(
      this.el,
      () => {
        const pe = this.el.parentElement;
        if (!this.stage.enabled) return false;
        [w,h] = [ pe.offsetWidth, pe.offsetHeight ];
        stick = Rect.from(this.el);
        this.el.focus();
        this.stage.activate(this);
        return true;
      },
      (x,y) => {
        this.pos.x = stick.x + x;
        this.pos.y = stick.y + y;
        this.render(this.pos.rebound(w,h));
      },
      () => {
        this.emit('crop.change');
      }
    );
  }

  nudge (x=0,y=0) {
    const pe = this.el.parentElement;
    const [w,h] = [ pe.offsetWidth, pe.offsetHeight ];
    if (x) this.pos.x += x;
    if (y) this.pos.y += y;
    this.render(this.pos.rebound(w,h));
    this.emit('crop.change');
  }

  createHandles () {
    this.options.handles.forEach(c => {
      const handle = Handle.create('jcrop-handle '+c);
      handle.appendTo(this.el);

      var stick;
      Dragger(handle.el,
        () => {
          if (!this.stage.enabled) return false;
          const pe = this.el.parentElement;
          const w = pe.offsetWidth;
          const h = pe.offsetHeight;
          stick = Sticker.create(Rect.from(this.el), w, h, c);
          if (this.aspect) stick.aspect = this.aspect;
          this.el.focus();
          this.emit('crop.active');
          return true;
        },
        (x,y) => this.render(stick.move(x,y)),
        () => {
          this.emit('crop.change');
        }
      );
    });
    return this;
  }

  isActive () {
    return (this.stage && (this.stage.active === this));
  }

  render (r) {
    r = r || this.pos;
    this.el.style.top = Math.round(r.y) + 'px';
    this.el.style.left = Math.round(r.x) + 'px';
    this.el.style.width = Math.round(r.w) + 'px';
    this.el.style.height = Math.round(r.h) + 'px';
    this.pos = r;
    this.emit('crop.update');
    return this;
  }

  doneDragging () {
    this.pos = Rect.from(this.el);
  }

}

Widget.create = function (options={}) {
  const el = document.createElement('div');
  const opts = extend({},Defaults,options);
  el.setAttribute('tabindex','0');
  el.className = opts.cropperClass || 'jcrop-widget';
  return new (options.widgetConstructor || Widget)(el,opts);
};

export default Widget;
