import assert from 'frampton-utils/assert';
import curryN from 'frampton-utils/curry_n';
import isArray from 'frampton-utils/is_array';
import min from 'frampton-math/min';

export default curryN(2, function take(num, xs) {
  assert("Frampton.List.take recieved a non-array", isArray(xs));
  const newList = [];
  const len = min(xs.length, num);
  for (let i = 0; i < len; i++) {
    newList.push(xs[i]);
  }
  return newList;
});
