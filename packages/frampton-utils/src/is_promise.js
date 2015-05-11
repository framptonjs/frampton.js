import isObject from 'frampton-utils/is_object';
import isFunction from 'frampton-utils/is_function';

export default function isPromise(promise) {
  return (isObject(promise) && isFunction(promise.then));
}