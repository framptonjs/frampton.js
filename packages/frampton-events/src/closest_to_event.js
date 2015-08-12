import curry from 'frampton-utils/curry';
import compose from 'frampton-utils/compose';
import closest from 'frampton-style/closest';
import eventTarget from 'frampton-events/event_target';

// closestToEvent :: String -> DomEvent -> DomNode
export default curry(function closest_to_event(selector, evt) {
  return compose(closest(selector), eventTarget)(evt);
});