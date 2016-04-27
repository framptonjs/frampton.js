import preventDefault from 'frampton-events/prevent_default';

QUnit.module('Frampton.Events.preventDefault');

QUnit.test('Should call preventDefault and stopPropagation methods of event object', function() {
  var preventCalled = false;
  var stopCalled = false;
  const event = {
    preventDefault : function() {
      preventCalled = true;
    },
    stopPropagation : function() {
      stopCalled = true;
    }
  };

  preventDefault(event);

  equal(preventCalled, true);
  equal(stopCalled, true);
});