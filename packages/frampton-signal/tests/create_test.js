import createSignal from 'frampton-signal/create';
import { mergeMany } from 'frampton-signal/create';

QUnit.module('Frampton.Signal.create');

QUnit.test('creates signal with default value', function(assert) {
  const sig = createSignal(2);
  assert.equal(sig.get(), 2);
});

QUnit.test('next method alerts given function of next signal value', function(assert) {
  const sig = createSignal(3);
  sig.next((val) => {
    assert.equal(val, 1);
  });
  sig.push(1);
});

QUnit.test('value method alerts given function of signal value', function(assert) {
  var count = 0;
  const sig = createSignal(3);
  sig.value((val) => {
    if (count === 0) {
      assert.equal(val, 3);
    } else {
      assert.equal(val, 1);
    }
    count += 1;
  });
  sig.push(1);
});

QUnit.test('changes method alerts given function of signal value change', function(assert) {

  var count = 0;
  const sig = createSignal(3);

  sig.changes((val) => {
    if (count === 0) {
      assert.equal(val, 3);
    } else if (count === 3) {
      assert.equal(val, 1);
    } else {
      assert.ok(false);
    }
  });

  count += 1;
  sig.push(3);
  count += 1;
  sig.push(3);
  count += 1;
  sig.push(1);
});

QUnit.test('map method maps values on a signal', function(assert) {
  const sig = createSignal();
  const sig1 = sig.map((val) => val + 5);
  sig.push(1);
  assert.equal(sig1.get(), 6);
});

QUnit.test('filter method filters values on a signal', function(assert) {
  const sig = createSignal();
  const sig1 = sig.filter((val) => val > 5);
  sig.push(1);
  sig.push(8);
  sig.push(3);
  assert.equal(sig1.get(), 8);
});

QUnit.test('filter method blocks children from being updated', function(assert) {
  const sig = createSignal();
  const sig1 = sig.filter((val) => val > 5);
  const sig2 = sig1.map((val) => val + 1);
  sig.push(9);
  sig.push(3);
  assert.equal(sig1.get(), 9);
  assert.equal(sig2.get(), 10);
});

QUnit.test('fold method reduces values on a signal', function(assert) {
  const sig = createSignal();
  const sig1 = sig.fold((acc, next) => acc + next, '');
  sig.push('h');
  sig.push('e');
  sig.push('l');
  sig.push('l');
  sig.push('o');
  assert.equal(sig1.get(), 'hello');
});

QUnit.test('debounce method removes repeated values form signal', function(assert) {
  const done = assert.async();
  const sig = createSignal();
  const sig1 = sig.debounce(20);
  const counter = sig1.fold((acc, next) => acc + 1, 0);

  sig1.value((val) => {
    assert.equal(val, 5, 'final value not correct');
    assert.equal(counter.get(), 1, 'debounce count is wrong');
    done();
  });

  sig.push(1);
  sig.push(2);
  sig.push(3);
  sig.push(4);
  sig.push(5);
});

QUnit.test('dropRepeats method removes repeated values form signal', function(assert) {
  const sig = createSignal();
  const sig1 = sig.dropRepeats();
  const counter = sig1.fold((acc, next) => acc + 1, 0);
  sig.push(1);
  sig.push(1);
  sig.push(1);
  assert.equal(counter.get(), 1);
  sig.push(2);
  sig.push(2);
  sig.push(2);
  assert.equal(counter.get(), 2);
  sig.push(3);
  assert.equal(counter.get(), 3);
});

QUnit.test('merge method merges two signals', function(assert) {
  const sig = createSignal();
  const sig1 = createSignal();
  const sig2 = sig.merge(sig1);
  sig.push(1);
  assert.equal(sig2.get(), 1);
  sig.push(2);
  assert.equal(sig2.get(), 2);
  sig1.push(3);
  assert.equal(sig2.get(), 3);
  sig.push(4);
  assert.equal(sig2.get(), 4);
  sig1.push(5);
  assert.equal(sig2.get(), 5);
});

QUnit.test('mergeMany merges n signals', function(assert) {
  const sig = createSignal();
  const sig1 = createSignal();
  const sig2 = createSignal();
  const sig3 = mergeMany([sig, sig1, sig2]);
  sig.push(1);
  assert.equal(sig3.get(), 1, 'First case failed');
  sig.push(2);
  assert.equal(sig3.get(), 2, 'Second case failed');
  sig2.push(3);
  assert.equal(sig3.get(), 3, 'Third case failed');
  sig.push(4);
  assert.equal(sig3.get(), 4, 'Fourth case failed');
  sig1.push(5);
  assert.equal(sig3.get(), 5, 'Fifth case failed');
  sig2.push(6);
  assert.equal(sig3.get(), 6, 'Sixth case failed');
});
