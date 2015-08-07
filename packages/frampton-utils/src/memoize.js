export default function memoize(fn, thisArg) {

  var store = {};

  return function(...args) {

    var key  = JSON.stringify(args);

    if (key in store) {
      return store[key];
    } else {
      return (store[key] = fn.apply((thisArg || null), args));
    }
  };
}