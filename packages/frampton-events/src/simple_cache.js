import isNothing from 'frampton-utils/is_nothing';

export default function() {

  const store = {};

  return function(name, fn) {
    if (isNothing(store[name])) {
      store[name] = fn();
    }
    return store[name];
  };
}
