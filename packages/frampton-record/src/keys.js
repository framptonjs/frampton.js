import isFunction from 'frampton-utils/is_function';

const hasOwnProp = Object.prototype.hasOwnProperty;

function getKeys(obj) {
  const result = [];
  for (let key in obj) {
    if (hasOwnProp.call(obj, key)) {
      result.push(key);
    }
  }
  return result;
}

export default function(obj) {
  if (isFunction(Object.keys)) {
    return Object.keys(obj).filter((key) => {
      return hasOwnProp.call(obj, key);
    });
  } else {
    return getKeys(obj);
  }
}