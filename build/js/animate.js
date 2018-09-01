import easing from './easing';

// Animate function uses requestAnimationFrame to sequence events
// Easing functions adapted from jQuery-ui and Robert Penner's equations
// el - element to animate
// from and to - "rect" objects representing initial and target coordinates
// cb - callback receives a "rect" object for each update/frame
// frames - number of frames to animate
// efunc - name of easing function to use
// returns a Promise that resolves when the animation is complete

function Animate (el,from,to,cb,frames=30,efunc='swing') {
  // Set the keys to update, in this case it is our Rect's properties
  // Normalize the initial state as a Rect named "cur"
  const p = ['x','y','w','h'];
  const cur = from.normalize();

  // Lookup the easing function if it is a string
  efunc = (typeof efunc === 'string')? easing[efunc] : efunc;

  var curFrame = 0;

  // Return a promise that will resolve when the animation is complete
  return new Promise((resolve,reject) => {
    function step () {
      if (curFrame < frames) {
        // Update each key for this frame
        p.forEach(key => {
          cur[key] = Math.round(efunc(curFrame,from[key],to[key]-from[key],frames));
        });

        // Send it to the callback function
        // update the current frame counter
        // and request the next animation frame
        cb(cur);
        curFrame++;
        requestAnimationFrame(step);
      } else {
        // We've reached the end of the animation frames
        cb(to);
        resolve();
      }
    }

    requestAnimationFrame(step);
  });
}

export default Animate;
