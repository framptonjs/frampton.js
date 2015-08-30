/**
 * Returns a string with newlines normalized to \n. Windows machines will use
 * \r\n for newlines which can lead to irregularities when dealing with strings
 *
 * @name normalizeNewline
 * @memberOf Frampton.String
 * @static
 * @param {String} str
 * @returns {String}
 */
export default function normalize_newline(str) {
  return str.replace(/\r\n/g, '\n');
}