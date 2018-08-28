import extend from './util/extend';
import DomObj from './domobj';
import Defaults from './defaults';

class ConfObj extends DomObj {

  constructor (el, options = {}) {
    super(el);
    this.options = {};
    Object.defineProperty(this, '_optconf', {
      configurable: false,
      enumerable: false,
      value: {},
      writable: true
    });
    this.initOptions();
    this.setOptions(extend({},Defaults,options));
  }

  setOptions (options) {
    this.options = extend({},this.options,options);

    Object.keys(options).forEach(key => {
      if (this._optconf[key]) this._optconf[key](options[key]);
    });

    return this;
  }

  initOptions () { }

}

export default ConfObj;
