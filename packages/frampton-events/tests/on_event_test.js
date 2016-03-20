import onEvent from 'frampton-events/on_event';

QUnit.module('Frampton.Events.onEvent', {
  beforeEach() {
    this.container = document.getElementById('qunit-fixture');
  }
});

QUnit.test('Should create a signal that responds to events on a given target', function(assert) {
  const sig = onEvent('click', this.container).map(1);
  equal(sig(), undefined, 'Initial value is not undefined');
  this.container.click();
  equal(sig(), 1, 'Did not update to new value');
});