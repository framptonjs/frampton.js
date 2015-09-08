import curryN from 'frampton-utils/curry_n';

/**
 * Takes a function and returns a new function that will wait to execute the original
 * function until it has received all of its arguments. Each time the function is called
 * without receiving all of its arguments it will return a new function waiting for the
 * remaining arguments.
 *
 * @name curry
 * @memberof Frampton.Utils
 * @method
 * @param {Function} curry - Function to curry.
 * @returns {Function} A curried version of the function passed in.
 */
export default function curry(fn) {
  return curryN(fn.length, fn);
}