import createSignal from 'frampton-signal/create';
import toggle from 'frampton-signal/toggle';

QUnit.module('Frampton.Signal.toggle');

QUnit.test('creates a boolean signal with initial value of false', function(assert) {
  const sig = toggle(false, createSignal());
  assert.equal(sig.get(), false);
});

QUnit.test('creates a boolean signal that alternates values', function(assert) {
  const done = assert.async();
  const sig1 = createSignal();
  const sig2 = toggle(false, sig1);
  var count = 0;

  sig2.value((val) => {
    if (count === 0) {
      assert.equal(val, false);
    } else if (count === 1) {
      assert.equal(val, true);
    } else if (count === 2) {
      assert.equal(val, false);
    } else if (count === 3) {
      assert.equal(val, true);
      done();
    }
  });

  count += 1;
  sig1.push(null);
  count += 1;
  sig1.push(null);
  count += 1;
  sig1.push(null);
});
