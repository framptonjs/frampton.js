/**
 * targetValue :: Object -> Any
 *
 * @name targetValue
 * @memberOf Frampton.Events
 * @static
 * @param {Object} target
 * @returns {Any}
 */
export default function target_value(target) {
  return (target.value || null);
}