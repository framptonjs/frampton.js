import isFunction from 'frampton-utils/is_function';
import isString from 'frampton-utils/is_string';

export default function is_signal(obj) {
  return (
    isFunction(obj) &&
    isString(obj.ctor) &&
    obj.ctor === 'Frampton.Signal'
  );
}
