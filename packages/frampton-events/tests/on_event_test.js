import onEvent from 'frampton-events/on_event';

QUnit.module('Frampton.Events.onEvent', {
  beforeEach() {
    this.container = document.getElementById('qunit-fixture');
  }
});

QUnit.test('Should create a signal that responds to events on a given target', function(assert) {
  const sig = onEvent('click', this.container).map(1);
  assert.equal(sig.get(), undefined, 'Initial value is not undefined');
  this.container.click();
  assert.equal(sig.get(), 1, 'Did not update to new value');
});
