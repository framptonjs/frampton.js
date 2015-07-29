import {
  stepper,
  listen
} from 'frampton-signals';

import {
  contains,
  eventValue
} from 'frampton-events';

var inputs = listen('input', document);
var changes = listen('change', document);
var blurs = listen('blur', document);
var focuses = listen('focus', document);

export default function ui_input(element) {

  var localInputs = inputs.filter(contains(element));
  var localChanges = changes.filter(contains(element));
  var localBlurs = blurs.filter(contains(element));
  var localFocuses = focuses.filter(contains(element));
  var focused = localBlurs.map(false).merge(localFocuses.map(true));
  var values = localInputs.merge(localChanges).map(eventValue);

  return {
    change    : localChanges,
    input     : localInputs,
    blur      : localBlurs,
    focus     : localFocuses,
    isFocused : stepper(false, focused),
    value     : stepper('', values)
  };
}