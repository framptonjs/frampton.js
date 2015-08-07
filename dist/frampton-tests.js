/**
 *
 */
if (typeof Frampton === 'undefined') {
  var Frampton = {};
}

if (typeof define === 'undefined' && typeof require === 'undefined') {
  var define, require
}

(function() {

  if (typeof Frampton.__loader === 'undefined') {

    var registry = {},
        seen     = {};

    define = function(name, deps, callback) {

      var value = {};

      if (!callback) {
        value.deps = [];
        value.callback = deps;
      } else {
        value.deps = deps;
        value.callback = callback;
      }

      registry[name] = value;
    };

    requirejs = require = requireModule = function(name) {
      return internalRequire(name, null);
    };

    function internalRequire(name, referrerName) {

      var exports = seen[name];
          module  = {};

      if (exports !== undefined) {
        return exports;
      }

      exports = {};
      module.exports = exports;

      if (!registry[name]) {
        if (referrerName) {
          throw new Error('Could not find module ' + name + ' required by: ' + referrerName);
        } else {
          throw new Error('Could not find module ' + name);
        }
      }

      var mod      = registry[name],
          deps     = mod.deps,
          callback = mod.callback,
          reified  = [],
          len      = deps.length,
          i        = 0;

      for (; i<len; i++) {
        if (deps[i] === 'exports') {
          reified.push(exports);
        } else if (deps[i] === 'module') {
          reified.push(module);
        } else {
          reified.push(internalRequire(resolve(deps[i], name), name));
        }
      }

      callback.apply(this, reified);

      seen[name] = (reified[1] && reified[1].exports) ? reified[1].exports : reified[0];

      return seen[name];
    };

    function resolve(child, name) {

      if (child.charAt(0) !== '.') {
        return child;
      }

      var parts      = child.split('/'),
          parentBase = name.split('/').slice(0, -1),
          len        = parts.length,
          i          = 0;

      for (; i < len; i++) {

        var part = parts[i];

        if (part === '..') {
          parentBase.pop();
        } else if (part === '.') {
          continue;
        } else {
          parentBase.push(part);
        }
      }

      return parentBase.join('/');
    }

    Frampton.__loader = {
      define: define,
      require: require,
      registry: registry
    };

  } else {
    define = Frampton.__loader.define;
    require = Frampton.__loader.require;
  }

}());
(function() {
define("frampton-cache.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-cache/cache.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-data.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-data/either.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-data/fail.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-data/fork.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-data/maybe.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-data/run_task.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-data/sequence.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-data/succeed.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-data/task.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-data/tests/either_test", ["exports"], function (exports) {
  "use strict";
});
define("frampton-data/tests/either_test.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-data/tests/maybe_test", ["exports"], function (exports) {
  "use strict";
});
define("frampton-data/tests/maybe_test.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define('frampton-data/tests/task_test', ['exports', 'frampton-data/task', 'frampton-utils/noop'], function (exports, _framptonDataTask, _framptonUtilsNoop) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Task = _interopRequire(_framptonDataTask);

  var _noop = _interopRequire(_framptonUtilsNoop);

  QUnit.module('Frampton.Data.Task');

  QUnit.test('join method should flatten nested Tasks', function () {

    var task = new _Task(function (_, resolve) {
      resolve(new _Task(function (_, resolve) {
        resolve(5);
      }));
    });

    task.join().run(_noop, function (val) {
      equal(val, 5, 'correctly flattened Task');
    });
  });

  QUnit.test('chain method should propertly map and flatten', function () {

    var task = new _Task(function (_, resolve) {
      resolve(5);
    });

    var mapping = function mapping(val) {
      return new _Task(function (_, resolve) {
        resolve(val + 1);
      });
    };

    task.chain(mapping).run(_noop, function (val) {
      equal(val, 6, 'correctly composed Tasks');
    });
  });
});
define("frampton-data/tests/task_test.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-data/when.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-events.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-events/contains.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-events/event_dispatcher.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-events/event_map.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-events/event_target.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-events/event_value.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-events/get_position.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-events/get_position_relative.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-events/listen.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-events/target_value.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-keyboard.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-keyboard/is_ctrl.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-keyboard/is_down.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-keyboard/is_enter.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-keyboard/is_esc.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-keyboard/is_key.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-keyboard/is_left.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-keyboard/is_right.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-keyboard/is_shift.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-keyboard/is_space.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-keyboard/is_up.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-keyboard/key_code.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-keyboard/key_map.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-keyboard/keyboard.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-list.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-list/append.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-list/contains.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-list/copy.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-list/diff.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-list/drop.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-list/each.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-list/filter.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-list/foldl.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-list/foldr.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-list/head.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-list/init.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-list/last.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-list/length.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-list/maximum.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-list/minimum.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-list/prepend.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-list/product.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-list/remove.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-list/reverse.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-list/split.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-list/sum.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-list/tail.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-list/zip.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-math.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-math/add.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-math/divide.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-math/max.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-math/min.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-math/modulo.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-math/multiply.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-math/subtract.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define('frampton-math/tests/add_test', ['exports', 'frampton-math/add'], function (exports, _framptonMathAdd) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _add = _interopRequire(_framptonMathAdd);

  QUnit.module('Frampton.Math.add');

  QUnit.test('should correctly add two numbers', function () {
    equal((0, _add)(1, 2), 3, 'correctly adds');
  });
});
define("frampton-math/tests/add_test.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define('frampton-math/tests/divide_test', ['exports', 'frampton-math/divide'], function (exports, _framptonMathDivide) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _divide = _interopRequire(_framptonMathDivide);

  QUnit.module('Frampton.Math.divide');

  QUnit.test('should correctly divide two numbers', function () {
    equal((0, _divide)(4, 2), 2, 'correctly divides');
  });
});
define("frampton-math/tests/divide_test.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define('frampton-math/tests/max_test', ['exports', 'frampton-math/max'], function (exports, _framptonMathMax) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _max = _interopRequire(_framptonMathMax);

  QUnit.module('Frampton.Math.max');

  QUnit.test('should correctly select the larger of two numbers', function () {
    equal((0, _max)(4, 2), 4, 'correctly selects');
  });
});
define("frampton-math/tests/max_test.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define('frampton-math/tests/min_test', ['exports', 'frampton-math/min'], function (exports, _framptonMathMin) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _min = _interopRequire(_framptonMathMin);

  QUnit.module('Frampton.Math.min');

  QUnit.test('should correctly select the smaller of two numbers', function () {
    equal((0, _min)(4, 2), 2, 'correctly selects');
  });
});
define("frampton-math/tests/min_test.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define('frampton-math/tests/multiply_test', ['exports', 'frampton-math/multiply'], function (exports, _framptonMathMultiply) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _multiply = _interopRequire(_framptonMathMultiply);

  QUnit.module('Frampton.Math.multiply');

  QUnit.test('should correctly multiply two numbers', function () {
    equal((0, _multiply)(4, 2), 8, 'correctly multiplies');
  });
});
define("frampton-math/tests/multiply_test.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-monad.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-monad/ap.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-monad/chain.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-monad/filter.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-monad/map.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-mouse.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-mouse/mouse.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-object.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-object/filter.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-object/for_each.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-object/map.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-object/reduce.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define('frampton-object/tests/filter_test', ['exports', 'frampton-object'], function (exports, _framptonObject) {
  'use strict';

  QUnit.module('Frampton.Object.filter');

  QUnit.test('should filter keys from object if value satisfies predicate', function () {

    var obj = { one: 1, two: 2, three: 3 };
    var predicate = function predicate(val) {
      return val >= 2;
    };

    deepEqual((0, _framptonObject.filter)(predicate, obj), { two: 2, three: 3 }, 'correctly filters object');
  });
});
define("frampton-object/tests/filter_test.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-signals.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-signals/accum_b.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-signals/behavior.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-signals/constant.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-signals/dispatcher.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-signals/empty.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-signals/event.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-signals/event_stream.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-signals/interval.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-signals/null.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-signals/send.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-signals/sequential.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-signals/stepper.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define('frampton-signals/tests/behavior_test', ['exports', 'frampton-signals/behavior'], function (exports, _framptonSignalsBehavior) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Behavior = _interopRequire(_framptonSignalsBehavior);

  QUnit.module('Frampton.Signals.Behavior');

  QUnit.test('of method should return Behavior with initial value', function () {
    var behavior = _Behavior.of(5);
    equal(behavior.value, 5, 'has initial value');
    behavior.changes(function (val) {
      equal(val, 5, 'persists initial value');
    });
  });

  QUnit.test('update method should notify listeners', function () {
    var behavior = _Behavior.of(5);
    var count = 0;
    behavior.changes(function (val) {
      if (count === 0) {
        equal(val, 5, 'notifies listener of initial value');
      } else {
        equal(val, 6, 'notifies listener of updated value');
      }
      count++;
    });
    behavior.update(6);
  });

  QUnit.test('destroy method should call cleanup', function (assert) {
    var done = assert.async();
    var behavior = new _Behavior(0, function seed(sink) {

      var timerId = null;
      var frame = 0;
      var isStopped = false;

      timerId = setTimeout(function step() {
        sink(frame++);
        if (!isStopped) timerId = setTimeout(step);
      }, 100);

      ok(true, 'seed function called');

      return function () {
        clearTimeout(timerId);
        isStopped = true;
        ok(true, 'cleanup called');
        done();
      };
    });
    behavior.changes(function (val) {
      equal(val, 0, 'initial value is correct');
      behavior.destroy();
    });
  });
});
define("frampton-signals/tests/behavior_test.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define('frampton-signals/tests/event_stream_test', ['exports', 'frampton-signals/behavior', 'frampton-signals/event_stream', 'frampton-signals/event', 'frampton-signals/empty', 'frampton-signals/interval'], function (exports, _framptonSignalsBehavior, _framptonSignalsEvent_stream, _framptonSignalsEvent, _framptonSignalsEmpty, _framptonSignalsInterval) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Behavior = _interopRequire(_framptonSignalsBehavior);

  var _EventStream = _interopRequire(_framptonSignalsEvent_stream);

  var _empty = _interopRequire(_framptonSignalsEmpty);

  var _interval = _interopRequire(_framptonSignalsInterval);

  QUnit.module('Frampton.Signals.EventStream', {
    beforeEach: function beforeEach() {
      this.stream = new _EventStream(function (sink) {
        setTimeout(function () {
          sink((0, _framptonSignalsEvent.nextEvent)(10));
        }, 100);
      });
    },
    afterEach: function afterEach() {
      this.stream.close();
      this.stream = null;
    }
  });

  QUnit.test('next method should produce correct value', function (assert) {
    var done = assert.async();
    this.stream.next(function (val) {
      equal(val, 10, 'next method has correct value');
      done();
    });
  });

  QUnit.test('map method should take a primitive value', function (assert) {
    var done = assert.async();
    this.stream.map(5).next(function (val) {
      equal(val, 5, 'map method correctly passed primitive value');
      done();
    });
  });

  QUnit.test('map method should take a function', function (assert) {
    var done = assert.async();
    var mapping = function mapping(val) {
      return val + 10;
    };
    this.stream.map(mapping).next(function (val) {
      equal(val, 20, 'map method correctly passed value of function');
      done();
    });
  });

  QUnit.test('take method should close after limit reached', function (assert) {
    var done = assert.async();
    var stream = (0, _interval)();
    var stream2 = stream.take(5);
    var count = 0;
    stream2.next(function (val) {
      count++;
    });
    stream2.done(function () {
      equal(count, 5, 'take method closed after correct limit');
      done();
    });
  });

  QUnit.test('merge method creates a stream from parent streams', function (assert) {
    var done = assert.async();
    var stream1 = (0, _empty)();
    var stream2 = (0, _empty)();
    var merged = stream1.merge(stream2);
    var count = 0;
    merged.next(function (val) {
      if (count === 0) {
        equal(val, 1, 'correct value from stream1');
      } else {
        equal(val, 2, 'correct value from stream2');
        done();
      }
      count++;
    });
    stream1.push((0, _framptonSignalsEvent.nextEvent)(1));
    stream2.push((0, _framptonSignalsEvent.nextEvent)(2));
  });

  QUnit.test('removing all listeners should invoke cleanup', function (assert) {
    var done = assert.async();
    var breakers = [];
    var stream = new _EventStream(function (sink) {

      var frame = 0;
      var requestId = null;
      var isStopped = false;

      requestId = requestAnimationFrame(function step() {
        sink((0, _framptonSignalsEvent.nextEvent)(frame++));
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

    breakers.push(stream.next(function (val) {}));
    breakers.push(stream.next(function (val) {}));

    setTimeout(function () {
      breakers.forEach(function (breaker) {
        breaker();
      });
    }, 200);
  });

  QUnit.test('chain method should correctly flatten nested streams', function (assert) {

    var done = assert.async();

    var mapping = function mapping(val) {
      return new _EventStream(function (sink) {
        setTimeout(function () {
          sink((0, _framptonSignalsEvent.nextEvent)(val + 10));
        }, 200);
      });
    };

    var stream1 = this.stream.chain(mapping);
    var stream2 = stream1.chain(mapping);

    stream1.next(function (val) {
      equal(val, 20, 'chain correctly flattened nested streams');
    });

    stream2.next(function (val) {
      equal(val, 30, 'chain correctly flattened nested streams');
      done();
    });
  });

  QUnit.test('and method should only allow values if behavior is truthy', function () {

    var behavior = _Behavior.of(false);
    var stream1 = (0, _empty)();
    var stream2 = stream1.and(behavior);
    var count = 0;

    stream2.next(function (val) {
      count++;
    });

    stream1.push((0, _framptonSignalsEvent.nextEvent)(1));
    behavior.update(true);
    stream1.push((0, _framptonSignalsEvent.nextEvent)(1));
    equal(count, 1, 'and method correctly gated callback');
  });

  QUnit.test('and method should only allow values if behavior is falsy', function () {

    var behavior = _Behavior.of(true);
    var stream1 = (0, _empty)();
    var stream2 = stream1.not(behavior);
    var count = 0;

    stream2.next(function (val) {
      count++;
    });

    stream1.push((0, _framptonSignalsEvent.nextEvent)(1));
    behavior.update(false);
    stream1.push((0, _framptonSignalsEvent.nextEvent)(1));
    stream1.push((0, _framptonSignalsEvent.nextEvent)(1));
    equal(count, 2, 'not method correctly gated callback');
  });

  QUnit.test('sample method should take values from associated behavior', function (assert) {

    var done = assert.async();
    var behavior = _Behavior.of(1);
    var stream1 = (0, _empty)();
    var stream2 = stream1.sample(behavior);

    stream2.next(function (val) {
      equal(val, 1, 'sample returned behavior value');
      done();
    });

    stream1.push((0, _framptonSignalsEvent.nextEvent)(10));
  });

  QUnit.test('recover method should produce next from error', function (assert) {

    var done = assert.async();
    var stream = this.stream.map(function (x) {
      throw new Error('test error');
    });

    stream.recover(5).next(function (val) {
      equal(val, 5, 'recover generated correct value from error');
      done();
    });
  });

  QUnit.test('debounce method should regulate frequency of events', function (assert) {

    var done = assert.async();
    var count = 0;
    var stream = new _EventStream(function (sink) {
      var interval = setInterval(function () {
        sink((0, _framptonSignalsEvent.nextEvent)(count++));
      }, 10);
      return function () {
        clearInterval(interval);
      };
    });

    stream.take(3).debounce(30).next(function (val) {
      stream.close();
      equal(val, 2, 'debounce correctly regulated events');
      done();
    });
  });

  QUnit.test('throttle method should regulate frequency of events', function (assert) {

    var done = assert.async();
    var count = 0;
    var stream = new _EventStream(function (sink) {
      var interval = setInterval(function () {
        sink((0, _framptonSignalsEvent.nextEvent)(count++));
      }, 10);
      return function () {
        clearInterval(interval);
      };
    });

    stream.throttle(30).next(function (val) {
      stream.close();
      equal(val, 2, 'throttle correctly regulated events');
      done();
    });
  });
});
define("frampton-signals/tests/event_stream_test.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define('frampton-signals/tests/event_test', ['exports', 'frampton-signals'], function (exports, _framptonSignals) {
  'use strict';

  QUnit.module('Frampton.Signals.Event');

  QUnit.test('emptyEvent should return an Empty', function () {
    var empty = (0, _framptonSignals.emptyEvent)();
    notOk(empty.isNext(), 'empty is not a Next');
    notOk(empty.isError(), 'empty is not an Error');
    notOk(empty.isEnd(), 'empty is not an End');
    ok(empty.isEmpty(), 'empty is an Empty');
  });

  QUnit.test('nextEvent should return a Next', function () {
    var next = (0, _framptonSignals.nextEvent)(1);
    notOk(next.isEmpty(), 'next is not an Empty');
    notOk(next.isError(), 'next is not an Error');
    notOk(next.isEnd(), 'next is not an End');
    ok(next.isNext(), 'next is a Next');
  });

  QUnit.test('errorEvent should return an Error', function () {
    var error = (0, _framptonSignals.errorEvent)('error');
    notOk(error.isNext(), 'error is not a Next');
    notOk(error.isEmpty(), 'error is not an Empty');
    notOk(error.isEnd(), 'error is not an End');
    ok(error.isError(), 'error is an Error');
  });

  QUnit.test('endEvent should return an End', function () {
    var end = (0, _framptonSignals.endEvent)();
    notOk(end.isNext(), 'end is not a Next');
    notOk(end.isError(), 'end is not an Error');
    notOk(end.isEmpty(), 'end is not an Empty');
    ok(end.isEnd(), 'end is an End');
  });

  QUnit.test('errorEvent should throw if no message', function () {
    throws(function () {
      (0, _framptonSignals.errorEvent)();
    }, 'error has no message');
  });
});
define("frampton-signals/tests/event_test.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define('frampton-signals/tests/stepper_test', ['exports', 'frampton-signals'], function (exports, _framptonSignals) {
  'use strict';

  QUnit.module('Frampton.Signals.stepper');

  QUnit.test('creates a Behavior with initial value', function () {
    var stream = (0, _framptonSignals.empty)();
    var behavior = (0, _framptonSignals.stepper)(5, stream);
    equal(behavior.value, 5, 'has correct initial value');
  });

  QUnit.test('creates a Behavior that updates with EventStream', function () {
    var stream = (0, _framptonSignals.empty)();
    var behavior = (0, _framptonSignals.stepper)(5, stream);
    var count = 0;
    behavior.changes(function (val) {
      if (count === 0) {
        equal(val, 5, 'has correct initial value');
      } else {
        equal(val, 6, 'correctly updates with EventStream');
      }
      count++;
    });
    stream.push((0, _framptonSignals.nextEvent)(6));
  });
});
define("frampton-signals/tests/stepper_test.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-string.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-string/contains.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-string/ends_with.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-string/join.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-string/lines.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-string/split.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-string/starts_with.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define('frampton-string/tests/contains_test', ['exports', 'frampton-string'], function (exports, _framptonString) {
  'use strict';

  QUnit.module('Frampton.String.contains');

  QUnit.test('returns true if a string contains a substring', function () {
    ok((0, _framptonString.contains)('yep', 'yepnope'), 'correctly recognizes substring');
  });

  QUnit.test('returns false if a string does not contain substring', function () {
    notOk((0, _framptonString.contains)('wrong', 'yepnope'), 'correctly recognizes substring');
  });
});
define("frampton-string/tests/contains_test.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define('frampton-string/tests/ends_with_test', ['exports', 'frampton-string'], function (exports, _framptonString) {
  'use strict';

  QUnit.module('Frampton.String.endsWith');

  QUnit.test('returns true if a string ends with a substring', function () {
    ok((0, _framptonString.endsWith)('nope', 'yepnope'), 'correctly recognizes substring');
  });

  QUnit.test('returns false if a string does not end with a substring', function () {
    notOk((0, _framptonString.endsWith)('yep', 'yepnope'), 'correctly recognizes substring');
  });
});
define("frampton-string/tests/ends_with_test.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define('frampton-string/tests/starts_with_test', ['exports', 'frampton-string'], function (exports, _framptonString) {
  'use strict';

  QUnit.module('Frampton.String.startsWith');

  QUnit.test('returns true if a string starts with a substring', function () {
    ok((0, _framptonString.startsWith)('yep', 'yepnope'), 'correctly recognizes substring');
  });

  QUnit.test('returns false if a string does not start with a substring', function () {
    notOk((0, _framptonString.startsWith)('nope', 'yepnope'), 'correctly recognizes substring');
  });
});
define("frampton-string/tests/starts_with_test.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-string/words.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-utils.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-utils/apply.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-utils/assert.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-utils/compose.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-utils/curry.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-utils/equal.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-utils/extend.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-utils/get.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-utils/guid.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-utils/identity.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-utils/inherits.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-utils/is_array.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-utils/is_boolean.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-utils/is_defined.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-utils/is_equal.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-utils/is_function.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-utils/is_nothing.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-utils/is_null.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-utils/is_object.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-utils/is_promise.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-utils/is_something.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-utils/is_string.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-utils/is_undefined.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-utils/lazy.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-utils/log.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-utils/noop.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-utils/not_implemented.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-utils/of_value.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-utils/safe_get.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define('frampton-utils/tests/assert_test', ['exports', 'frampton-utils'], function (exports, _framptonUtils) {
  'use strict';

  QUnit.module('Frampton.Utils.assert');

  QUnit.test('should throw for falsy value', function () {
    throws(function () {
      (0, _framptonUtils.assert)('falsy value', 0);
    }, 'throws for falsy');
  });

  QUnit.test('should not throw for truthy value', function () {
    ok(typeof (0, _framptonUtils.assert)('truthy value', 'true') === 'undefined', 'passes on truthy');
  });

  QUnit.test('should throw for false', function () {
    throws(function () {
      (0, _framptonUtils.assert)('false', false);
    }, 'throws for false');
  });

  QUnit.test('should not throw for true', function () {
    ok(typeof (0, _framptonUtils.assert)('true', true) === 'undefined', 'passes on true');
  });

  QUnit.test('thrown message should be correct', function () {
    throws(function () {
      (0, _framptonUtils.assert)('custom message', false);
    }, function (err) {
      return err.message === 'custom message';
    }, 'returns correct error message');
  });
});
define("frampton-utils/tests/assert_test.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define('frampton-utils/tests/compose_test', ['exports', 'frampton-utils'], function (exports, _framptonUtils) {
  'use strict';

  QUnit.module('Frampton.Utils.compose');

  QUnit.test('should compose functions right to left', function () {
    var a = function a(x) {
      return x + 'a';
    };
    var b = function b(x) {
      return x + 'b';
    };
    equal((0, _framptonUtils.compose)(a, b)('c'), 'cba', 'correctly composes functions');
  });

  QUnit.test('does not compose functions left to right', function () {
    var a = function a(x) {
      return x + 'a';
    };
    var b = function b(x) {
      return x + 'b';
    };
    notEqual((0, _framptonUtils.compose)(a, b)('c'), 'abc', 'correctly composes functions');
  });
});
define("frampton-utils/tests/compose_test.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define('frampton-utils/tests/equal_test', ['exports', 'frampton-utils'], function (exports, _framptonUtils) {
  'use strict';

  QUnit.module('Frampton.Utils.equal');

  QUnit.test('should return true for objects with same key/values', function () {
    var a = { a: 1, b: 2 };
    var b = { a: 1, b: 2 };
    ok((0, _framptonUtils.equal)(a, b), 'correctly compares objects');
  });

  QUnit.test('should return false for objects with different key/values', function () {
    var a = { a: 1, b: 2 };
    var b = { a: 2, b: 1 };
    notOk((0, _framptonUtils.equal)(a, b), 'correctly compares objects');
  });

  QUnit.test('should return true for the same primitive value', function () {
    var a = 1;
    var b = 1;
    ok((0, _framptonUtils.equal)(a, b), 'correctly compares values');
  });

  QUnit.test('should return false for different primitive values', function () {
    var a = 1;
    var b = 2;
    notOk((0, _framptonUtils.equal)(a, b), 'correctly compares values');
  });
});
define("frampton-utils/tests/equal_test.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define('frampton-utils/tests/get_test', ['exports', 'frampton-utils'], function (exports, _framptonUtils) {
  'use strict';

  QUnit.module('Frampton.Utils.get');

  QUnit.test('should retrieve value by key', function () {
    var temp = { id: 1 };
    equal((0, _framptonUtils.get)('id', temp), 1, 'correctly returns value');
  });

  QUnit.test('should return null for invalid key', function () {
    var temp = { id: 1 };
    equal((0, _framptonUtils.get)('wrong', temp), null, 'correctly returns null');
  });
});
define("frampton-utils/tests/get_test.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define('frampton-utils/tests/safe_get_test', ['exports', 'frampton-utils'], function (exports, _framptonUtils) {
  'use strict';

  QUnit.module('Frampton.Utils.safeGet');

  QUnit.test('should return Just for existing key', function () {
    var temp = { id: 1 };
    ok((0, _framptonUtils.safeGet)('id', temp).isJust(), 'correctly returns Just');
  });

  QUnit.test('should return Nothing for invalid key', function () {
    var temp = { id: 1 };
    ok((0, _framptonUtils.safeGet)('wrong', temp).isNothing(), 'correctly returns Nothing');
  });

  QUnit.test('should return Just for existing key', function () {
    var temp = { id: 1 };
    equal((0, _framptonUtils.safeGet)('id', temp).toString(), 'Just(1)', 'correctly returns Just');
  });

  QUnit.test('should return Nothing for invalid key', function () {
    var temp = { id: 1 };
    equal((0, _framptonUtils.safeGet)('wrong', temp).toString(), 'Nothing', 'correctly returns Nothing');
  });
});
define("frampton-utils/tests/safe_get_test.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-window.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton-window/window.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton/namespace.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
define("frampton/runtime.jshint", ["exports"], function (exports) {
  "use strict";

  undefined;
});
})();