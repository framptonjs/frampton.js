import Frampton from 'frampton/namespace';
import onEvent from 'frampton-events/on_event';
import onSelector from 'frampton-events/on_selector';
import contains from 'frampton-events/contains';
import eventTarget from 'frampton-events/event_target';
import eventValue from 'frampton-events/event_value';
import getPosition from 'frampton-events/get_position';
import getPositionRelative from 'frampton-events/get_position_relative';
import hasSelector from 'frampton-events/has_selector';
import containsSelector from 'frampton-events/contains_selector';
import selectorContains from 'frampton-events/selector_contains';
import closestToEvent from 'frampton-events/closest_to_event';
import preventDefault from 'frampton-events/prevent_default';

/**
 * @name Events
 * @namespace
 * @memberof Frampton
 */
Frampton.Events                     = {};
Frampton.Events.onEvent             = onEvent;
Frampton.Events.onSelector          = onSelector;
Frampton.Events.contains            = contains;
Frampton.Events.eventTarget         = eventTarget;
Frampton.Events.eventValue          = eventValue;
Frampton.Events.hasSelector         = hasSelector;
Frampton.Events.containsSelector    = containsSelector;
Frampton.Events.selectorContains    = selectorContains;
Frampton.Events.getPosition         = getPosition;
Frampton.Events.getPositionRelative = getPositionRelative;
Frampton.Events.closestToEvent      = closestToEvent;
Frampton.Events.preventDefault      = preventDefault;