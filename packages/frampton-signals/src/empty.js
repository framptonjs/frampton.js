import EventStream from 'frampton-signals/event_stream';

/**
 * Creates an emtpy EventStream
 *
 * @name empty
 * @method
 * @memberof Frampton.Signals
 * @returns {Frampton.Signals.EventStream}
 */
export default function empty_stream() {
  return new EventStream(null, null);
}