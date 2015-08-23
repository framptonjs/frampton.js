import Behavior from 'frampton-signals/behavior';
import EventStream from 'frampton-signals/event_stream';
import { nextEvent } from 'frampton-signals/event';
import empty from 'frampton-signals/empty';
import interval from 'frampton-signals/interval';

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

QUnit.test('dropRepeats method should return a stream that will not emit same value successively', function() {
  var stream = empty();
  var count = 0;
  stream.dropRepeats().next((val) => {
    if (count === 1 && val === 2) {
      ok(true);
    }
    count++;
  });
  stream.pushNext(1);
  stream.pushNext(1);
  stream.pushNext(1);
  stream.pushNext(1);
  stream.pushNext(2);
});

QUnit.test('concat method should return result of inner stream', function(assert) {
  var stream1 = empty();
  var stream2 = empty();
  var stream3 = stream1.concat(stream2);
  stream3.next((val) => {
    equal(val, 2);
  });
  stream1.pushNext(1);
  stream2.pushNext(2);
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

QUnit.test('skip method should skip a set number of events', function() {
  var stream = empty();
  stream.skip(2).next((val) => {
    equal(val, 2);
  });
  stream.pushNext(0);
  stream.pushNext(1);
  stream.pushNext(2);
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
  stream1.pushNext(1);
  stream2.pushNext(2);
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

QUnit.test('chainLatest method should return newest of multiple nested streams', function(assert) {

  var done  = assert.async();
  var count = 0;
  var vals  = [10, 20];
  var times = [100, 200];

  var stream = empty();

  var mapping = function() {
    return new EventStream((sink) => {
      var val = vals[count];
      setTimeout(() => {
        sink(nextEvent(val));
      }, times[count]);
      count++;
    });
  };

  var stream1 = stream.chainLatest(mapping);

  stream1.next((val) => {
    equal(val, 20, 'chain correctly returns newest');
    done();
  });

  stream.pushNext('test 1');
  stream.pushNext('test 2');
});

QUnit.test('and method should only allow values if behavior is truthy', function() {

  var behavior = Behavior.of(false);
  var stream1 = empty();
  var stream2 = stream1.and(behavior);
  var count = 0;

  stream2.next((val) => {
    count++;
  });

  stream1.pushNext(1);
  behavior.update(true);
  stream1.pushNext(1);
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

  stream1.pushNext(1);
  behavior.update(false);
  stream1.pushNext(1);
  stream1.pushNext(1);
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

  stream1.pushNext(10);
});

QUnit.test('recover method should produce next from error', function(assert) {

  var done = assert.async();
  var stream = this.stream.map((x) => { throw new Error('test error'); });

  stream.recover(5).next((val) => {
    equal(val, 5, 'recover generated correct value from error');
    done();
  });
});

QUnit.test('withPrevious method should generate a stream with past values in an array', function() {

  var stream = empty();
  var stream2 = stream.withPrevious();
  var i = 0;

  stream2.next((val) => {
    if (i === 0) {
      deepEqual(val, [1], 'first occurance is correct');
    } else {
      deepEqual(val, [1,2], 'correctly saves first value');
    }
    i = i + 1;
  });

  stream.pushNext(1);
  stream.pushNext(2);
});

QUnit.test('debounce method should regulate frequency of events', function(assert) {

  var done = assert.async();
  var count = 0;
  var stream = new EventStream((sink) => {
    var interval = setInterval(() => {
      sink(nextEvent(count++));
    }, 10);
    return function() {
      clearInterval(interval);
    };
  });

  stream.take(3).debounce(25).next((val) => {
    stream.close();
    equal(val, 2, 'debounce correctly regulated events');
    done();
  });
});

QUnit.test('throttle method should regulate frequency of events', function(assert) {

  var done = assert.async();
  var count = 0;
  var stream = new EventStream((sink) => {
    var interval = setInterval(() => {
      sink(nextEvent(count++));
    }, 10);
    return function() {
      clearInterval(interval);
    };
  });

  stream.throttle(25).next((val) => {
    stream.close();
    equal(val, 2, 'throttle correctly regulated events');
    done();
  });
});

QUnit.test('preventDefault method should call stopPropagation and preventDefault methods of event object', function(assert) {

  var done = assert.async();
  var preventCalled = false;
  var stopCalled = false;
  var stream = empty();

  stream.preventDefault().next((evt) => {
    ok(preventCalled, 'prevent called');
    ok(stopCalled, 'stop called');
    done();
  });

  stream.push(nextEvent({
    preventDefault : function() {
      preventCalled = true;
    },
    stopPropagation : function() {
      stopCalled = true;
    }
  }));
});