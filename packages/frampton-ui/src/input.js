import { stepper } from 'frampton-signals';

import {
  eventValue,
  listen
} from 'frampton-events';

export default function ui_input(element) {

  var localInputs = listen('input', element);
  var localChanges = listen('change', element);
  var localBlurs = listen('blur', element);
  var localFocuses = listen('focus', element);
  var focused = localBlurs.map(false).merge(localFocuses.map(true));
  var values = localInputs.merge(localChanges).map(eventValue);

  return {
    change    : localChanges,
    input     : localInputs,
    blur      : localBlurs,
    focus     : localFocuses,
    isFocused : stepper(false, focused),
    value     : stepper((element.value || ''), values)
  };
}