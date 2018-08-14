import extend from './util/extend';
import DomObj from './domobj';
import Defaults from './defaults';

class ConfObj extends DomObj {

  constructor(el,options={}) {
    super(el);
    this.options = {};
    this.setOptions(extend({},Defaults,options));
  }

  setOptions(options){
    this.options = extend({},this.options,options);
    return this;
  }

}

export default ConfObj;
