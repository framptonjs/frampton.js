import { curry } from 'frampton-utils';

// add :: Number -> Number -> Number
export default curry(function add(a, b) {
  return a + b;
});