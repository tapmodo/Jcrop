/*
  Dragger function - sets up dragging callbacks on an element
*/

const Dragger = function (el,startcb,movecb,donecb) {
  var ox, oy;
  if (typeof el === 'string') el = document.getElementById(el);

  el.addEventListener('mousedown',start);
  el.addEventListener('touchstart',start);

  function start (e) {
    const obj = (e.type === 'touchstart')? e.touches[0]: e;

    ox = obj.pageX;
    oy = obj.pageY;

    e.preventDefault();
    e.stopPropagation();

    if (!startcb(ox,oy,obj)) return;

    if (e.type === 'mousedown') {
      window.addEventListener('mousemove',move);
      document.addEventListener('mouseup',done);
    } else if (e.type === 'touchstart') {
      document.addEventListener('touchmove',move);
      document.addEventListener('touchend',done);
    }
  }

  function move (e) {
    const obj = (e.type === 'touchmove')? e.changedTouches[0]: e;
    e.stopPropagation();
    movecb(obj.pageX - ox,obj.pageY - oy);
  }

  function done (e) {
    const obj = (e.type === 'touchend')? e.changedTouches[0]: e;

    if (obj.pageX && obj.pageY) movecb(obj.pageX - ox,obj.pageY - oy);

    document.removeEventListener('mouseup',done);
    window.removeEventListener('mousemove',move);
    document.removeEventListener('touchmove',move);
    document.removeEventListener('touchend',done);

    donecb();
  }

  function remove () {
    el.removeEventListener('mousedown',start);
    el.removeEventListener('touchstart',start);
  }

  return { remove };
};

export default Dragger;
