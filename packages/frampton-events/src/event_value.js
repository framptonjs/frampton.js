import compose from 'frampton-utils/compose';
import eventTarget from 'frampton-events/event_target';
import targetValue from 'frampton-events/target_value';

/**
 * eventValue :: DomEvent -> String
 *
 * @name eventValue
 * @memberOf Frampton.Events
 * @static
 * @param {Object} evt
 * @returns {String} The value property of the event target
 */
export default compose(targetValue, eventTarget);