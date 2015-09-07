import stepper from 'frampton-signals/stepper';
import location from 'frampton-history/get_location';
import searchStream from 'frampton-history/search_stream';
import parseSearch from 'frampton-history/parse_search';

var instance = null;

/**
 * A Behavior representing the current location.search
 *
 * @name search
 * @method
 * @memberof Frampton.History
 * @returns {Frampton.Signals.Behavior}
 */
export default function search() {
  if (!instance) {
    instance = stepper(
      parseSearch(location().search || ''),
      searchStream()
    );
  }
  return instance;
}