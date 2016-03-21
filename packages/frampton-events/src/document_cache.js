import isNothing from 'frampton-utils/is_nothing';

const store = {};

export default function(name, fn) {
  if (isNothing(store[name])) {
    store[name] = fn();
  }
  return store[name];
}