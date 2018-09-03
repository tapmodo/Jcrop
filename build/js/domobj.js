class DomObj {

  constructor (el) {
    if (typeof el === 'string') el = document.getElementById(el);
    this.el = el;
  }

  appendTo (el) {
    if (typeof el === 'string') el = document.getElementById(el);
    el.appendChild(this.el);
    return this;
  }

  emit (evname) {
    const ev = document.createEvent('Event');
    ev.initEvent(evname, true, true);
    ev.cropTarget = this;
    this.el.dispatchEvent(ev);
  }

  removeClass (cl) {
    this.el.className = this.el.className
      .split(' ').filter(i => cl !== i).join(' ');
    return this;
  }

  hasClass (cl) {
    return this.el.className.split(' ').filter(i => cl === i).length;
  }

  addClass (cl) {
    if (!this.hasClass(cl)) this.el.className += ' ' + cl;
    return this;
  }

  listen (evname,handler) {
    this.el.addEventListener(evname,e => handler(e.cropTarget,e));
    return this;
  }

}

export default DomObj;

