export const wrap = (target, wrapper=document.createElement('div')) => {
  [ ...target.childNodes ].forEach(child => wrapper.appendChild(child));
  target.appendChild(wrapper);
  return wrapper;
};

export const replace = (orig, target) => {
  orig.parentElement.replaceChild(target,orig);
};

