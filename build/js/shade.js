import Rect from './rect';
import DomObj from './domobj';

class Manager {
  constructor (el) {
    if (typeof el === 'string') el = document.getElementById(el);
    this.el = el;
    this.shades = {};
  }

  init (options={}) {
    this.active = (options.shade!==undefined)? options.shade: true;

    this.keys().forEach(
      key => { this.shades[key] = Shade.create(options,key); }
    );

    this.el.addEventListener('crop.update',(e) => {
      if (e.cropTarget.isActive() && e.cropTarget.options.shade) {
        this.adjust(e.cropTarget.pos);
      }
    },false);

    this.enable();
  }

  adjust (rect) {
    const f = Rect.from(this.el);
    const s = this.shades;
    s.t.h = rect.y;
    s.b.h = f.h - rect.y2;
    s.t.w = s.b.w = Math.floor(rect.w);
    s.l.w = s.t.x = s.b.x = Math.ceil(rect.x);
    s.r.w = f.w - (Math.ceil(rect.x) + Math.floor(rect.w));
  }

  keys () {
    return [ 't', 'l', 'r', 'b' ];
  }

  enable () {
    const s = this.shades;
    this.keys().forEach(key => s[key].insert(this.el));
  }

  disable () {
    const s = this.shades;
    this.keys().forEach(key => s[key].remove());
  }

  setStyle (color,opacity) {
    const s = this.shades;
    this.keys().forEach(key => s[key].color(color).opacity(opacity));
  }

}

Manager.attach = function (i) {
  const el = i.el;
  const m = new Manager(el);
  m.init(i.options);
  i.shades = m;
  i._optconf['shade'] = v => i.updateShades();
  i._optconf['shadeColor'] = v => m.setStyle(v);
  i._optconf['shadeOpacity'] = v => m.setStyle(null,v);
  return m;
};

class Shade extends DomObj {
  insert (el) { el.appendChild(this.el); }
  remove () { this.el.remove(); }

  set w (w) { this.el.style.width = w + 'px'; }
  set h (h) { this.el.style.height = h + 'px'; }
  set x (l) { this.el.style.left = l + 'px'; }

  color (c) {
    if (c) this.el.style.backgroundColor = c;
    return this;
  }

  opacity (o) {
    if (o) this.el.style.opacity = o;
    return this;
  }
}

Shade.create = function (o,key) {
  const el = document.createElement('div');
  const clname = o.shadeClass || 'jcrop-shade';
  el.className = `${clname} ${key}`;
  const obj = new Shade(el);
  return obj.color(o.shadeColor).opacity(o.shadeOpacity);
};

Shade.Manager = Manager;

export default Shade;
