import createSignal from 'frampton-signal/create';
import { mergeMany } from 'frampton-signal/create';

QUnit.module('Frampton.Signal.create');

QUnit.test('Should create signal with default value', function() {
  const sig = createSignal(2);
  equal(sig(), 2);
});

QUnit.test('next method should alert given function of next signal value', function() {
  const sig = createSignal(3);
  sig.next((val) => {
    equal(val, 1);
  });
  sig(1);
});

QUnit.test('value method should alert given function of signal value', function() {
  var count = 0;
  const sig = createSignal(3);
  sig.value((val) => {
    if (count === 0) {
      equal(val, 3);
    } else {
      equal(val, 1);
    }
    count += 1;
  });
  sig(1);
});

QUnit.test('map method should correctly map values on a signal', function() {
  const sig = createSignal();
  const sig1 = sig.map((val) => val + 5);
  sig(1);
  equal(sig1(), 6);
});

QUnit.test('filter method should correctly filter values on a signal', function() {
  const sig = createSignal();
  const sig1 = sig.filter((val) => val > 5);
  sig(1);
  sig(8);
  sig(3);
  equal(sig1(), 8);
});

QUnit.test('filter method should block children from being updated', function() {
  const sig = createSignal();
  const sig1 = sig.filter((val) => val > 5);
  const sig2 = sig1.map((val) => val + 1);
  sig(9);
  sig(3);
  equal(sig1(), 9);
  equal(sig2(), 10);
});

QUnit.test('fold method should correctly reduce values on a signal', function() {
  const sig = createSignal();
  const sig1 = sig.fold((acc, next) => acc + next, '');
  sig('h');
  sig('e');
  sig('l');
  sig('l');
  sig('o');
  equal(sig1(), 'hello');
});

QUnit.test('debounce method should remove repeated values form signal', function(assert) {
  const done = assert.async();
  const sig = createSignal();
  const sig1 = sig.debounce(20);
  const counter = sig1.fold((acc, next) => acc + 1, 0);

  sig1.value((val) => {
    equal(val, 5, 'final value not correct');
    equal(counter(), 1, 'debounce count is wrong');
    done();
  });

  sig(1);
  sig(2);
  sig(3);
  sig(4);
  sig(5);
});

QUnit.test('dropRepeats method should remove repeated values form signal', function() {
  const sig = createSignal();
  const sig1 = sig.dropRepeats();
  const counter = sig1.fold((acc, next) => acc + 1, 0);
  sig(1);
  sig(1);
  sig(1);
  equal(counter(), 1);
  sig(2);
  sig(2);
  sig(2);
  equal(counter(), 2);
  sig(3);
  equal(counter(), 3);
});

QUnit.test('merge method should correctly merge two signals', function() {
  const sig = createSignal();
  const sig1 = createSignal();
  const sig2 = sig.merge(sig1);
  sig(1);
  equal(sig2(), 1);
  sig(2);
  equal(sig2(), 2);
  sig1(3);
  equal(sig2(), 3);
  sig(4);
  equal(sig2(), 4);
  sig1(5);
  equal(sig2(), 5);
});

QUnit.test('mergeMany should correctly merge n signals', function() {
  const sig = createSignal();
  const sig1 = createSignal();
  const sig2 = createSignal();
  const sig3 = mergeMany([sig, sig1, sig2]);
  sig(1);
  equal(sig3(), 1);
  sig(2);
  equal(sig3(), 2);
  sig2(3);
  equal(sig3(), 3);
  sig(4);
  equal(sig3(), 4);
  sig1(5);
  equal(sig3(), 5);
  sig2(6);
  equal(sig3(), 6);
});