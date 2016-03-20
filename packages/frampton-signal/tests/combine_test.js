import combine from 'frampton-signal/combine';
import createSignal from 'frampton-signal/create';

QUnit.module('Frampton.Signal.combine');

QUnit.test('Should correctly combine n number of signals', function() {
  const sig1 = createSignal(0);
  const sig2 = createSignal(0);
  const sig3 = createSignal(0);

  const sig4 = combine((val1, val2, val3) => {
    return val1 + val2 + val3;
  }, [sig1, sig2, sig3]);

  sig1(1);
  equal(sig4(), 1);
  sig2(2);
  equal(sig4(), 3);
  sig3(3);
  equal(sig4(), 6);
});