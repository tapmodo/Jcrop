import Rect from './rect';
import DomObj from './domobj';

class Manager {
  constructor(el) {
    if (typeof el == 'string') el = document.getElementById(el);
    this.el = el;
    this.shades = {};
  }

  init(options={}) {
    this.active = (options.shading!==undefined)? options.shading: true;

    ['t','l','r','b'].forEach(
      key => this.shades[key] = Shade.create(options,key)
    );

    this.enable();
  }
  
  adjust(rect){
    const f = Rect.from(this.el);
    const s = this.shades;
    s.t.h = rect.y;
    s.r.w = Math.ceil(f.w - rect.x2);
    s.b.h = f.h - rect.y2;
    s.t.w = s.b.w = Math.floor(rect.w);
    s.l.w = s.t.x = s.b.x = Math.floor(rect.x);
  }

  enable(){
    const s = this.shades;
    ['t','l','r','b'].forEach(key => s[key].insert(this.el));
  }

  disable(){
    const s = this.shades;
    ['t','l','r','b'].forEach(key => s[key].remove());
  }
}

Manager.attach = function(cropper){
  const el = cropper.el;
  const m = new Manager(el);
  m.init(cropper.options);
  cropper.shades = m;
  return m;
};

class Shade extends DomObj {
  insert(el){ el.appendChild(this.el); }
  remove(){ this.el.parentElement.removeChild(this.el); }

  set w(w) { this.el.style.width = w + 'px'; }
  set h(h) { this.el.style.height = h + 'px'; }
  set x(l) { this.el.style.left = l + 'px'; }
}

Shade.create = function(o,key) {
  const el = document.createElement('div');
  const clname = o.shadeClass || 'shade';
  if (o.shadeColor) el.style.backgroundColor = o.shadeColor;
  if (o.shadeOpacity) el.style.opacity = o.shadeOpacity;
  el.className = `${clname} ${key}`;
  return new Shade(el);
};

Shade.Manager = Manager;

export default Shade;
