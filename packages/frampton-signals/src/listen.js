import { curry } from 'frampton-utils';
import EventStream from 'frampton-signals/event_stream';
import { nextEvent } from 'frampton-signals/event';
import { addListener } from 'frampton-events';

// listen :: String -> Dom -> EventStream Event
export default curry(function listen(eventName, target) {
  return new EventStream((sink) => {
    return addListener(
      eventName,
      evt => sink(nextEvent(evt)),
      target
    );
  });
});