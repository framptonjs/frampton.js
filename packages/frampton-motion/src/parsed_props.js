import reduceObj from 'frampton-object/reduce';
import contains from 'frampton-list/contains';
import supported from 'frampton-style/supported';
import transitionProps from 'frampton-motion/transition_props';

export default function parsed_props(props) {
  return reduceObj((acc, value, key) => {
    if (!contains(transitionProps, key)) {
      acc[supported(key)] = value;
    }
    return acc;
  }, {}, props);
}