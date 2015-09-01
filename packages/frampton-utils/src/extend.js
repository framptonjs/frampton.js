import foldl from 'frampton-list/foldl';

/**
 * Extends one object with one or more other objects
 *
 * @name extend
 * @memberOf Frampton.Utils
 * @static
 * @param {Object} base
 * @param {Object} args
 * @returns {Object}
 */
export default function extend(base, ...args) {
  return foldl(function(acc, next) {
    var key;
    for (key in next) {
      acc[key] = next[key];
    }
    return acc;
  }, base, args);
}