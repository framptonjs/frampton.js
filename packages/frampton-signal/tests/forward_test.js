import forward from 'frampton-signal/forward';

QUnit.module('Frampton.Signal.forward');

QUnit.test('Should return a function that applies its argument to function and forwards that result to another function', function(assert) {
  const done = assert.async();
  const receiver = (val) => {
    equal(val, 5);
    done();
  };
  const add2 = (x) => x + 2;
  const test = forward(receiver, add2);
  test(3);
});