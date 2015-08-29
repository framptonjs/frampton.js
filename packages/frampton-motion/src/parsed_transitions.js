import supported from 'frampton-style/supported';

export default function parsed_transitions(props) {
  var trans = {};
  trans[supported('transition-property')] = Object.keys(props).join(', ');
  return trans;
}