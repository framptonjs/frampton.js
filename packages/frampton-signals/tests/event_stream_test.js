import {
  Behavior,
  EventStream,
  nextEvent,
  empty,
  interval
} from 'frampton-signals';

QUnit.module('Frampton.Signals.EventStream', {
  beforeEach() {
    this.stream = new EventStream((sink) => {
      setTimeout(() => {
        sink(nextEvent(10));
      }, 100);
    });
  },
  afterEach() {
    this.stream.close();
    this.stream = null;
  }
});

QUnit.test('next method should produce correct value', function(assert) {
  var done = assert.async();
  this.stream.next((val) => {
    equal(val, 10, 'next method has correct value');
    done();
  });
});

QUnit.test('map method should take a primitive value', function(assert) {
  var done = assert.async();
  this.stream.map(5).next((val) => {
    equal(val, 5, 'map method correctly passed primitive value');
    done();
  });
});

QUnit.test('map method should take a function', function(assert) {
  var done = assert.async();
  var mapping = (val) => {
    return val + 10;
  };
  this.stream.map(mapping).next((val) => {
    equal(val, 20, 'map method correctly passed value of function');
    done();
  });
});

QUnit.test('take method should close after limit reached', function(assert) {
  var done = assert.async();
  var stream = interval();
  var stream2 = stream.take(5);
  var count = 0;
  stream2.next((val) => {
    count++;
  });
  stream2.done(() => {
    equal(count, 5, 'take method closed after correct limit');
    done();
  });
});

QUnit.test('merge method creates a stream from parent streams', function(assert) {
  var done = assert.async();
  var stream1 = empty();
  var stream2 = empty();
  var merged = stream1.merge(stream2);
  var count = 0;
  merged.next((val) => {
    if (count === 0) {
      equal(val, 1, 'correct value from stream1');
    } else {
      equal(val, 2, 'correct value from stream2');
      done();
    }
    count++;
  });
  stream1.push(nextEvent(1));
  stream2.push(nextEvent(2));
});

QUnit.test('removing all listeners should invoke cleanup', function(assert) {
  var done = assert.async();
  var breakers = [];
  var stream = new EventStream((sink) => {

    var frame = 0;
    var requestId = null;
    var isStopped = false;

    requestId = requestAnimationFrame(function step() {
      sink(nextEvent(frame++));
      if (!isStopped) requestId = requestAnimationFrame(step);
    });

    return function interval_destroy() {
      cancelAnimationFrame(requestId);
      isStopped = true;
      requestId = null;
      ok(true, 'cleanup invoked');
      done();
    };
  });

  breakers.push(stream.next((val) => {}));
  breakers.push(stream.next((val) => {}));

  setTimeout(() => {
    breakers.forEach((breaker) => { breaker(); });
  }, 200);
});

QUnit.test('chain method should correctly flatten nested streams', function(assert) {

  var done = assert.async();

  var mapping = function(val) {
    return new EventStream((sink) => {
      setTimeout(() => {
        sink(nextEvent(val + 10));
      }, 200);
    });
  };

  var stream1 = this.stream.chain(mapping);
  var stream2 = stream1.chain(mapping);

  stream1.next((val) => {
    equal(val, 20, 'chain correctly flattened nested streams');
  });

  stream2.next((val) => {
    equal(val, 30, 'chain correctly flattened nested streams');
    done();
  });
});

QUnit.test('and method should only allow values if behavior is truthy', function() {

  var behavior = Behavior.of(false);
  var stream1 = empty();
  var stream2 = stream1.and(behavior);
  var count = 0;

  stream2.next((val) => {
    count++;
  });

  stream1.push(nextEvent(1));
  behavior.update(true);
  stream1.push(nextEvent(1));
  equal(count, 1, 'and method correctly gated callback');
});

QUnit.test('and method should only allow values if behavior is falsy', function() {

  var behavior = Behavior.of(true);
  var stream1 = empty();
  var stream2 = stream1.not(behavior);
  var count = 0;

  stream2.next((val) => {
    count++;
  });

  stream1.push(nextEvent(1));
  behavior.update(false);
  stream1.push(nextEvent(1));
  stream1.push(nextEvent(1));
  equal(count, 2, 'not method correctly gated callback');
});

QUnit.test('sample method should take values from associated behavior', function(assert) {

  var done = assert.async();
  var behavior = Behavior.of(1);
  var stream1 = empty();
  var stream2 = stream1.sample(behavior);

  stream2.next((val) => {
    equal(val, 1, 'sample returned behavior value');
    done();
  });

  stream1.push(nextEvent(10));
});

QUnit.test('recover method should produce next from error', function(assert) {

  var done = assert.async();
  var stream = this.stream.map((x) => { throw new Error('test error'); });

  stream.recover(5).next((val) => {
    equal(val, 5, 'recover generated correct value from error');
    done();
  });
});