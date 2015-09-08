import { listen } from 'frampton-events/listen';

export default function once(eventName, target) {
  return listen(eventName, target).take(1);
}