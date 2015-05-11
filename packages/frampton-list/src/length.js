import isArray from 'frampton-utils/is_array';

/**
 * @name length
 * @memberOf Frampton
 * @static
 */
export default function length(xs) {
  return (isArray(xs)) ? xs.length : 0;
}