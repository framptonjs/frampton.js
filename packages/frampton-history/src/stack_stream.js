import isNothing from 'frampton-utils/is_nothing';
import empty from 'frampton-signals/empty';

var instance = null;

/**
 * EventStream of changes to the history stack
 *
 * @name stackStream
 * @member
 * @private
 * @memberof Frampton.History
 * @returns {Frampton.Signals.EventStream}
 */
export default function stack_stream() {

  if (isNothing(instance)) {
    instance = empty();
  }

  return instance;
}