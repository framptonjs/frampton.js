/**
 * @name ofValue
 * @method
 * @memberof Frampton.Utils
 * @param {*} value
 * @returns {Function}
 */
export default function of_value(value) {
  return function() {
    return value;
  };
}