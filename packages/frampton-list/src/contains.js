import curry from 'frampton-utils/curry';

/**
 * @name contains
 * @method
 * @memberof Frampton.List
 * @param {Array} xs
 * @param {*}   obj
 * @retruns {Boolean}
 */
export default curry(function(xs, obj) {
  return (xs.indexOf(obj) > -1);
});