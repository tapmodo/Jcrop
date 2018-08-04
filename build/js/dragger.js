/*
  Dragger function - sets up dragging callbacks on an element
*/

const Dragger = function(el,startcb,movecb,donecb){
  var ox, oy;
  if (typeof el == 'string') el = document.getElementById(el);

  el.addEventListener('mousedown',start);
  el.addEventListener('touchstart',start);

  function start(e) {
    ox = e.pageX;
    oy = e.pageY;

    e.preventDefault();
    e.stopPropagation();

    if (!startcb(ox,oy,e)) return;

    if (e.type == 'mousedown') {
      window.addEventListener('mousemove',move);
      document.addEventListener('mouseup',done);
    }
    else if (e.type == 'touchstart') {
      document.addEventListener('touchmove',move);
      document.addEventListener('touchend',done);
    }
  }

  function move(e) {
    e.preventDefault();
    e.stopPropagation();

    movecb(e.pageX - ox,e.pageY - oy);
  }

  function done(e) {
    if (e.pageX && e.pageY)
      movecb(e.pageX - ox,e.pageY - oy);

    document.removeEventListener('mouseup',done);
    window.removeEventListener('mousemove',move);
    document.removeEventListener('touchmove',move);
    document.removeEventListener('touchend',done);

    donecb();
  }

  function remove() {
    el.removeEventListener('mousedown',start);
    el.removeEventListener('touchstart',start);
  }

  return { remove };
}

export default Dragger;
