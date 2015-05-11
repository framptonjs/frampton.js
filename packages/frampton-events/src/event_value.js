import compose from 'frampton-utils/compose';
import eventTarget from 'frampton-events/event_target';
import targetValue from 'frampton-events/target_value';

export default compose(targetValue, eventTarget);