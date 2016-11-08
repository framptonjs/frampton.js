import forward from 'frampton-signal/forward';
import createSignal from 'frampton-signal/create';

QUnit.module('Frampton.Signal.forward');

QUnit.test('returns a function that applies its argument to function and forwards that result to another function', function(assert) {
  const done = assert.async();
  const receiver = createSignal();
  receiver.next((val) => {
    assert.equal(val, 5);
    done();
  });
  const add2 = (x) => x + 2;
  const test = forward(receiver, add2);
  test(3);
});
