import createSignal from 'frampton-signal/create';
import stepper from 'frampton-signal/stepper';

QUnit.module('Frampton.Signal.stepper');

QUnit.test('Should create a signal with initial value', function(assert) {
  const updater = createSignal();
  const sig = stepper(5, updater);
  assert.equal(sig.get(), 5);
});

QUnit.test('Should create a signal that updates with another singal', function(assert) {
  const updater = createSignal();
  const sig = stepper(5, updater);
  assert.equal(sig.get(), 5, 'has correct initial value');
  updater.push(9);
  assert.equal(sig.get(), 9, 'updates correctly');
});
