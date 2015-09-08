import isSomething from 'frampton-utils/is_something';
import isDefined from 'frampton-utils/is_defined';
import normalizeNewline from 'frampton-string/normalize_newline';

/**
 * @name length
 * @memberof Frampton.String
 * @static
 * @param {String}
 * @returns {Number}
 */
export default function length(str) {
  return (isSomething(str) && isDefined(str.length)) ? normalizeNewline(str).length : 0;
}