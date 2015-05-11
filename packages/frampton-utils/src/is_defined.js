import isUndefined from 'frampton-utils/is_undefined';

export default function isDefined(obj) {
  return !isUndefined(obj);
}