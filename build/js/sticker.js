/* This class creates a draggable frame by locking the
   corner opposite to the one being dragged */

import Rect from './rect';

class Sticker {

  constructor (rect,w,h,ord) {
    this.sw = w;
    this.sh = h;
    this.rect = rect;
    this.locked = this.getCornerPoint(this.getOppositeCorner(ord));
    this.stuck = this.getCornerPoint(ord);
  }

  move (x,y) {
    return Rect.fromPoints(this.locked, this.translateStuckPoint(x,y));
  }

  // Determine "quadrant" of handle drag relative to locked point
  // returns string tl = top left, br = bottom right, etc
  getDragQuadrant (x,y) {
    const relx = this.locked[0] - x;
    const rely = this.locked[1] - y;
    if ((relx < 0) && (rely < 0)) return 'br';
    else if ((relx >= 0) && (rely >= 0)) return 'tl';
    else if ((relx < 0) && (rely >= 0)) return 'tr';
    else return 'bl';
  }

  // get the maximum aspect ratio rectangle for the current drag
  getMaxRect (x,y,aspect) {
    return Rect.getMax(
      Math.abs(this.locked[0] - x),
      Math.abs(this.locked[1] - y),
      aspect
    );
  }

  // given the offset of the drag versus the stuck point,
  // determine the real dragging coordinates
  translateStuckPoint (ox,oy) {
    const [xx,yy,sp] = this.stuck;

    var x = (xx === null)? sp: xx + ox;
    var y = (yy === null)? sp: yy + oy;

    if (x > this.sw) x = this.sw;
    if (y > this.sh) y = this.sh;
    if (x < 0) x = 0;
    if (y < 0) y = 0;

    if (this.aspect) {
      var [w,h] = this.getMaxRect(x,y,this.aspect);
      var quad = this.getDragQuadrant(x,y);
      var res = Rect.fromPoint(this.locked,w,h,quad);
      return [ res.x2, res.y2 ];
    }

    return [x,y];
  }

  getCornerPoint (h) {
    const p = this.rect;
    switch (h) {
      case 'n': return [ null, p.y, p.x ];
      case 's': return [ null, p.y2, p.x2 ];
      case 'e': return [ p.x2, null, p.y2 ];
      case 'w': return [ p.x, null, p.y ];
      case 'se': return [ p.x2, p.y2 ];
      case 'sw': return [ p.x, p.y2 ];
      case 'ne': return [ p.x2, p.y ];
      case 'nw': return [ p.x, p.y ];
    }
  }

  getOppositeCorner (h) {
    switch (h) {
      case 'n': return 'se';
      case 's': return 'nw';
      case 'e': return 'nw';
      case 'w': return 'se';
      case 'se': return 'nw';
      case 'sw': return 'ne';
      case 'ne': return 'sw';
      case 'nw': return 'se';
    }
  }

}

Sticker.create = function (rect,w,h,ord) {
  return new Sticker(rect,w,h,ord);
};

export default Sticker;
