import isUndefined from 'frampton-utils/is_undefined';
import isNull from 'frampton-utils/is_null';

export default function isNothing(obj) {
  return (isUndefined(obj) || isNull(obj));
}