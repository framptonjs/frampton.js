import curry from 'frampton-utils/curry';

/**
 * @name contains
 * @memberOf Frampton.List
 * @static
 * @param {Array} xs
 * @param {Any}   obj
 * @retruns {Boolean}
 */
export default curry(function(xs, obj) {
  return (xs.indexOf(obj) > -1);
});