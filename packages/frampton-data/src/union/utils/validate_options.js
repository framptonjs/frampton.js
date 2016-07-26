import warn from 'frampton-utils/warn';
import wildcard from 'frampton-data/union/utils/wildcard';

function hasMatch(cases, child) {
  return (
    cases.hasOwnProperty(wildcard) ||
    cases.hasOwnProperty(child)
  );
}

export default function validate_options(parent, cases) {
  const children = parent.children;
  const len = children.length;
  for (let i = 0; i < len; i++) {
    let child = children[i];
    if (!hasMatch(cases, child)) {
      warn('Non-exhaustive pattern match for case: ' + child);
    }
  }
}
