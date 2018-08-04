import extend from './util/extend';
import defaults from './defaults';
import Stage from './stage/dom';
import ImageStage from './stage/image';
import Cropper from './cropper';
import Shade from './shade';
import Handle from './handle';
import Dragger from './dragger';
import Rect from './rect';
import Sticker from './sticker';
import DomObj from './domobj';
import Easing from './easing';

export function attach(el,options={}) {
  options = extend({},defaults,options);

  if (typeof el == 'string') el = document.getElementById(el);
  if (el.tagName == 'IMG') return new ImageStage(el,options);
  console.log('hi hi');

  return new Stage(el,options);
}

export { Stage, defaults, Dragger, Cropper, Rect, Handle, Sticker, Easing };

