import preventDefault from 'frampton-events/prevent_default';

QUnit.module('Frampton.Events.preventDefault');

QUnit.test('Should call preventDefault and stopPropagation methods of event object', function(assert) {
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

  assert.equal(preventCalled, true);
  assert.equal(stopCalled, true);
});
