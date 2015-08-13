import curry from 'frampton-utils/curry';
import compose from 'frampton-utils/compose';
import matches from 'frampton-style/matches';
import eventTarget from 'frampton-events/event_target';

// hasSelector :: String -> DomEvent -> Boolean
export default curry(function has_selector(selector, evt) {
  return compose(matches(selector), eventTarget)(evt);
});