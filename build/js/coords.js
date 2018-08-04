class Pos {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;
  }

  get x2() {
    return this.x + this.w;
  }
  set x2(x) {
    this.x = Math.min(this.x,x-this.x);
    this.w = Math.max(this.x,x)-this.x
    this.normalize();
  }
  set x(v) {
    this.xy = v;
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
