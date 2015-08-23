import stepper from 'frampton-signals/stepper';
import eventValue from 'frampton-events/event_value';
import listen from 'frampton-events/listen';
import length from 'frampton-list/length';

export default function ui_input(element) {

  var tagName = element.tagName.toLowerCase();
  var localInputs = listen('input', element);
  var localChanges = listen('change', element);
  var localBlurs = listen('blur', element);
  var localFocuses = listen('focus', element);
  var focused = localBlurs.map(false).merge(localFocuses.map(true));
  var values = localInputs.merge(localChanges).map(eventValue);

  var initialValue = (function() {
    switch (tagName) {
      case 'input':
      case 'select':
      case 'textarea':
        return element.value;
      default:
        var temp = element.querySelector('input, select, textarea');
        return (temp && temp.value) ? temp.value : '';
    }
  }());

  return {
    element   : element,
    change    : localChanges,
    input     : localInputs,
    blur      : localBlurs,
    focus     : localFocuses,
    isFocused : stepper(false, focused),
    value     : stepper(initialValue, values),
    length    : stepper(initialValue.length, values.map(length))
  };
}