import Defaults from './defaults';
import Cropper from './cropper';
import Stage from './stage/basic';

alert('controller');

class Controller {
  constructor(el) {
    if (typeof el == 'string') el = document.getElementById(el);
    this.el = el;
    this.crops = new Set;
  }
}

Controller.attach = function(el) {
}

Controller.Cropper = Cropper;
Controller.Stage = Stage;

export default Controller;
