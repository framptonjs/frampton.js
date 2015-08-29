import supported from 'frampton-style/supported';

export default function supported_props(props) {
  var obj = {};
  for (let key in props) {
    obj[supported(key)] = props[key];
  }
  return obj;
}