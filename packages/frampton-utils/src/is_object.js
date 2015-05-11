import isSomething from 'frampton-utils/is_something';
import isArray from 'frampton-utils/is_array';

export default function isObject(obj) {
  return (isSomething(obj) && !isArray(obj) && typeof obj === 'object');
}