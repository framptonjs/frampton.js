import createSignal from 'frampton-signal/create';
import { mergeMany } from 'frampton-signal/create';


function useFakeTimers() {
  var currentTime = 0;
  var target = null;
  var savedSet = window.setTimeout;
  var savedClear = window.clearTimeout;
  window.setTimeout = function(fn, delay) {
    target = {
      callback: fn,
      wait: delay,
      called: false
    };

    return 1;
  };

  window.clearTimeout = function(id) {
    target = null;
    currentTime = 0;
  };

  return {
    restore() {
      currentTime = 0;
      target = null;
      window.setTimeout = savedSet;
      window.clearTimeout = savedClear;
      savedSet = null;
      savedClear = null;
    },
    tick(time) {
      currentTime = currentTime + time;
      if (target !== null && target.wait <= currentTime && target.called === false) {
        target.callback();
        target.called = true;
      }
    }
  };
}


QUnit.module('Frampton.Signal.create', {
  beforeEach() {
    this.clock = useFakeTimers();
  },

  afterEach() {
    this.clock.restore();
  }
});

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

QUnit.test('throttle method delays events to happen at most once per delay', function(assert) {
  const sig = createSignal();
  const sig1 = sig.throttle(20);

  sig.push(5);

  this.clock.tick(19);
  assert.equal(sig1.get(), undefined);

  this.clock.tick(1);
  assert.equal(sig1.get(), 5);
});

QUnit.test('debounce method should only emit value once events have calmed for given delay', function(assert) {
  assert.expect(4);
  const sig = createSignal();
  const sig1 = sig.debounce(20);

  sig.push(5);
  this.clock.tick(19);
  assert.equal(sig1.get(), undefined, 'fail one');

  sig.push(5);
  this.clock.tick(5);
  assert.equal(sig1.get(), undefined, 'fail two');

  this.clock.tick(9);
  assert.equal(sig1.get(), undefined, 'fail three');

  this.clock.tick(10);
  assert.equal(sig1.get(), 5);
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
