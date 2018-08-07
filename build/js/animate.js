import Easing from './easing';

function Animate(el,from,to,cb,frames=30,easingFunc='swing') {
  const p = ['x','y','w','h'];
  const cur = from.normalize();
  console.log(easingFunc);
  easingFunc = (typeof easingFunc == 'string')? Easing[easingFunc] : easingFunc;

  var cur_frame = 0;

  return new Promise((resolve,reject) => {
    const step = () => {

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

      else resolve();
    }

    requestAnimationFrame(step);
  });
}

export default Animate;
