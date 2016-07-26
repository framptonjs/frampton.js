import curry from 'frampton-utils/curry';

// isKey :: KeyCode -> KeyCode -> Boolean
export default curry(function is_key(key, keyCode) {
  return key === keyCode;
});