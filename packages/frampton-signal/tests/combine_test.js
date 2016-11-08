import combine from 'frampton-signal/combine';
import createSignal from 'frampton-signal/create';

QUnit.module('Frampton.Signal.combine');

QUnit.test('combines n number of signals', function(assert) {
  const sig1 = createSignal(0);
  const sig2 = createSignal(0);
  const sig3 = createSignal(0);

  const sig4 = combine((val1, val2, val3) => {
    return val1 + val2 + val3;
  }, [sig1, sig2, sig3]);

  sig1.push(1);
  assert.equal(sig4.get(), 1);
  sig2.push(2);
  assert.equal(sig4.get(), 3);
  sig3.push(3);
  assert.equal(sig4.get(), 6);
});
