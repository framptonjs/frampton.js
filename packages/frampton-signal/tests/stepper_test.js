import createSignal from 'frampton-signal/create';
import stepper from 'frampton-signal/stepper';

QUnit.module('Frampton.Signal.stepper');

QUnit.test('Should create a signal with initial value', function() {
  const updater = createSignal();
  const signal = stepper(5, updater);
  equal(signal(), 5);
});

QUnit.test('Should create a signal that updates with another singal', function() {
  const updater = createSignal();
  const signal = stepper(5, updater);
  equal(signal(), 5, 'has correct initial value');
  updater(9);
  equal(signal(), 9, 'updates correctly');
});