import curry from 'frampton-utils/curry';
import compose from 'frampton-utils/compose';
import contains from 'frampton-style/contains';
import eventTarget from 'frampton-events/event_target';

// containsSelector :: String -> DomEvent -> Boolean
export default curry(function contains_selector(selector, evt) {
  return compose(contains(selector), eventTarget)(evt);
});