import createSignal from 'frampton-signal/create';
import toggle from 'frampton-signal/toggle';

QUnit.module('Frampton.Signal.toggle');

QUnit.test('Should create a boolean signal with initial value of false', function() {
  const sig = toggle(false, createSignal());
  equal(sig(), false);
});

QUnit.test('Should create a boolean signal that alternates values', function(assert) {
  const done = assert.async();
  const sig1 = createSignal();
  const sig2 = toggle(false, sig1);
  var count = 0;

  sig2.value((val) => {
    if (count === 0) {
      equal(val, false);
    } else if (count === 1) {
      equal(val, true);
    } else if (count === 2) {
      equal(val, false);
    } else if (count === 3) {
      equal(val, true);
      done();
    }
  });

  count += 1;
  sig1(null);
  count += 1;
  sig1(null);
  count += 1;
  sig1(null);
});