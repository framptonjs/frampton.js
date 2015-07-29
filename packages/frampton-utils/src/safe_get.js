import curry from 'frampton-utils/curry';
import get from 'frampton-utils/get';
import { Maybe } from 'frampton-data/maybe';

//+ safeGet :: String -> Object -> Maybe Any
export default curry(function safe_get(prop, obj) {
  return Maybe.of(get(prop, obj));
});