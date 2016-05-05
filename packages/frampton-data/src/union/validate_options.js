import warn from 'frampton-utils/warn';
import wildcard from 'frampton-data/union/wildcard';

export default function validate_options(obj, cases) {
  for (let i = 0; i < obj.keys.length; i++) {
    if (!cases.hasOwnProperty(wildcard) && !cases.hasOwnProperty(obj.keys[i])) {
      warn('Non-exhaustive pattern match for case: ', obj.keys[i]);
    }
  }
}