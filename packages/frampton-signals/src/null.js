import EventStream from 'frampton-signals/event_stream';

var instance = null;

export default function null_stream() {
  return (instance !== null) ? instance : (instance = new EventStream(null, null));
}