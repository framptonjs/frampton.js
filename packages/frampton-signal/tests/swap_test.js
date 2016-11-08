import createSignal from 'frampton-signal/create';
import swap from 'frampton-signal/swap';

QUnit.module('Frampton.Signal.swap');

QUnit.test('creates a boolean signal with initial value of false', function(assert) {
  const sig = swap(createSignal(), createSignal());
  assert.equal(sig.get(), false);
});
