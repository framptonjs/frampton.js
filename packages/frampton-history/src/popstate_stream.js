import isNothing from 'frampton-utils/is_nothing';
import { listen } from 'frampton-events/listen';
import { popHistory, pushHistory, stack } from 'frampton-history/history_stack';

var instance = null;

/**
 * Returns a stream of popstate events. Also helps to internally keep track of
 * the current depth of the history stack.
 *
 * @name popstateStream
 * @method
 * @private
 * @memberof Frampton.History
 * @returns {Frampton.Signals.EventStream}
 */
export default function popstate_stream() {

  if (!window.history || !window.history.pushState) {
    throw new Error('History API is not supported by this browser');
  }

  if (isNothing(instance)) {
    instance = listen('popstate', window).map((evt) => {
      if (evt.state) {
        if (evt.state.id < stack.current) {
          popHistory();
        } else if (evt.state.id > stack.current) {
          pushHistory(evt.state);
        }
      }
      return evt;
    });
  }

  return instance;
}