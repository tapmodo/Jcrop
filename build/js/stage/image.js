import Stage from './dom';
import ResizeObserver from 'resize-observer-polyfill';

function div (clname,el = document.createElement('div')) {
  el.className = clname;
  return el;
}

class ImageStage extends Stage {
  constructor (el,options) {
    const wrapper = div('jcrop-stage jcrop-image-stage');
    el.parentNode.insertBefore(wrapper, el);
    // CSS positioning changed
    // wrapper.appendChild(el);
    super(wrapper,options);
    this.srcEl = el;
    el.onload = this.resizeToImage.bind(this);
    this.resizeToImage();
    this.initResizeObserver();
  }

  initResizeObserver () {
    const ro = new ResizeObserver((entries, observer) => {
      this.resizeToImage();
    });
    ro.observe(this.srcEl);
  }

  resizeToImage () {
    const [w,h] = this.getImageDimensions();
    const [nw,nh] = this.getNaturalDimensions();
    this.el.style.width = w+'px';
    this.el.style.height = h+'px';
    this.rescaleWidgets(w/nw,h/nh);
    this.scalex = nw/w;
    this.scaley = nh/h;
    this.refresh();
  }

  rescaleWidgets (x,y) {
    this.crops.forEach(crop => {
      crop.pos = crop.sel.scale(x,y);
    });
  }

  getImageDimensions () {
    return [ this.srcEl.width, this.srcEl.height ];
  }

  getNaturalDimensions () {
    return [
      this.srcEl.naturalWidth || this.srcEl.width,
      this.srcEl.naturalHeight || this.srcEl.height
    ];
  }

  destroy () {
    this.el.remove();
  }
}

export default ImageStage;
