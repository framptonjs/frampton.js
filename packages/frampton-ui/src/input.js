import stepper from 'frampton-signals/stepper';
import eventValue from 'frampton-events/event_value';
import listen from 'frampton-events/listen';
import length from 'frampton-list/length';

export default function ui_input(element) {

  var localInputs = listen('input', element);
  var localChanges = listen('change', element);
  var localBlurs = listen('blur', element);
  var localFocuses = listen('focus', element);
  var focused = localBlurs.map(false).merge(localFocuses.map(true));
  var values = localInputs.merge(localChanges).map(eventValue);

  return {
    element   : element,
    change    : localChanges,
    input     : localInputs,
    blur      : localBlurs,
    focus     : localFocuses,
    isFocused : stepper(false, focused),
    value     : stepper((element.value || ''), values),
    length    : stepper((element.value.length), values.map(length))
  };
}