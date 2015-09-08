import supported from 'frampton-style/supported';

/**
 * @name supportedProps
 * @method
 * @memberof Frampton.Style
 * @param {Object} props
 * @returns {Object}
 */
export default function supported_props(props) {
  var obj = {};
  for (let key in props) {
    obj[supported(key)] = props[key];
  }
  return obj;
}