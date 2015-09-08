import compose from 'frampton-utils/compose';
import elementValue from 'frampton-html/element_value';
import eventTarget from 'frampton-events/event_target';

/**
 * eventValue :: DomEvent -> String
 *
 * @name eventValue
 * @memberof Frampton.Events
 * @static
 * @param {Object} evt
 * @returns {String} The value property of the event target
 */
export default compose(elementValue, eventTarget);