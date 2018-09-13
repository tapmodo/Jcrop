import extend from './util/extend';
import defaults from './defaults';
import Stage from './stage/dom';
import ImageStage from './stage/image';
import Widget from './widget';
import Shade from './shade';
import Handle from './handle';
import Dragger from './dragger';
import Rect from './rect';
import Sticker from './sticker';
import DomObj from './domobj';
import easing from './easing';
import load from './loader';

export function attach (el,options={}) {
  options = extend({},defaults,options);

  if (typeof el === 'string') el = document.getElementById(el);
  if (el.tagName === 'IMG') return new ImageStage(el,options);

  return new Stage(el,options);
}

export { Stage, defaults, Dragger, Widget, Rect, Handle, Sticker, easing, load, Shade, DomObj };

export default { Stage, defaults, Dragger, Widget, Rect, Handle, Sticker, easing, load, attach, Shade, DomObj };
