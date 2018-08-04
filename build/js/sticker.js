/* This class creates a draggable frame by locking the
   corner opposite to the one being dragged */

import Rect from './rect';

class Sticker {

  constructor(rect,w,h,ord) {
    this.sw = w;
    this.sh = h;
    this.rect = rect;
    this.locked = this.getCornerPoint(this.getOppositeCorner(ord));
    this.stuck = this.getCornerPoint(ord);
  }

  move(x,y) {
    return Rect.fromCoordSet(this.locked, this.translateStuckPoint(x,y));
  }

  translateStuckPoint(ox,oy) {
    const [xx,yy,sp] = this.stuck;
    var x = (xx === null)? sp: xx + ox;
    var y = (yy === null)? sp: yy + oy;
    if (x>this.sw) x = this.sw;
    if (y>this.sh) y = this.sh;
    if (x<0) x = 0;
    if (y<0) y = 0;
    return [x,y];
  }

  getCornerPoint(h) {
    const p = this.rect;
    switch(h) {
      case 'n':  return [ null, p.y,  p.x  ];
      case 's':  return [ null, p.y2, p.x2 ];
      case 'e':  return [ p.x2, null, p.y2 ];
      case 'w':  return [ p.x,  null, p.y  ];
      case 'se': return [ p.x2, p.y2 ];
      case 'sw': return [ p.x,  p.y2 ];
      case 'ne': return [ p.x2, p.y  ];
      case 'nw': return [ p.x,  p.y  ];
    }
  }

  getOppositeCorner(h) {
    switch(h){
      case 'n':  return 'se';
      case 's':  return 'nw';
      case 'e':  return 'nw';
      case 'w':  return 'se';
      case 'se': return 'nw';
      case 'sw': return 'ne';
      case 'ne': return 'sw';
      case 'nw': return 'se';
    }
  }

}

Sticker.create = function(rect,w,h,ord){
  return new Sticker(rect,w,h,ord);
};

export default Sticker;
