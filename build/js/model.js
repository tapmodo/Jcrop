class Coords {
  constructor(el) {
    this.el = el;

    this.pos = {
      x: el.offsetLeft,
      y: el.offsetTop,
      w: el.
    }
  }

  get x() { return this.el.offsetLeft; }
  get y() { return this.el.offsetTop; }
  get x2() { return this.x + this.w; }
  get y2() { return this.y + this.h; }
  get w() { return this.el.offsetWidth; }
  get h() { return this.el.offsetHeight; }

  set x(v) { this.el.offsetLeft = v; this.w = this.x + this.x2; }
  set y(v) { this.el.offsetTop = v; this.h = this.y + this.y2; }
  set x1(v) { this.el.offsetLeft = v; }
  set y1(v) { this.el.offsetTop = v; }
  set x2(v) { this.el.offsetLeft = v; }
  set y2(v) { this.el.offsetTop = v; }



  get w() {
    return Math.max(this.x,this.x2) - Math.min(this.x,this.x2);
  }
  set w(w) {
    this.x2 = this.x + w;
    this.normalize();
  }
  get h() {
    return Math.max(this.y,this.y2) - Math.min(this.y,this.y2);
  }
  set h(h) {
    this.y2 = this.y + h;
    this.normalize();
  }
  
  normalize() {
    [this.x,this.x2,this.y,this.y2] = [
      Math.min(this.x,this.x2),
      Math.max(this.x,this.x2),
      Math.min(this.y,this.y2),
      Math.max(this.y,this.y2)
    ];
    return this;
  }
}

Coords.from = function(el){
  var c = new Coords;
  c.x = el.offsetLeft;
  c.y = el.offsetTop;
  c.w = el.offsetWidth;
  c.h = el.offsetHeight;
  return c;
}

export default Coords;

