import curry from 'frampton-utils/curry';
import drop from 'frampton-list/drop';
import EventStream from 'frampton-signals/event_stream';
import { nextEvent } from 'frampton-signals/event';

/**
 * Creates a new stream that sequentially emits the values of the given
 * array with the provided delay between each value.
 * @name sequential
 * @method
 * @memberof Frampton.Signals
 * @param {Number} delay Millisecond delay
 * @param {Array}  arr   Array of values
 * @returns {Frampton.Signals.EventStream} A new EventStream
 */
export default curry(function sequential(delay, arr) {
  return new EventStream(function(sink) {

    var stream = this;
    var isStopped = false;
    var timerId = null;

    function step(arr) {
      timerId = setTimeout(() => {
        sink(nextEvent(arr[0]));
        timerId = null;
        if (arr.length > 1 && !isStopped) {
          step(drop(1, arr));
        } else {
          stream.close();
        }
      }, delay);
    }

    step(arr);

    return function sequential_destroy() {
      if (timerId) {
        clearTimeout(timerId);
        timerId = null;
      }
      isStopped = true;
      stream = null;
      arr = null;
    };
  });
});