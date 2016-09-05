import isSomething from 'frampton-utils/is_something';
import wildcard from 'frampton-data/union/utils/wildcard';

/**
 * @name getMatch
 * @memberof Frampton.Data.Union.Utils
 * @param {}
 * @param {}
 */
export default function get_match(child, cases) {
  const match = cases[child.ctor];
  if (isSomething(match)) {
    return match;
  } else {
    return cases[wildcard];
  }
}
