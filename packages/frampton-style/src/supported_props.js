import warn from 'frampton-utils/warn';
import supported from 'frampton-style/supported';

/**
 * @name supportedProps
 * @method
 * @memberof Frampton.Style
 * @param {Object} props
 * @returns {Object}
 */
export default function supported_props(props) {
  const obj = {};
  var temp;
  for (let key in props) {
    temp = supported(key);
    if (temp) {
      obj[supported(key)] = props[key];
    } else {
      warn('style prop ' + key  + ' is not supported by this browser');
    }
  }
  return obj;
}