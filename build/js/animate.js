import Easing from './easing';

function Animate(el,from,to,cb,frames=30,easingFunc='swing') {
  const p = ['x','y','w','h'];
  const delta = {};
  const cur = from.normalize();
  easingFunc = (typeof easingFunc == 'string')? Easing[easingFunc] : easingFunc;

  var cur_frame = 0;

  p.forEach(key => delta[key] = (to[key] - from[key]) / frames);

  function step() {

    if (cur_frame < frames) {

      p.forEach(key => 
        cur[key] = Math.round(
          easingFunc(cur_frame, from[key], to[key] - from[key], frames)
        )
      );

      cb(cur);
      cur_frame++;
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

export default Animate;
