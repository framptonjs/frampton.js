import curry from 'frampton-utils/curry';
import compose from 'frampton-utils/compose';
import matches from 'frampton-style/matches';
import eventTarget from 'frampton-events/event_target';

// eventHasSelector :: String -> DomEvent -> Boolean
export default curry(function event_has_selector(selector, evt) {
  return compose(matches(selector), eventTarget)(evt);
});