import { wrap, replace, div } from '../util/dom';
import Stage from './dom';

class ImageStage extends Stage {
  constructor(el,options) {
    const wrapper = div('jcrop-stage jcrop-image-stage');
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
    super(wrapper,options);
    this.srcEl = el;
    el.onload = this.resizeToImage.bind(this);
    this.resizeToImage();
  }

  resizeToImage() {
    const w = this.srcEl.width;
    const h = this.srcEl.height;
    this.el.style.width = w+'px';
    this.el.style.height = h+'px';
    this.refresh();
  }
}

export default ImageStage;
