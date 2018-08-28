export default function extend () {
  var extended = {};

  for (let key in arguments) {
    var argument = arguments[key];
    for (let prop in argument) {
      if (Object.prototype.hasOwnProperty.call(argument, prop)) {
        extended[prop] = argument[prop];
      }
    }
  }

  return extended;
};

