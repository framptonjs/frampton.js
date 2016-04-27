import isFunction from 'frampton-utils/is_function';
import isObject from 'frampton-utils/is_object';

export default function(evt) {
  if (isObject(evt) && isFunction(evt.preventDefault) && isFunction(evt.stopPropagation)) {
    evt.preventDefault();
    evt.stopPropagation();
  }
  return evt;
}