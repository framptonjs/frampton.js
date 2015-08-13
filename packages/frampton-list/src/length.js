import isSomething from 'frampton-utils/is_something';
import isDefined from 'frampton-utils/is_defined';

/**
 * @name length
 * @memberOf Frampton
 * @static
 */
export default function length(xs) {
  return (isSomething(xs) && isDefined(xs.length)) ? xs.length : 0;
}