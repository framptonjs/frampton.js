import assert from 'frampton-utils/assert';
import validState from 'frampton-history/valid_state';

export default function with_valid_state(fn) {
  return function(state) {
    assert('State not valid', validState(state));
    fn(state);
  };
}