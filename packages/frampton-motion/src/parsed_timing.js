import supported from 'frampton-style/supported';

export default function parsed_timing(props) {

  var timing = {};

  if (props['transition-delay'] || props['delay']) {
    timing[supported('transition-delay')] =
      props['transition-delay'] || props['delay'];
  }

  if (props['transition-duration'] || props['duration']) {
    timing[supported('transition-duration')] =
      props['transition-duration'] || props['duration'];
  }

  return timing;
}