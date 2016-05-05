import isEmpty from 'frampton-utils/is_empty';
import createSignal from 'frampton-signal/create';
import { mergeMany } from 'frampton-signal/create';
import { addListener } from 'frampton-events/event_dispatcher';

export default function get_event_signal(name, target) {
  const parts = name.split(' ').filter((val) => !isEmpty(val));
  const len = parts.length;
  const sigs = [];
  var temp;
  for (let i = 0; i < len; i++) {
    temp = createSignal();
    addListener(parts[i], target, temp);
    sigs.push(temp);
  }
  return mergeMany(sigs);
}