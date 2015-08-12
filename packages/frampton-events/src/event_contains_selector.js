import curry from 'frampton-utils/curry';
import compose from 'frampton-utils/compose';
import contains from 'frampton-style/contains';
import eventTarget from 'frampton-events/event_target';

// eventHasSelector :: String -> DomEvent -> Boolean
export default curry(function event_contains_selector(selector, evt) {
  return compose(contains(selector), eventTarget)(evt);
});