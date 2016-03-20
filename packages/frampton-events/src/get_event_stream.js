import createSignal from 'frampton-signal/create';
import { addListener } from 'frampton-events/event_dispatcher';

export default function get_event_stream(name, target) {
  const sig = createSignal();
  addListener(name, target, sig);
  return sig;
}