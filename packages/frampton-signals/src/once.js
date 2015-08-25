import EventStream from 'frampton-signals/event_stream';
import { nextEvent } from 'frampton-signals/event';

/**
 * once :: a -> EventStream a
 *
 * @name of
 * @memberOf Frampton.Signals
 * @static
 * @param {Any} An initial value for the EventStream
 * @returns {EventStream}
 */
export default function once(val) {
  return new EventStream((sink) => {
    sink(nextEvent(val));
  });
}