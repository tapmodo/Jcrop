// IMAGE LOADING/LOADED FUNCTIONS
// returns a promise that resolves when image is loaded
// if it's already loaded, the promise will resolve immediately
function Loader (img) {
  if (typeof img === 'string') img = document.getElementById(img);

  return new Promise(function (resolve,reject) {
    if (Loader.check(img)) return resolve(img);

    function handler (e) {
      img.removeEventListener('load',handler);
      img.removeEventListener('error',handler);
      (e.type === 'load')? resolve(img): reject(img);
    }

    img.addEventListener('load',handler);
    img.addEventListener('error',handler);
  });
}

// static method to check if image is completely loaded
Loader.check = function (img) {
  if (!img.complete) return false;
  if (img.naturalWidth === 0) return false;
  return true;
};

export default Loader;
