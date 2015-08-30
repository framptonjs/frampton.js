import curry from 'frampton-utils/curry';
import EventStream from 'frampton-signals/event_stream';
import { nextEvent } from 'frampton-signals/event';

// delayed :: Number -> a -> EventStream a
export default curry(function delayed(delay, val) {
  return new EventStream(function(sink) {
    var timer = setTimeout(function() {
      sink(nextEvent(val));
    }, (delay || 0));
    return function delayed_cleanup() {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    };
  });
});