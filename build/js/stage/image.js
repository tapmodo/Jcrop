import Stage from './dom';

function div (clname,el = document.createElement('div')) {
  el.className = clname;
  return el;
}

class ImageStage extends Stage {
  constructor (el,options) {
    const wrapper = div('jcrop-stage jcrop-image-stage');
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
    super(wrapper,options);
    this.srcEl = el;
    el.onload = this.resizeToImage.bind(this);
    this.resizeToImage();
  }

  resizeToImage () {
    const w = this.srcEl.width;
    const h = this.srcEl.height;
    this.el.style.width = w+'px';
    this.el.style.height = h+'px';
    this.refresh();
  }

  destroy () {
    this.el.parentNode.insertBefore(this.srcEl,this.el);
    this.el.remove();
  }
}

export default ImageStage;
