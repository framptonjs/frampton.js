import EventStream from 'frampton-signals/event_stream';
import { nextEvent } from 'frampton-signals/event';
import { addListener } from 'frampton-events/event_dispatcher';

export default function get_event_stream(name, target) {
  return new EventStream((sink) => {
    return addListener(
      name,
      evt => sink(nextEvent(evt)),
      target
    );
  });
}