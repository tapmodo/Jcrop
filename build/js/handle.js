import DomObj from './domobj';

class Handle extends DomObj {
}

Handle.create = function (clname) {
  const el = document.createElement('div');
  el.className = clname;
  return new Handle(el);
};

export default Handle;
