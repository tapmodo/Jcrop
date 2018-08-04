import extend from '../util/extend';
import Defaults from '../defaults';
import Cropper from '../cropper';
import Shade from '../shade';
import Handle from '../handle';
import Dragger from '../dragger';
import Rect from '../rect';
import Sticker from '../sticker';
import DomObj from '../domobj';
import Easing from '../easing';
import Stage from './dom';
//import ImageStage from './image';

/*
Stage.attach = function(el,options={}) {
  options = extend({},Defaults,options);

  if (typeof el == 'string') el = document.getElementById(el);
  if (el.tagName == 'IMG') return new ImageStage(el,options);
  console.log('hi hi');

  return new Stage(el,options);
}
*/

Stage.defaults = Defaults;
Stage.Dragger = Dragger;
Stage.Cropper = Cropper;
Stage.Rect = Rect;
Stage.Handle = Handle;
Stage.Sticker = Sticker;
Stage.Easing = Easing;

export default Stage;
