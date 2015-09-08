import EventStream from 'frampton-signals/event_stream';
import { nextEvent } from 'frampton-signals/event';

/**
 * Creates a new stream that fires for each animation frame.
 *
 * @name interval
 * @method
 * @memberof Frampton.Signals
 * @returns {Frampton.Signals.EventStream} A new EventStream
 */
export default function interval() {
  return new EventStream((sink) => {

    var frame = 0;
    var requestId = null;
    var isStopped = false;

    requestId = requestAnimationFrame(function step() {
      sink(nextEvent(frame++));
      if (!isStopped) requestId = requestAnimationFrame(step);
    });

    return function interval_destroy() {
      cancelAnimationFrame(requestId);
      isStopped = true;
      requestId = null;
    };
  });
}