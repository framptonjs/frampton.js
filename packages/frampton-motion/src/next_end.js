import noop from 'frampton-utils/noop';
import once from 'frampton-events/once';
import transitionend from 'frampton-motion/transition_end';

export default function next_end(element, fn) {
  once(transitionend, element).next((evt) => {
    (fn || noop)(evt);
  });
}