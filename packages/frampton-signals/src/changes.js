import EventStream from 'frampton-signals/event_stream';
import { nextEvent } from 'frampton-signals/event';

/**
 * changes :: Behavior a -> EventStream a
 *
 * Takes a Behavior and returns and EventStream that updates when the
 * value of the Behavior changes
 *
 * @name changes
 * @memberof Frampton.Signals
 * @static
 * @param {Behavior} behavior A behavior to feed the EventStream
 * @returns {Frampton.Signals.EventStream}
 */
export default function changes(behavior) {
  return new EventStream((sink) => {

    behavior.changes((val) => {
      sink(nextEvent(val));
    });

    return function changes_cleanup() {
      behavior.destroy();
      behavior = null;
    };
  });
}