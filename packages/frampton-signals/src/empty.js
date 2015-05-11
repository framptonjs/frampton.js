import EventStream from 'frampton-signals/event_stream';

export default function empty_stream() {
  return new EventStream(null, null);
}