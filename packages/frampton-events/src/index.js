import Frampton from 'frampton/namespace';
import listen from 'frampton-events/listen';
import contains from 'frampton-events/contains';
import eventTarget from 'frampton-events/event_target';
import eventValue from 'frampton-events/event_value';
import getPosition from 'frampton-events/get_position';
import getPositionRelative from 'frampton-events/get_position_relative';
import targetValue from 'frampton-events/target_value';

Frampton.Events                     = {};
Frampton.Events.listen              = listen;
Frampton.Events.contains            = contains;
Frampton.Events.eventTarget         = eventTarget;
Frampton.Events.eventValue          = eventValue;
Frampton.Events.targetValue         = targetValue;
Frampton.Events.getPosition         = getPosition;
Frampton.Events.getPositionRelative = getPositionRelative;