import createSignal from 'frampton-signal/create';
import swap from 'frampton-signal/swap';

QUnit.module('Frampton.Signal.swap');

QUnit.test('Should create a boolean signal with initial value of false', function() {
  const sig = swap(createSignal(), createSignal());
  equal(sig(), false);
});