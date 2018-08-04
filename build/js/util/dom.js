export const wrap = (target, wrapper=document.createElement('div')) => {
  [ ...target.childNodes ].forEach(child => wrapper.appendChild(child));
  target.appendChild(wrapper);
  return wrapper;
};

export const div = (clname,el=document.createElement('div')) => {
  el.className = clname;
  return el;
};

export const replace = (orig, target) => {
  orig.parentElement.replaceChild(target,orig);
  return target;
};

