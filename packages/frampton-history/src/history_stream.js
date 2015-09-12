import isNothing from 'frampton-utils/is_nothing';
import history from 'frampton-history/get_history';
import stack from 'frampton-history/stack_stream';
import popstate from 'frampton-history/popstate_stream';

var instance = null;

/**
 * Returns a stream of the current window.history
 *
 * @name historyStream
 * @method
 * @private
 * @memberof Frampton.History
 * @returns {Frampton.Signals.EventStream}
 */
export default function history_stream() {

  if (isNothing(instance)) {
    instance = stack().merge(popstate()).map(() => history());
  }

  return instance;
}