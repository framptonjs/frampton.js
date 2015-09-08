import EventStream from 'frampton-signals/event_stream';
import { nextEvent } from 'frampton-signals/event';

/**
 * once :: a -> EventStream a
 *
 * @name of
 * @memberof Frampton.Signals
 * @static
 * @param {*} An initial value for the EventStream
 * @returns {Frampton.Signals.EventStream}
 */
export default function once(val) {
  return new EventStream((sink) => {
    sink(nextEvent(val));
  });
}