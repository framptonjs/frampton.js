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
define('frampton-cache', ['exports', 'frampton-cache/Cache'], function (exports, _framptonCacheCache) {
  'use strict';

  exports.__esModule = true;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Cache = _interopRequire(_framptonCacheCache);

  exports.Cache = _Cache;
});
define('frampton-cache/Cache', ['exports', 'module', 'frampton-utils'], function (exports, module, _framptonUtils) {
  'use strict';

  var defaults = {
    LIMIT: 1000,
    TIMEOUT: 5 * 60 * 1000 // 5 minutes
  };

  function currentTime() {
    return new Date().getTime();
  }

  function isExpired(entry, timeout) {
    return currentTime() - entry.timestamp > timeout;
  }

  // Takes two entries and bidirectionally links them.
  function linkEntries(prevEntry, nextEntry) {

    if (nextEntry === prevEntry) return;

    if (nextEntry) {
      nextEntry.prev = prevEntry || null;
    }

    if (prevEntry) {
      prevEntry.next = nextEntry || null;
    }
  }

  // update the counter to keep track of most popular cached items.
  function updateCounter(entry) {
    entry.counter = entry.counter + 1;
  }

  // takes an entry and makes it the head of the linked list
  function makeHead(entry, head, tail) {

    if (entry === head) return;

    if (!tail) {
      tail = entry;
    } else if (tail === entry) {
      tail = entry.prev;
    }

    linkEntries(entry.prev, entry.next);
    linkEntries(entry, head);

    head = entry;
    head.prev = null;
  }

  /**
   * Simple cache that removes items based on least recently used (LRU).
   *
   * @name Cache
   * @class
   * @param {Object} options - A hash of options to configure the cache. Currently only supports
   * LIMIT (the max number of items in cache) and TIMEOUT (how long an entry should be valid).
   */
  function Cache(options) {

    this.store = {};
    this.config = {};
    this.size = 0;
    this.head = null;
    this.tail = null;

    (0, _framptonUtils.extend)(this.config, defaults, options);
  }

  /**
   * @name get
   * @memberOf Cache
   * @method
   * @instance
   * @param {String} key Key lookup in the cache
   * @param {Function} fn Funtion to generate value if not available
   */
  Cache.prototype.get = function Cache_get(key, fn) {

    if (this.store[key]) {

      // if we have a key but it's expired, blow the mother up.
      if (isExpired(this.store[key], this.config.TIMEOUT)) {
        this.remove(key);
        return null;
      }

      // otherwise, yeah b@$%#!, let's return the value and get moving.
      makeHead(this.store[key], this.head, this.tail);
      updateCounter(this.store[key]);
      return this.store[key].value;
    }

    return null;
  };

  /**
   * @name put
   * @memberOf Cache
   * @method
   * @instance
   */
  Cache.prototype.put = function Cache_put(key, value) {

    if ((0, _framptonUtils.isNothing)(key) || (0, _framptonUtils.isNothing)(value)) return;

    if (!this.store[key]) {

      this.size = this.size + 1;
      this.store[key] = {
        key: key,
        value: value,
        next: null,
        prev: null,
        timestamp: currentTime(),
        counter: 1
      };
    } else {
      this.store[key].value = value;
      this.store[key].timestamp = currentTime();
      updateCounter(this.store[key]);
    }

    makeHead(this.store[key], this.head, this.tail);

    if (this.size > this.config.LIMIT) {
      this.remove(this.tail.key);
    }

    return value;
  };

  /**
   * @name remove
   * @memberOf Cache
   * @method
   * @instance
   */
  Cache.prototype.remove = function Cache_remove(key) {

    var entryToRemove;

    if ((0, _framptonUtils.isNothing)(this.store[key])) return;

    entryToRemove = this.store[key];

    if (entryToRemove === this.head) {
      this.head = entryToRemove.next;
    }

    if (entryToRemove === this.tail) {
      this.tail = entryToRemove.tail;
    }

    linkEntries(entryToRemove.prev, entryToRemove.next);

    delete this.store[key];

    this.size = this.size - 1;
  };

  /**
   * @name isCache
   * @memberOf Cache
   * @static
   * @param {Object} obj Object to test.
   * @return {Boolean} Is the object an instance of Cache?
   */
  Cache.isCache = function Cache_isCache(obj) {
    return obj instanceof Cache;
  };

  module.exports = Cache;
});
define('frampton-data', ['exports', 'frampton-data/either', 'frampton-data/maybe', 'frampton-data/task'], function (exports, _framptonDataEither, _framptonDataMaybe, _framptonDataTask) {
  'use strict';

  exports.__esModule = true;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Task = _interopRequire(_framptonDataTask);

  exports.Either = _framptonDataEither.Either;
  exports.Left = _framptonDataEither.Left;
  exports.Right = _framptonDataEither.Right;
  exports.Maybe = _framptonDataMaybe.Maybe;
  exports.Just = _framptonDataMaybe.Just;
  exports.Nothing = _framptonDataMaybe.Nothing;
  exports.Task = _Task;
});
define('frampton-data/either', ['exports', 'frampton-utils'], function (exports, _framptonUtils) {
  'use strict';

  exports.__esModule = true;

  /**
   *
   */
  function Either() {}

  Either.of = function (val) {
    return new Right(val);
  };

  Either.prototype.ap = _framptonUtils.notImplemented;

  Either.prototype.chain = _framptonUtils.notImplemented;

  Either.prototype.map = _framptonUtils.notImplemented;

  Either.prototype.toString = _framptonUtils.notImplemented;

  Either.prototype.isLeft = function () {
    return false;
  };

  Either.prototype.isRight = function () {
    return false;
  };

  (0, _framptonUtils.inherits)(Left, Either);

  function Left(val) {
    this.value = val;
  }

  Left.prototype.ap = _framptonUtils.identity;

  Left.prototype.chain = _framptonUtils.noop;

  Left.prototype.map = _framptonUtils.noop;

  Left.prototype.toString = function () {
    return 'Left(' + this.value + ')';
  };

  (0, _framptonUtils.inherits)(Right, Either);

  function Right(val) {
    this.value = val;
  }

  // ap(<*>) :: Either [x, (b -> c)] -> Either x b -> Either [x, c]
  Right.prototype.ap = function (either) {
    return either.map(this.value);
  };

  // chain(>>=) :: Either [x, b] -> (b -> Either [x, c]) -> Either [x, c]
  Right.prototype.chain = function (fn) {
    return fn(this.value);
  };

  // map :: Either [x, a] -> (a -> b) -> Either [x, b]
  Right.prototype.map = function (fn) {
    return new Right(fn(this.value));
  };

  // toString :: String
  Right.prototype.toString = function () {
    return 'Right(' + this.value + ')';
  };

  // isRight :: Boolean
  Right.prototype.isRight = function () {
    return true;
  };

  exports.Either = Either;
  exports.Left = Left;
  exports.Right = Right;
});
define('frampton-data/maybe', ['exports', 'frampton-utils'], function (exports, _framptonUtils) {
  'use strict';

  exports.__esModule = true;

  /**
   * @class
   */
  function Maybe(a) {}

  Maybe.fromEither = function (a) {
    return a.fold(Maybe.Nothing, Maybe.Just);
  };

  Maybe.prototype.fromEither = Maybe.fromEither;

  Maybe.of = function (val) {
    return (0, _framptonUtils.isSomething)(val) ? new Just(val) : new Nothing();
  };

  Maybe.prototype.of = Maybe.of;

  // join :: Maybe (Maybe a) -> Maybe a
  Maybe.prototype.join = _framptonUtils.notImplemented;

  // chain(>>=) :: Maybe a -> (a -> Maybe b) -> Maybe b
  Maybe.prototype.chain = _framptonUtils.notImplemented;

  // ap(<*>) :: Maybe (a -> b) -> Maybe a -> Maybe b
  Maybe.prototype.ap = _framptonUtils.notImplemented;

  Maybe.prototype.map = _framptonUtils.notImplemented;

  Maybe.prototype.isJust = function () {
    return false;
  };

  Maybe.prototype.isNothing = function () {
    return false;
  };

  Maybe.prototype.get = _framptonUtils.notImplemented;

  Maybe.prototype.getOrElse = _framptonUtils.notImplemented;

  Maybe.prototype.toString = _framptonUtils.notImplemented;

  /**
   * @class
   * @extends Maybe
   */
  (0, _framptonUtils.inherits)(Just, Maybe);

  function Just() {}

  Just.prototype.isJust = function () {
    return true;
  };

  // join :: Maybe (Maybe a) -> Maybe a
  Just.prototype.join = function () {
    return this.value;
  };

  // chain(>>=) :: Maybe a -> (a -> Maybe b) -> Maybe b
  Just.prototype.chain = function (fn) {
    return this.map(fn).join();
  };

  // ap(<*>) :: Maybe (a -> b) -> Maybe a -> Maybe b
  Just.prototype.ap = function (maybe) {
    return maybe.map(this.value);
  };

  Just.prototype.map = function (fn) {
    return this.of(fn(this.value));
  };

  Just.prototype.get = function () {
    return this.value;
  };

  Just.prototype.getOrElse = function (val) {
    return this.value;
  };

  Just.prototype.toString = function () {
    return 'Just(' + this.value + ')';
  };

  /**
   * @class
   * @extends Maybe
   */
  (0, _framptonUtils.inherits)(Nothing, Maybe);

  function Nothing() {}

  Nothing.prototype.isNothing = function () {
    return true;
  };

  Nothing.prototype.ap = function (val) {
    return val;
  };

  Nothing.prototype.map = function (fn) {
    return new Nothing();
  };

  Nothing.prototype.chain = function (fn) {
    return new Nothing();
  };

  Nothing.prototype.toString = function () {
    return 'Nothing';
  };

  Nothing.prototype.get = function () {
    throw new TypeError('Can\'t extract the value of a Nothing.');
  };

  Nothing.prototype.getOrElse = function (val) {
    return val;
  };

  exports.Maybe = Maybe;
  exports.Just = Just;
  exports.Nothing = Nothing;
});
define("frampton-data/task", ["exports"], function (exports) {
  "use strict";

  exports.__esModule = true;
  /**
   * Task takes an error stream and a value stream
   * Task are lazy, must be told to run?
   * Lazy, possibly async, error-throwing tasks
   * Stream of tasks, executed and return a new stream
   * // execute :: EventStream Task x a -> EventStream a
   * execute(stream) -> EventStream
   *
   * // fork :: EventStream Task x a -> EventStream x -> EventStream z -> ()
   * fork(stream)
   */
  function Task(computation) {
    this.run = computation;
  }

  // of(return) :: a -> Success a
  Task.prototype.of = function (val) {
    return new Task(function (_, resolve) {
      return resolve(val);
    });
  };

  // chain(>>=) :: Task x a -> (a -> Task x b) -> Task x b
  Task.prototype.chain = function (fn) {
    var run = this.run;
    return new Task(function (reject, resolve) {
      return run(function (err) {
        return reject(err);
      }, function (val) {
        return fn(val).run(reject, resolve);
      });
    });
  };

  // ap(<*>) :: Task x (a -> b) -> Task x a -> Task x b
  Task.prototype.ap = function (task) {
    return this.chain(function (fn) {
      return task.map(fn);
    });
  };

  // recover :: Task x a -> (a -> Task x b) -> Task x b
  Task.prototype.recover = function (fn) {
    var run = this.run;
    return new Task(function (reject, resolve) {
      return run(function (err) {
        return fn(err).run(reject, resolve);
      }, function (val) {
        return resolve(val);
      });
    });
  };

  // map :: Task x a -> (a -> b) -> Task x b
  Task.prototype.map = function (fn) {
    var run = this.run;
    return new Task(function (reject, resolve) {
      return run(function (err) {
        return reject(err);
      }, function (val) {
        return resolve(fn(val));
      });
    });
  };

  var runTask = function runTask(task, reject, resolve) {
    task.run(reject, resolve);
  };

  var fork = function fork(tasks, values, errors) {
    return tasks.next(function (task) {
      runTask(task, values.push, errors.push);
    });
  };

  var when = function when() {
    for (var _len = arguments.length, tasks = Array(_len), _key = 0; _key < _len; _key++) {
      tasks[_key] = arguments[_key];
    }

    tasks.forEach(function (task) {
      task.run();
    });
  };

  var sequence = function sequence() {
    for (var _len2 = arguments.length, tasks = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      tasks[_key2] = arguments[_key2];
    }

    return tasks.reduce(function (acc, next) {
      acc.chain(next);
    });
  };

  exports["default"] = Task;
  exports.runTask = runTask;
  exports.fork = fork;
  exports.sequence = sequence;
  exports.when = when;
});
define('frampton-events', ['exports', 'frampton-events/event_dispatcher', 'frampton-events/get_position'], function (exports, _framptonEventsEvent_dispatcher, _framptonEventsGet_position) {
  'use strict';

  exports.__esModule = true;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _getPosition = _interopRequire(_framptonEventsGet_position);

  exports.addListener = _framptonEventsEvent_dispatcher.addListener;
  exports.removeListener = _framptonEventsEvent_dispatcher.removeListener;
  exports.getPosition = _getPosition;
});
define("frampton-events/closest", ["exports"], function (exports) {
  "use strict";
});
define('frampton-events/contains', ['exports', 'module', 'frampton-utils/curry', 'frampton-utils/is_something'], function (exports, module, _framptonUtilsCurry, _framptonUtilsIs_something) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _isSomething = _interopRequire(_framptonUtilsIs_something);

  module.exports = (0, _curry)(function curried_contains(element, evt) {
    var target = evt.target;
    return (0, _isSomething)(target) && (0, _isSomething)(element) && (element === target || element.contains(target));
  });
});
define('frampton-events/event_dispatcher', ['exports', 'frampton-utils'], function (exports, _framptonUtils) {
  'use strict';

  exports.__esModule = true;

  /**
   *
   */
  var EVENT_MAPPING = {
    focus: 'focusin',
    blur: 'focusout'
  };

  var EVENT_CACHE = {};

  var listeners = {};

  var listener = {
    target: null,
    callback: null
  };

  function eventFor(eventName, target) {}

  function addCustomEvent(eventName, callback, target) {}

  function addListener(eventName, callback, target) {

    var listen = (0, _framptonUtils.isFunction)(target.addEventListener) ? target.addEventListener : (0, _framptonUtils.isFunction)(target.on) ? target.on : null;

    (0, _framptonUtils.assert)('addListener received an unknown type as target', (0, _framptonUtils.isFunction)(listen));

    listen.call(target, eventName, callback);

    return (0, _framptonUtils.lazy)(removeListener, eventName, callback, target);
  }

  function removeListener(eventName, callback, target) {

    var remove = (0, _framptonUtils.isFunction)(target.removeEventListener) ? target.removeEventListener : (0, _framptonUtils.isFunction)(target.off) ? target.off : null;

    (0, _framptonUtils.assert)('removeListener received an unknown type as target', (0, _framptonUtils.isFunction)(remove));

    remove.call(target, eventName, callback);
  }

  exports.addListener = addListener;
  exports.removeListener = removeListener;
});
define("frampton-events/event_target", ["exports", "module"], function (exports, module) {
  "use strict";

  module.exports = function (evt) {
    return evt.target;
  };
});
define('frampton-events/event_value', ['exports', 'module', 'frampton-utils/compose', 'frampton-events/event_target', 'frampton-events/target_value'], function (exports, module, _framptonUtilsCompose, _framptonEventsEvent_target, _framptonEventsTarget_value) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _compose = _interopRequire(_framptonUtilsCompose);

  var _eventTarget = _interopRequire(_framptonEventsEvent_target);

  var _targetValue = _interopRequire(_framptonEventsTarget_value);

  module.exports = (0, _compose)(_targetValue, _eventTarget);
});
define("frampton-events/get_position", ["exports", "module"], function (exports, module) {
  "use strict";

  module.exports = get_position;

  function get_position(evt) {

    var posx = 0;
    var posy = 0;
    var body = document.body;
    var documentElement = document.documentElement;

    if (evt.pageX || evt.pageY) {
      posx = evt.pageX;
      posy = evt.pageY;
    } else if (evt.clientX || evt.clientY) {
      posx = evt.clientX + body.scrollLeft + documentElement.scrollLeft;
      posy = evt.clientY + body.scrollTop + documentElement.scrollTop;
    }

    return [posx, posy];
  }
});
define('frampton-events/get_position_relative', ['exports', 'module', 'frampton-utils/curry', 'frampton-events/get_position'], function (exports, module, _framptonUtilsCurry, _framptonEventsGet_position) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _getPosition = _interopRequire(_framptonEventsGet_position);

  module.exports = (0, _curry)(function get_position_relative(node, evt) {

    var position = (0, _getPosition)(evt);

    var rect = node.getBoundingClientRect();
    var relx = rect.left + document.body.scrollLeft + document.documentElement.scrollLeft;
    var rely = rect.top + document.body.scrollTop + document.documentElement.scrollTop;

    var posx = position[0] - Math.round(relx) - node.clientLeft;
    var posy = position[1] - Math.round(rely) - node.clientTop;

    return [posx, posy];
  });
});
define("frampton-events/target_value", ["exports", "module"], function (exports, module) {
  "use strict";

  module.exports = function (target) {
    return target.value;
  };
});
define('frampton-keyboard', ['exports', 'frampton-keyboard/keyboard', 'frampton-keyboard/key_code', 'frampton-keyboard/is_key', 'frampton-keyboard/is_enter', 'frampton-keyboard/is_esc', 'frampton-keyboard/is_up', 'frampton-keyboard/is_down', 'frampton-keyboard/is_left', 'frampton-keyboard/is_right'], function (exports, _framptonKeyboardKeyboard, _framptonKeyboardKey_code, _framptonKeyboardIs_key, _framptonKeyboardIs_enter, _framptonKeyboardIs_esc, _framptonKeyboardIs_up, _framptonKeyboardIs_down, _framptonKeyboardIs_left, _framptonKeyboardIs_right) {
  'use strict';

  exports.__esModule = true;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Keyboard = _interopRequire(_framptonKeyboardKeyboard);

  var _keyCode = _interopRequire(_framptonKeyboardKey_code);

  var _isKey = _interopRequire(_framptonKeyboardIs_key);

  var _isEnter = _interopRequire(_framptonKeyboardIs_enter);

  var _isEsc = _interopRequire(_framptonKeyboardIs_esc);

  var _isUp = _interopRequire(_framptonKeyboardIs_up);

  var _isDown = _interopRequire(_framptonKeyboardIs_down);

  var _isLeft = _interopRequire(_framptonKeyboardIs_left);

  var _isRight = _interopRequire(_framptonKeyboardIs_right);

  exports.Keyboard = _Keyboard;
  exports.keyCode = _keyCode;
  exports.isKey = _isKey;
  exports.isEsc = _isEsc;
  exports.isEnter = _isEnter;
  exports.isUp = _isUp;
  exports.isDown = _isDown;
  exports.isLeft = _isLeft;
  exports.isRight = _isRight;
});
define('frampton-keyboard/is_down', ['exports', 'module', 'frampton-keyboard/is_key', 'frampton-keyboard/key_map'], function (exports, module, _framptonKeyboardIs_key, _framptonKeyboardKey_map) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isKey = _interopRequire(_framptonKeyboardIs_key);

  var _KEY_MAP = _interopRequire(_framptonKeyboardKey_map);

  // is_down :: KeyCode -> Boolean
  module.exports = (0, _isKey)(_KEY_MAP.DOWN);
});
define('frampton-keyboard/is_enter', ['exports', 'module', 'frampton-keyboard/is_key', 'frampton-keyboard/key_map'], function (exports, module, _framptonKeyboardIs_key, _framptonKeyboardKey_map) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isKey = _interopRequire(_framptonKeyboardIs_key);

  var _KEY_MAP = _interopRequire(_framptonKeyboardKey_map);

  // is_enter :: KeyCode -> Boolean
  module.exports = (0, _isKey)(_KEY_MAP.ENTER);
});
define('frampton-keyboard/is_esc', ['exports', 'module', 'frampton-keyboard/is_key', 'frampton-keyboard/key_map'], function (exports, module, _framptonKeyboardIs_key, _framptonKeyboardKey_map) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isKey = _interopRequire(_framptonKeyboardIs_key);

  var _KEY_MAP = _interopRequire(_framptonKeyboardKey_map);

  // is_esc :: KeyCode -> Boolean
  module.exports = (0, _isKey)(_KEY_MAP.ESC);
});
define('frampton-keyboard/is_key', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  // isKey :: KeyCode -> KeyCode -> Boolean
  module.exports = (0, _curry)(function is_key(key, keyCode) {
    return key === keyCode;
  });
});
define('frampton-keyboard/is_left', ['exports', 'module', 'frampton-keyboard/is_key', 'frampton-keyboard/key_map'], function (exports, module, _framptonKeyboardIs_key, _framptonKeyboardKey_map) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isKey = _interopRequire(_framptonKeyboardIs_key);

  var _KEY_MAP = _interopRequire(_framptonKeyboardKey_map);

  // is_left :: KeyCode -> Boolean
  module.exports = (0, _isKey)(_KEY_MAP.LEFT);
});
define('frampton-keyboard/is_right', ['exports', 'module', 'frampton-keyboard/is_key', 'frampton-keyboard/key_map'], function (exports, module, _framptonKeyboardIs_key, _framptonKeyboardKey_map) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isKey = _interopRequire(_framptonKeyboardIs_key);

  var _KEY_MAP = _interopRequire(_framptonKeyboardKey_map);

  // is_right :: KeyCode -> Boolean
  module.exports = (0, _isKey)(_KEY_MAP.RIGHT);
});
define('frampton-keyboard/is_up', ['exports', 'module', 'frampton-keyboard/is_key', 'frampton-keyboard/key_map'], function (exports, module, _framptonKeyboardIs_key, _framptonKeyboardKey_map) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isKey = _interopRequire(_framptonKeyboardIs_key);

  var _KEY_MAP = _interopRequire(_framptonKeyboardKey_map);

  // is_up :: KeyCode -> Boolean
  module.exports = (0, _isKey)(_KEY_MAP.UP);
});
define('frampton-keyboard/key_code', ['exports', 'module', 'frampton-utils/get'], function (exports, module, _framptonUtilsGet) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _get = _interopRequire(_framptonUtilsGet);

  // key_code :: DomEvent -> KeyCode
  module.exports = (0, _get)('keyCode');
});
define("frampton-keyboard/key_map", ["exports", "module"], function (exports, module) {
  "use strict";

  module.exports = {
    ENTER: 13,
    ESC: 27,
    SPACE: 32,
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39
  };
});
define('frampton-keyboard/keyboard', ['exports', 'module', 'frampton-utils', 'frampton-list', 'frampton-signals', 'frampton-keyboard/key_map', 'frampton-keyboard/key_code'], function (exports, module, _framptonUtils, _framptonList, _framptonSignals, _framptonKeyboardKey_map, _framptonKeyboardKey_code) {
  'use strict';

  module.exports = Keyboard;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _KEY_MAP = _interopRequire(_framptonKeyboardKey_map);

  var _keyCode = _interopRequire(_framptonKeyboardKey_code);

  var keyUp = (0, _framptonSignals.listen)('keyup', document);
  var keyDown = (0, _framptonSignals.listen)('keydown', document);
  var keyPress = (0, _framptonSignals.listen)('keypress', document);
  var keyUpCodes = keyUp.map(_keyCode);
  var keyDownCodes = keyDown.map(_keyCode);
  // var isDown = stepper(false, keyDown.map(true).merge(keyUp.map(false)));

  var addKey = function addKey(keyCode) {
    return function (arr) {
      if (!(0, _framptonList.contains)(arr, keyCode)) {
        return (0, _framptonList.append)(arr, keyCode);
      }
      return arr;
    };
  };

  var removeKey = function removeKey(keyCode) {
    return function (arr) {
      return (0, _framptonList.remove)(arr, keyCode);
    };
  };

  var update = function update(acc, fn) {
    return fn(acc);
  };

  //+ rawEvents :: EventStream Function
  var rawEvents = keyUpCodes.map(removeKey).merge(keyDownCodes.map(addKey));

  //+ keysDown :: EventStream []
  var keysDown = rawEvents.fold(update, []);

  //+ keyIsDown :: KeyCode -> EventStream Boolean
  var keyIsDown = function keyIsDown(keyCode) {
    return keysDown.map(function (arr) {
      return (0, _framptonList.contains)(arr, keyCode);
    });
  };

  var direction = (0, _framptonUtils.curry)(function (keyCode, arr) {
    return (0, _framptonList.contains)(arr, keyCode) ? 1 : 0;
  });

  var isUp = direction(_KEY_MAP.UP);

  var isDown = direction(_KEY_MAP.DOWN);

  var isRight = direction(_KEY_MAP.RIGHT);

  var isLeft = direction(_KEY_MAP.LEFT);

  //+ arrows :: EventStream [horizontal, vertical]
  var arrows = keysDown.map(function (arr) {
    return [isRight(arr) - isLeft(arr), isUp(arr) - isDown(arr)];
  });

  var defaultKeyboard = {
    downs: keyDown,
    ups: keyUp,
    presses: keyPress,
    keyCodes: keyUpCodes,
    arrows: (0, _framptonSignals.stepper)([0, 0], arrows),
    escapes: (0, _framptonSignals.stepper)(false, keyIsDown(_KEY_MAP.ESC)),
    enters: (0, _framptonSignals.stepper)(false, keyIsDown(_KEY_MAP.ENTER)),
    spaces: (0, _framptonSignals.stepper)(false, keyIsDown(_KEY_MAP.SPACE))
  };

  function Keyboard(element) {
    return defaultKeyboard;
  }
});
define('frampton-list', ['exports', 'frampton-list/append', 'frampton-list/contains', 'frampton-list/copy', 'frampton-list/diff', 'frampton-list/drop', 'frampton-list/each', 'frampton-list/filter', 'frampton-list/foldl', 'frampton-list/foldr', 'frampton-list/head', 'frampton-list/init', 'frampton-list/last', 'frampton-list/length', 'frampton-list/maximum', 'frampton-list/minimum', 'frampton-list/prepend', 'frampton-list/product', 'frampton-list/remove', 'frampton-list/reverse', 'frampton-list/split', 'frampton-list/sum', 'frampton-list/tail', 'frampton-list/zip'], function (exports, _framptonListAppend, _framptonListContains, _framptonListCopy, _framptonListDiff, _framptonListDrop, _framptonListEach, _framptonListFilter, _framptonListFoldl, _framptonListFoldr, _framptonListHead, _framptonListInit, _framptonListLast, _framptonListLength, _framptonListMaximum, _framptonListMinimum, _framptonListPrepend, _framptonListProduct, _framptonListRemove, _framptonListReverse, _framptonListSplit, _framptonListSum, _framptonListTail, _framptonListZip) {
  'use strict';

  exports.__esModule = true;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _append = _interopRequire(_framptonListAppend);

  var _contains = _interopRequire(_framptonListContains);

  var _copy = _interopRequire(_framptonListCopy);

  var _diff = _interopRequire(_framptonListDiff);

  var _drop = _interopRequire(_framptonListDrop);

  var _each = _interopRequire(_framptonListEach);

  var _filter = _interopRequire(_framptonListFilter);

  var _foldl = _interopRequire(_framptonListFoldl);

  var _foldr = _interopRequire(_framptonListFoldr);

  var _head = _interopRequire(_framptonListHead);

  var _init = _interopRequire(_framptonListInit);

  var _last = _interopRequire(_framptonListLast);

  var _length = _interopRequire(_framptonListLength);

  var _maximum = _interopRequire(_framptonListMaximum);

  var _minimum = _interopRequire(_framptonListMinimum);

  var _prepend = _interopRequire(_framptonListPrepend);

  var _product = _interopRequire(_framptonListProduct);

  var _remove = _interopRequire(_framptonListRemove);

  var _reverse = _interopRequire(_framptonListReverse);

  var _split = _interopRequire(_framptonListSplit);

  var _sum = _interopRequire(_framptonListSum);

  var _tail = _interopRequire(_framptonListTail);

  var _zip = _interopRequire(_framptonListZip);

  exports.append = _append;
  exports.contains = _contains;
  exports.copy = _copy;
  exports.diff = _diff;
  exports.drop = _drop;
  exports.each = _each;
  exports.filter = _filter;
  exports.foldl = _foldl;
  exports.foldr = _foldr;
  exports.head = _head;
  exports.init = _init;
  exports.last = _last;
  exports.length = _length;
  exports.maximum = _maximum;
  exports.minimum = _minimum;
  exports.prepend = _prepend;
  exports.product = _product;
  exports.reverse = _reverse;
  exports.remove = _remove;
  exports.split = _split;
  exports.sum = _sum;
  exports.tail = _tail;
  exports.zip = _zip;
});
define('frampton-list/append', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  /**
   * @name append
   * @param {Array} xs
   * @param {Any} obj
   */
  module.exports = (0, _curry)(function (xs, obj) {
    return xs.concat([].concat(obj));
  });
});
define('frampton-list/contains', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  /**
   *
   */
  module.exports = (0, _curry)(function (xs, obj) {
    return xs.indexOf(obj) > -1;
  });
});
define("frampton-list/copy", ["exports", "module"], function (exports, module) {
  /**
   * @name copy
   * @memberOf Frampton
   */
  "use strict";

  module.exports = function (args, begin, end) {

    var argLen = args.length,
        arrLen = 0,
        idx = 0,
        arr,
        i;

    begin = begin || 0;
    end = end || argLen;
    arrLen = end - begin;

    if (argLen > 0) {
      arr = new Array(arrLen);
      for (i = begin; i < end; i++) {
        arr[idx++] = args[i];
      }
    }

    return arr || [];
  };
});
define('frampton-list/diff', ['exports', 'module', 'frampton-utils/curry', 'frampton-list/contains'], function (exports, module, _framptonUtilsCurry, _framptonListContains) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _contains = _interopRequire(_framptonListContains);

  /**
   * @name diff
   * @memberOf Frampton
   * @returns {Array}
   */
  module.exports = (0, _curry)(function curried_diff(xs, ys) {

    var diff = [];

    xs.forEach(function (item) {
      if (!(0, _contains)(ys, item)) diff.push(item);
    });

    return diff;
  });
});
define('frampton-list/drop', ['exports', 'module', 'frampton-utils/assert', 'frampton-utils/curry', 'frampton-utils/is_array', 'frampton-list/copy'], function (exports, module, _framptonUtilsAssert, _framptonUtilsCurry, _framptonUtilsIs_array, _framptonListCopy) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _assert = _interopRequire(_framptonUtilsAssert);

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _isArray = _interopRequire(_framptonUtilsIs_array);

  var _copy = _interopRequire(_framptonListCopy);

  /**
   * @name drop
   * @memberOf Frampton
   */
  module.exports = (0, _curry)(function curried_drop(n, xs) {
    (0, _assert)('Frampton.drop recieved a non-array', (0, _isArray)(xs));
    return (0, _copy)(xs, n);
  });
});
define('frampton-list/each', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  /**
   * @name each
   * @memberOf Frampton
   * @static
   */
  module.exports = (0, _curry)(function curried_each(fn, xs) {
    xs.forEach(fn);
  });
});
define('frampton-list/filter', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  /**
   * @name filter
   * @memberOf Frampton
   * @static
   */
  module.exports = (0, _curry)(function (predicate, xs) {
    return xs.filter(predicate);
  });
});
define('frampton-list/foldl', ['exports', 'module', 'frampton-utils/assert', 'frampton-utils/curry', 'frampton-utils/is_array'], function (exports, module, _framptonUtilsAssert, _framptonUtilsCurry, _framptonUtilsIs_array) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _assert = _interopRequire(_framptonUtilsAssert);

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _isArray = _interopRequire(_framptonUtilsIs_array);

  /**
   * @name foldl
   * @memberOf Frampton
   * @static
   */
  module.exports = (0, _curry)(function curried_foldl(fn, acc, xs) {
    (0, _assert)('Frampton.foldl recieved a non-array', (0, _isArray)(xs));
    return xs.reduce(fn, acc);
  });
});
define('frampton-list/foldr', ['exports', 'module', 'frampton-utils/assert', 'frampton-utils/curry', 'frampton-utils/is_array'], function (exports, module, _framptonUtilsAssert, _framptonUtilsCurry, _framptonUtilsIs_array) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _assert = _interopRequire(_framptonUtilsAssert);

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _isArray = _interopRequire(_framptonUtilsIs_array);

  /**
   * @name foldr
   * @memberOf Frampton
   * @static
   */
  module.exports = (0, _curry)(function curried_foldr(fn, acc, xs) {
    (0, _assert)('Frampton.foldr recieved a non-array', (0, _isArray)(xs));
    return xs.reduceRight(fn, acc);
  });
});
define('frampton-list/head', ['exports', 'module', 'frampton-utils/assert', 'frampton-utils/is_defined', 'frampton-utils/is_array'], function (exports, module, _framptonUtilsAssert, _framptonUtilsIs_defined, _framptonUtilsIs_array) {
  'use strict';

  /**
   * @name head
   * @memberOf Frampton
   * @static
   */
  module.exports = head;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _assert = _interopRequire(_framptonUtilsAssert);

  var _isDefined = _interopRequire(_framptonUtilsIs_defined);

  var _isArray = _interopRequire(_framptonUtilsIs_array);

  function head(xs) {
    (0, _assert)('Frampton.head recieved a non-array', (0, _isArray)(xs));
    return (0, _isDefined)(xs[0]) ? xs[0] : null;
  }
});
define('frampton-list/init', ['exports', 'frampton-utils/assert', 'frampton-utils/is_array'], function (exports, _framptonUtilsAssert, _framptonUtilsIs_array) {
  'use strict';

  exports.__esModule = true;

  /**
   * @name init
   * @memberOf Frampton
   * @static
   */
  exports.init = init;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _assert = _interopRequire(_framptonUtilsAssert);

  var _isArray = _interopRequire(_framptonUtilsIs_array);

  function init(xs) {
    (0, _assert)('Frampton.init recieved a non-array', (0, _isArray)(xs));
    switch (xs.length) {
      case 0:
        return [];
      default:
        return xs.slice(0, xs.length - 1);
    }
  }
});
define('frampton-list/last', ['exports', 'frampton-utils/assert', 'frampton-utils/is_array'], function (exports, _framptonUtilsAssert, _framptonUtilsIs_array) {
  'use strict';

  exports.__esModule = true;

  /**
   * @name last
   * @memberOf Frampton
   * @static
   */
  exports.last = last;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _assert = _interopRequire(_framptonUtilsAssert);

  var _isArray = _interopRequire(_framptonUtilsIs_array);

  function last(xs) {
    (0, _assert)('Frampton.last recieved a non-array', (0, _isArray)(xs));
    switch (xs.length) {
      case 0:
        return null;
      default:
        return xs[xs.length - 1];
    }
  }
});
define('frampton-list/length', ['exports', 'module', 'frampton-utils/is_array'], function (exports, module, _framptonUtilsIs_array) {
  'use strict';

  /**
   * @name length
   * @memberOf Frampton
   * @static
   */
  module.exports = length;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isArray = _interopRequire(_framptonUtilsIs_array);

  function length(xs) {
    return (0, _isArray)(xs) ? xs.length : 0;
  }
});
define('frampton-list/maximum', ['exports', 'module', 'frampton-list/foldl'], function (exports, module, _framptonListFoldl) {
  'use strict';

  /**
   * @name maximum
   * @param {Array} xs
   */
  module.exports = maximum;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _foldl = _interopRequire(_framptonListFoldl);

  function maximum(xs) {
    (0, _foldl)(function (acc, next) {
      if (!acc || next > acc) return acc = next;
      return acc;
    }, null, xs);
  }
});
define('frampton-list/minimum', ['exports', 'module', 'frampton-list/foldl'], function (exports, module, _framptonListFoldl) {
  'use strict';

  /**
   * @name minimum
   * @param {Array} xs
   */
  module.exports = minimum;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _foldl = _interopRequire(_framptonListFoldl);

  function minimum(xs) {
    (0, _foldl)(function (acc, next) {
      if (!acc || next < acc) return acc = next;
      return acc;
    }, null, xs);
  }
});
define('frampton-list/prepend', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  /**
   * @name cons
   * @param {Any} obj
   * @param {Array} xs
   */
  module.exports = (0, _curry)(function (obj, ys) {
    return [].concat(obj).concat(ys);
  });
});
define('frampton-list/product', ['exports', 'module', 'frampton-list/foldl'], function (exports, module, _framptonListFoldl) {
  'use strict';

  /**
   * @name product
   * @param {Array} xs
   */
  module.exports = product;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _foldl = _interopRequire(_framptonListFoldl);

  function product(xs) {
    (0, _foldl)(function (acc, next) {
      return acc = acc * next;
    }, 0, xs);
  }
});
define('frampton-list/remove', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  /**
   * remove :: List a -> Any a -> List a
   *
   * @name remove
   * @memberOf Frampton
   * @static
   * @param {Array} xs
   * @param {Object} obj
   */
  module.exports = (0, _curry)(function curried_remove(xs, obj) {
    return xs.filter(function (next) {
      return next !== obj;
    });
  });
});
define('frampton-list/reverse', ['exports', 'module', 'frampton-list/foldr'], function (exports, module, _framptonListFoldr) {
  'use strict';

  /**
   * + reverse :: List a -> List a
   *
   * @name reverse
   * @memberOf Frampton
   * @static
   */
  module.exports = reverse;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _foldr = _interopRequire(_framptonListFoldr);

  function reverse(xs) {
    return (0, _foldr)(function (acc, next) {
      acc.push(next);
      return acc;
    }, [], xs);
  }
});
define('frampton-list/split', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  /**
   * + split :: Number -> List a -> (List a, List a)
   */
  module.exports = (0, _curry)(function (n, xs) {});
});
define('frampton-list/sum', ['exports', 'module', 'frampton-list/foldl'], function (exports, module, _framptonListFoldl) {
  'use strict';

  /**
   * + sum :: Number a => List a -> a
   * @name sum
   * @param {Array} xs
   */
  module.exports = sum;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _foldl = _interopRequire(_framptonListFoldl);

  function sum(xs) {
    (0, _foldl)(function (acc, next) {
      return acc = acc + next;
    }, 0, xs);
  }
});
define('frampton-list/tail', ['exports', 'frampton-utils/assert', 'frampton-utils/is_array'], function (exports, _framptonUtilsAssert, _framptonUtilsIs_array) {
  'use strict';

  exports.__esModule = true;
  exports.tail = tail;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  /**
   * @name tail
   * @memberOf Frampton
   * @static
   */

  var _assert = _interopRequire(_framptonUtilsAssert);

  var _isArray = _interopRequire(_framptonUtilsIs_array);

  function tail(xs) {
    (0, _assert)('Frampton.tail recieved a non-array', (0, _isArray)(xs));
    switch (xs.length) {
      case 0:
        return [];
      default:
        return xs.slice(1);
    }
  }
});
define('frampton-list/zip', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  /**
   * zip :: List a -> List b - List (a, b)
   *
   * @name zip
   * @memberOf Frampton
   * @param {Array} xs
   * @param {Array} ys
   */
  module.exports = (0, _curry)(function (xs, ys) {

    var xLen = xs.length;
    var yLen = ys.length;
    var len = xLen > yLen ? yLen : xLen;
    var zs = new Array(len);
    var i = 0;

    for (; i < len; i++) {
      zs[i] = [xs[i], ys[i]];
    }

    return zs;
  });
});
define('frampton-math', ['exports', 'frampton-math/add', 'frampton-math/subtract', 'frampton-math/multiply', 'frampton-math/divide', 'frampton-math/modulo', 'frampton-math/max', 'frampton-math/min'], function (exports, _framptonMathAdd, _framptonMathSubtract, _framptonMathMultiply, _framptonMathDivide, _framptonMathModulo, _framptonMathMax, _framptonMathMin) {
  'use strict';

  exports.__esModule = true;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _add = _interopRequire(_framptonMathAdd);

  var _subtract = _interopRequire(_framptonMathSubtract);

  var _multiply = _interopRequire(_framptonMathMultiply);

  var _divide = _interopRequire(_framptonMathDivide);

  var _modulo = _interopRequire(_framptonMathModulo);

  var _max = _interopRequire(_framptonMathMax);

  var _min = _interopRequire(_framptonMathMin);

  exports.add = _add;
  exports.subtract = _subtract;
  exports.multiply = _multiply;
  exports.divide = _divide;
  exports.modulo = _modulo;
  exports.max = _max;
  exports.min = _min;
});
define('frampton-math/add', ['exports', 'module', 'frampton-utils'], function (exports, module, _framptonUtils) {
  'use strict';

  // add :: Number -> Number -> Number
  module.exports = (0, _framptonUtils.curry)(function add(a, b) {
    return a + b;
  });
});
define('frampton-math/divide', ['exports', 'module', 'frampton-utils'], function (exports, module, _framptonUtils) {
  'use strict';

  // divide :: Number -> Number -> Number
  module.exports = (0, _framptonUtils.curry)(function divide(a, b) {
    return a / b;
  });
});
define('frampton-math/max', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  module.exports = (0, _curry)(function (a, b) {
    return a > b ? a : b;
  });
});
define('frampton-math/min', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  module.exports = (0, _curry)(function (a, b) {
    return a < b ? a : b;
  });
});
define('frampton-math/modulo', ['exports', 'module', 'frampton-utils'], function (exports, module, _framptonUtils) {
  'use strict';

  // modulo :: Number -> Number -> Number
  module.exports = (0, _framptonUtils.curry)(function modulo(a, b) {
    return a % b;
  });
});
define('frampton-math/multiply', ['exports', 'module', 'frampton-utils'], function (exports, module, _framptonUtils) {
  'use strict';

  // multiply :: Number -> Number -> Number
  module.exports = (0, _framptonUtils.curry)(function multiply(a, b) {
    return a * b;
  });
});
define('frampton-math/subtract', ['exports', 'module', 'frampton-utils'], function (exports, module, _framptonUtils) {
  'use strict';

  // subtract :: Number -> Number -> Number
  module.exports = (0, _framptonUtils.curry)(function subtract(a, b) {
    return a - b;
  });
});
define('frampton-mouse', ['exports', 'module', 'frampton-signals', 'frampton-events/contains', 'frampton-events/get_position', 'frampton-events/get_position_relative'], function (exports, module, _framptonSignals, _framptonEventsContains, _framptonEventsGet_position, _framptonEventsGet_position_relative) {
  'use strict';

  module.exports = Mouse;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _contains = _interopRequire(_framptonEventsContains);

  var _getPosition = _interopRequire(_framptonEventsGet_position);

  var _getPositionRelative = _interopRequire(_framptonEventsGet_position_relative);

  var clickStream = (0, _framptonSignals.listen)('click', document);
  var downStream = (0, _framptonSignals.listen)('mousedown', document);
  var upStream = (0, _framptonSignals.listen)('mouseup', document);
  var moveStream = (0, _framptonSignals.listen)('mousemove', document);
  var isDown = (0, _framptonSignals.stepper)(false, downStream.map(true).merge(upStream.map(false)));

  var defaultMouse = {
    clicks: clickStream,
    downs: downStream,
    ups: upStream,
    position: (0, _framptonSignals.stepper)([0, 0], moveStream.map(_getPosition)),
    isDown: isDown
  };

  function Mouse(element) {
    if (!element) {
      return defaultMouse;
    } else {
      return {
        clicks: clickStream.filter((0, _contains)(element)),
        downs: downStream.filter((0, _contains)(element)),
        ups: upStream.filter((0, _contains)(element)),
        position: (0, _framptonSignals.stepper)([0, 0], moveStream.filter((0, _contains)(element)).map((0, _getPositionRelative)(element))),
        isDown: isDown
      };
    }
  }
});
define('frampton-object', ['exports', 'frampton-object/filter', 'frampton-object/reduce', 'frampton-object/map', 'frampton-object/for_each'], function (exports, _framptonObjectFilter, _framptonObjectReduce, _framptonObjectMap, _framptonObjectFor_each) {
  'use strict';

  exports.__esModule = true;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _filter = _interopRequire(_framptonObjectFilter);

  var _reduce = _interopRequire(_framptonObjectReduce);

  var _map = _interopRequire(_framptonObjectMap);

  var _forEach = _interopRequire(_framptonObjectFor_each);

  exports.filter = _filter;
  exports.map = _map;
  exports.reduce = _reduce;
  exports.forEach = _forEach;
});
define('frampton-object/filter', ['exports', 'module', 'frampton-utils', 'frampton-object/for_each'], function (exports, module, _framptonUtils, _framptonObjectFor_each) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _forEach = _interopRequire(_framptonObjectFor_each);

  module.exports = (0, _framptonUtils.curry)(function curried_filter(fn, obj) {

    var newObj = {};

    (0, _forEach)(function (value, key) {
      if (fn(value, key)) {
        newObj[key] = value;
      }
    }, obj);

    return newObj;
  });
});
define('frampton-object/for_each', ['exports', 'module', 'frampton-utils'], function (exports, module, _framptonUtils) {
  'use strict';

  module.exports = (0, _framptonUtils.curry)(function curried_for_each(fn, obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        fn(obj[key], key);
      }
    }
  });
});
define('frampton-object/map', ['exports', 'module', 'frampton-utils', 'frampton-object/for_each'], function (exports, module, _framptonUtils, _framptonObjectFor_each) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _forEach = _interopRequire(_framptonObjectFor_each);

  module.exports = (0, _framptonUtils.curry)(function curried_map(fn, obj) {

    var newObj = {};

    (0, _forEach)(function (value, key) {
      newObj[key] = fn(value, key);
    }, obj);

    return newObj;
  });
});
define('frampton-object/reduce', ['exports', 'module', 'frampton-utils', 'frampton-object/for_each'], function (exports, module, _framptonUtils, _framptonObjectFor_each) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _forEach = _interopRequire(_framptonObjectFor_each);

  module.exports = (0, _framptonUtils.curry)(function curried_reduce(fn, acc, obj) {

    (0, _forEach)(function (value, key) {
      acc = fn(acc, value, key);
    }, obj);

    return acc;
  });
});
define('frampton-signals', ['exports', 'frampton-signals/dispatcher', 'frampton-signals/event_stream', 'frampton-signals/behavior', 'frampton-signals/empty', 'frampton-signals/interval', 'frampton-signals/sequential', 'frampton-signals/listen', 'frampton-signals/null', 'frampton-signals/send', 'frampton-signals/stepper', 'frampton-signals/accum_b', 'frampton-signals/event'], function (exports, _framptonSignalsDispatcher, _framptonSignalsEvent_stream, _framptonSignalsBehavior, _framptonSignalsEmpty, _framptonSignalsInterval, _framptonSignalsSequential, _framptonSignalsListen, _framptonSignalsNull, _framptonSignalsSend, _framptonSignalsStepper, _framptonSignalsAccum_b, _framptonSignalsEvent) {
  'use strict';

  exports.__esModule = true;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Dispatcher = _interopRequire(_framptonSignalsDispatcher);

  var _EventStream = _interopRequire(_framptonSignalsEvent_stream);

  var _Behavior = _interopRequire(_framptonSignalsBehavior);

  var _empty = _interopRequire(_framptonSignalsEmpty);

  var _interval = _interopRequire(_framptonSignalsInterval);

  var _sequential = _interopRequire(_framptonSignalsSequential);

  var _listen = _interopRequire(_framptonSignalsListen);

  var _nullStream = _interopRequire(_framptonSignalsNull);

  var _send = _interopRequire(_framptonSignalsSend);

  var _stepper = _interopRequire(_framptonSignalsStepper);

  var _accumB = _interopRequire(_framptonSignalsAccum_b);

  exports.Dispatcher = _Dispatcher;
  exports.EventStream = _EventStream;
  exports.Behavior = _Behavior;
  exports.nextEvent = _framptonSignalsEvent.nextEvent;
  exports.endEvent = _framptonSignalsEvent.endEvent;
  exports.errorEvent = _framptonSignalsEvent.errorEvent;
  exports.emptyEvent = _framptonSignalsEvent.emptyEvent;
  exports.empty = _empty;
  exports.interval = _interval;
  exports.sequential = _sequential;
  exports.listen = _listen;
  exports.nullStream = _nullStream;
  exports.send = _send;
  exports.merge = _framptonSignalsEvent_stream.merge;
  exports.stepper = _stepper;
  exports.accumB = _accumB;
});
define('frampton-signals/accum_b', ['exports', 'module', 'frampton-utils', 'frampton-signals/behavior'], function (exports, module, _framptonUtils, _framptonSignalsBehavior) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Behavior = _interopRequire(_framptonSignalsBehavior);

  // accumB :: a -> EventStream (a -> b) -> Behavior b
  module.exports = (0, _framptonUtils.curry)(function accumB(initial, stream) {
    return new _Behavior(initial, function (behavior) {
      return stream.next(function (fn) {
        behavior.update(fn(initial));
      });
    });
  });
});
define('frampton-signals/behavior', ['exports', 'module', 'frampton-utils', 'frampton-list'], function (exports, module, _framptonUtils, _framptonList) {
  'use strict';

  function Behavior(initial, seed) {
    (0, _framptonUtils.assert)('Behavior must have initial value', (0, _framptonUtils.isDefined)(initial));
    this.value = initial;
    this.listeners = [];
    this.cleanup = null;
    this.seed = seed || _framptonUtils.noop;
    this._id = (0, _framptonUtils.guid)();
  }

  function addListener(behavior, fn) {
    if (!(0, _framptonList.contains)(behavior.listeners, fn)) {
      if (behavior.listeners.length === 0) {
        var sink = behavior.update.bind(behavior);
        behavior.cleanup = behavior.seed(sink) || _framptonUtils.noop;
      }
      behavior.listeners.push(fn);
      fn(behavior.value);
    }
  }

  function updateListeners(behavior) {
    behavior.listeners.forEach(function (listener) {
      listener(behavior.value);
    });
  }

  // of :: a -> Behavior a
  Behavior.of = function Behavior_of(value) {
    return new Behavior(value);
  };

  Behavior.prototype.of = Behavior.of;

  Behavior.prototype.update = function Behavior_update(val) {
    if (val !== this.value) {
      this.value = val;
      updateListeners(this);
    }
    return this;
  };

  Behavior.prototype.changes = function Behavior_changes(fn) {
    addListener(this, fn);
    return this;
  };

  Behavior.prototype.bind = function Behavior_bind(obj, prop) {
    this.changes(function (val) {
      obj[prop] = val;
    });
    return this;
  };

  Behavior.prototype.destroy = function Behavior_destroy() {
    this.cleanup();
    this.cleanup = null;
    this.seed = null;
    this.value = null;
    this.listeners = null;
  };

  module.exports = Behavior;
});
define('frampton-signals/cached', ['exports', 'module', 'frampton-signals/event_stream', 'frampton-cache'], function (exports, module, _framptonSignalsEvent_stream, _framptonCache) {
  'use strict';

  module.exports = cached;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _EventStream = _interopRequire(_framptonSignalsEvent_stream);

  var _Cache = _interopRequire(_framptonCache);

  function cached(stream) {}
});
define('frampton-signals/dispatcher', ['exports', 'frampton-utils', 'frampton-list'], function (exports, _framptonUtils, _framptonList) {
  'use strict';

  exports.__esModule = true;

  /**
   * Dispatcher is a helper object that helps the a stream manage its Outlets. A
   * new instance of the Dispatcher is created for each new stream. The owning stream
   * inherits references to its dispatcher's subscribe, broadcast and clear methods.
   *
   * @name Dispatcher
   * @class
   * @private
   * @param  {EventStream} stream The EventStream that owns this instance of the dispatcher.
   * @returns {Dispatcher}   A new dispatcher.
   */
  function Dispatcher(stream) {

    var subscribers = [],
        sink = null;

    /**
     * Add Outlets to the owning stream.
     *
     * @name subscribe
     * @memberOf Dispatcher
     * @method
     * @instance
     * @param   {Function} fn - A callback for this stream
     * @returns {Function} A function to cancel the subscription.
     */
    this.subscribe = function Dispatcher_subscribe(fn) {

      subscribers.push(fn);

      if (subscribers.length === 1) {
        sink = stream.push.bind(stream);
        stream.cleanup = stream.seed(sink) || _framptonUtils.noop;
      }

      return function unsub() {
        subscribers = (0, _framptonList.remove)(subscribers, fn);
        if (subscribers.length === 0) {
          stream.cleanup();
          stream.cleanup = null;
        }
      };
    };

    /**
     * Handles notifying outlets of new data on the stream.
     *
     * @name push
     * @memberOf Dispatcher
     * @method
     * @instance
     * @param {Any} data The data to push to subscribers.
     */
    this.push = function Dispatcher_push(event) {
      subscribers.forEach(function (fn) {
        fn(event);
      });
    };

    /**
     * Used to burn it all down when this stream is destroyed.
     *
     * @name destroy
     * @memberOf Dispatcher
     * @method
     * @instance
     */
    this.destroy = function Dispatcher_destroy() {
      if (stream.cleanup) {
        stream.cleanup();
        stream.cleanup = null;
      }
      subscribers = null;
      sink = null;
      this.subscribe = null;
      this.push = null;
    };
  }

  var isDispatcher = function isDispatcher(obj) {
    return obj instanceof Dispatcher;
  };

  exports['default'] = Dispatcher;
  exports.isDispatcher = isDispatcher;
});
define('frampton-signals/empty', ['exports', 'module', 'frampton-signals/event_stream'], function (exports, module, _framptonSignalsEvent_stream) {
  'use strict';

  module.exports = empty_stream;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _EventStream = _interopRequire(_framptonSignalsEvent_stream);

  function empty_stream() {
    return new _EventStream(null, null);
  }
});
define('frampton-signals/event', ['exports', 'frampton-utils'], function (exports, _framptonUtils) {
  'use strict';

  exports.__esModule = true;

  /**
   * The value of a observable
   */
  function Event(value) {}

  Event.of = function (value) {
    return new Next(value);
  };

  Event.prototype.of = Event.of;

  Event.prototype.ap = _framptonUtils.notImplemented;

  Event.prototype.map = _framptonUtils.notImplemented;

  Event.prototype.recover = _framptonUtils.notImplemented;

  Event.prototype.filter = _framptonUtils.notImplemented;

  Event.prototype.get = function () {
    return this._value;
  };

  Event.prototype.isEmpty = function () {
    return false;
  };

  Event.prototype.isEnd = function () {
    return false;
  };

  Event.prototype.isNext = function () {
    return false;
  };

  Event.prototype.isError = function () {
    return false;
  };

  /**
   * @class Next
   * @extends Event
   */
  (0, _framptonUtils.inherits)(Next, Event);

  function Next(value) {
    this._value = value;
  }

  Next.prototype.map = function (fn) {
    return new Next(fn(this._value));
  };

  Next.prototype.recover = function (fn) {
    return new Next(this._value);
  };

  Next.prototype.filter = function (fn) {
    if (fn(this._value)) {
      return new Next(this._value);
    } else {
      return new Empty();
    }
  };

  Next.prototype.isNext = function () {
    return true;
  };

  function nextEvent(value) {
    return new Next(value);
  }

  /**
   * @class End
   * @extends Event
   */
  (0, _framptonUtils.inherits)(End, Event);

  function End(value) {
    this._value = value;
  }

  End.prototype.map = function () {
    return new End(this._value);
  };

  End.prototype.recover = function (fn) {
    return new End(this._value);
  };

  End.prototype.filter = function (fn) {
    if (fn(this._value)) {
      return new End(this._value);
    } else {
      return new Empty();
    }
  };

  End.prototype.isEnd = function () {
    return true;
  };

  function endEvent(value) {
    return new End(value || null);
  }

  /**
   * @class Error
   * @extends Event
   */
  (0, _framptonUtils.inherits)(Error, Event);

  function Error(msg) {
    (0, _framptonUtils.assert)('Error requires a message', (0, _framptonUtils.isString)(msg));
    this._message = msg;
  }

  Error.prototype.get = function () {
    return this._message;
  };

  Error.prototype.map = function () {
    return new Error(this._message);
  };

  Error.prototype.recover = function (fn) {
    return new Next(fn(this._message));
  };

  Error.prototype.filter = function () {
    return new Error(this._message);
  };

  Error.prototype.isError = function () {
    return true;
  };

  function errorEvent(msg) {
    return new Error(msg);
  }

  /**
   * @class Empty
   * @extends Event
   */
  (0, _framptonUtils.inherits)(Empty, Event);

  function Empty() {}

  Empty.prototype.get = function () {
    return null;
  };

  Empty.prototype.map = function () {
    return new Empty();
  };

  Empty.prototype.recover = function () {
    return new Empty();
  };

  Empty.prototype.filter = function () {
    return new Empty();
  };

  Empty.prototype.isEmpty = function () {
    return true;
  };

  function emptyEvent() {
    return new Empty();
  }

  exports.emptyEvent = emptyEvent;
  exports.errorEvent = errorEvent;
  exports.nextEvent = nextEvent;
  exports.endEvent = endEvent;
});
define('frampton-signals/event_stream', ['exports', 'frampton-utils', 'frampton-signals/event', 'frampton-signals/stepper', 'frampton-signals/dispatcher'], function (exports, _framptonUtils, _framptonSignalsEvent, _framptonSignalsStepper, _framptonSignalsDispatcher) {
  'use strict';

  exports.__esModule = true;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _stepper = _interopRequire(_framptonSignalsStepper);

  var _Dispatcher = _interopRequire(_framptonSignalsDispatcher);

  // Creates a new stream with a given transform.
  function withTransform(source, transform) {
    return new EventStream(function (sink) {
      return source.subscribe(function (event) {
        sink(event);
      });
    }, transform);
  }

  function fromMerge() {
    for (var _len = arguments.length, streams = Array(_len), _key = 0; _key < _len; _key++) {
      streams[_key] = arguments[_key];
    }

    var breakers = [];

    return new EventStream(function (sink) {

      streams.forEach(function (source) {
        breakers.push(source.subscribe(function (event) {
          sink(event);
        }));
      });

      return function merge_cleanup() {
        breakers.forEach(_framptonUtils.apply);
        breakers = null;
        streams = null;
      };
    });
  }

  function EventStream(seed, transform) {
    this._id = (0, _framptonUtils.guid)();
    this.seed = seed || _framptonUtils.noop;
    this.transform = transform || _framptonUtils.identity;
    this.dispatcher = new _Dispatcher(this);
    this.cleanup = null;
    this.isClosed = false;
  }

  /**
   * @name push
   * @memberOf EventStream
   */
  EventStream.prototype.push = function EventStream_push(event) {
    try {
      if (!this.isClosed) {
        this.dispatcher.push(this.transform(event));
      }
    } catch (e) {
      (0, _framptonUtils.log)('error: ', e);
      this.dispatcher.push((0, _framptonSignalsEvent.errorEvent)(e.message));
    }
  };

  // Gets raw event, including empty events discarded by filter actions
  EventStream.prototype.subscribe = function EventStream_subscribe(fn) {
    return this.dispatcher.subscribe(fn);
  };

  // Gets next value
  EventStream.prototype.next = function EventStream_next(fn) {
    return this.subscribe(function (event) {
      if (event.isNext()) {
        fn(event.get());
      }
    });
  };

  // Gets next error
  EventStream.prototype.error = function EventStream_error(fn) {
    return this.subscribe(function (event) {
      if (event.isError()) {
        fn(event.get());
      }
    });
  };

  // Get done event
  EventStream.prototype.done = function EventStream_done(fn) {
    return this.subscribe(function (event) {
      if (event.isEnd()) {
        fn(event.get());
      }
    });
  };

  /**
   * @name close
   * @memberOf EventStream
   */
  EventStream.prototype.close = function EventStream_close() {
    if (!this.isClosed) {
      this.push((0, _framptonSignalsEvent.endEvent)());
      this.isClosed = true;
      this.dispatcher.destroy();
      this.dispatcher = null;
    }
  };

  // join :: EventStream ( EventStream a ) -> EventStream a
  EventStream.prototype.join = function EventStream_join() {

    var source = this;
    var breakers = [];

    return new EventStream(function (sink) {

      breakers.push(source.subscribe(function (event) {
        if (event.isNext()) {
          breakers.push(event.get().subscribe(function (event) {
            sink(event);
          }));
        } else {
          sink(event);
        }
      }));

      return function chain_cleanup() {
        breakers.forEach(_framptonUtils.apply);
        breakers = null;
        source = null;
      };
    });
  };

  // chain(>>=) :: EventStream a -> (a -> EventStream b) -> EventStream b
  EventStream.prototype.chain = function EventStream_chain(fn) {
    return this.map(fn).join();
  };

  // chainLatest :: EventStream a -> (a -> EventStream b) -> EventStream b
  EventStream.prototype.chainLatest = function EventStream_chainLatest(fn) {

    var source = this;
    var innerStream = null;
    var breakers = [];

    return new EventStream(function (sink) {

      breakers.push(source.subscribe(function (event) {

        if (event.isNext()) {

          if (innerStream) {
            innerStream.close();
            innerStream = null;
          }

          innerStream = fn(event.get());
          innerStream.subscribe(function (event) {
            sink(event);
          });
        } else {
          sink(event);
        }
      }));

      return function chainLatest_cleanup() {
        if (innerStream) {
          innerStream.close();
          innerStream = null;
        }
        breakers.forEach(_framptonUtils.apply);
        breakers = null;
        source = null;
      };
    });
  };

  // ap(<*>) :: EventStream (a -> b) -> EventStream a -> EventStream b
  EventStream.prototype.ap = function EventStream_ap(stream) {

    var source = this;
    var breakers = [];

    return new EventStream(function (sink) {

      var fn = _framptonUtils.identity;

      breakers.push(source.subscribe(function (event) {
        if (event.isNext()) {
          fn = event.get();
        }
      }));

      breakers.push(stream.subscribe(function (event) {
        if (event.isNext()) {
          sink((0, _framptonSignalsEvent.nextEvent)(fn(event.get())));
        } else {
          sink(event);
        }
      }));

      return function ap_cleanup() {
        breakers.forEach(_framptonUtils.apply);
        breakers = null;
        source = null;
      };
    });
  };

  // map :: EventStream a -> (a -> b) -> EventStream b
  EventStream.prototype.map = function EventStream_map(mapping) {
    var mappingFn = (0, _framptonUtils.isFunction)(mapping) ? mapping : (0, _framptonUtils.ofValue)(mapping);
    return withTransform(this, function (event) {
      return event.map(mappingFn);
    });
  };

  // recover :: EventStream a -> (err -> a) -> EventStream a
  EventStream.prototype.recover = function EventStream_recover(mapping) {
    var mappingFn = (0, _framptonUtils.isFunction)(mapping) ? mapping : (0, _framptonUtils.ofValue)(mapping);
    return withTransform(this, function (event) {
      return event.recover(mappingFn);
    });
  };

  // filter :: EventStream a -> (a -> Bool) -> EventStream a
  EventStream.prototype.filter = function EventStream_filter(predicate) {
    var filterFn = (0, _framptonUtils.isFunction)(predicate) ? predicate : (0, _framptonUtils.isEqual)(predicate);
    return withTransform(this, function (event) {
      return event.filter(filterFn);
    });
  };

  // scan :: EventStream a -> (a -> b) -> Behavior b
  EventStream.prototype.scan = function (initial, fn) {
    return (0, _stepper)(initial, this.map(fn));
  };

  // sample :: EventStream a -> Behavior b -> EventStream b
  EventStream.prototype.sample = function (behavior) {
    var source = this;
    var breakers = [];
    return new EventStream(function (sink) {
      breakers.push(source.subscribe(function (event) {
        if (event.isNext()) {
          sink((0, _framptonSignalsEvent.nextEvent)(behavior.value));
        } else {
          sink(event);
        }
      }));
      return function sample_cleanup() {
        breakers.forEach(_framptonUtils.apply);
        breakers = null;
        source = null;
      };
    });
  };

  // fold :: EventStream a -> (a -> s -> s) -> s -> EventStream s
  EventStream.prototype.fold = function (fn, acc) {
    console.log('acc 1: ', acc);
    return withTransform(this, function (event) {
      acc = (0, _framptonUtils.isUndefined)(acc) ? event.get() : fn(acc, event.get());
      return (0, _framptonSignalsEvent.nextEvent)(acc);
    });
  };

  // take :: EventStream a -> Number n -> EventStream a
  EventStream.prototype.take = function (limit) {

    var source = this;
    var breaker = null;

    return new EventStream(function (sink) {

      var stream = this;

      breaker = source.subscribe(function (event) {
        if (event.isNext()) {
          if (limit > 0) {
            limit = limit - 1;
            sink(event);
          } else {
            stream.close();
          }
        } else {
          sink(event);
        }
      });

      return function take_cleanup() {
        breaker();
        breaker = null;
        source = null;
      };
    });
  };

  /**
   * Merges a stream with the current stream and returns a new stream
   *
   * @name merge
   * @method
   * @memberOf EventStream
   * @instance
   * @param {Object} stream - stream to merge with current stream
   * @returns {EventStream} A new EventStream
   */
  EventStream.prototype.merge = function Stream_merge(stream) {
    return fromMerge(this, stream);
  };

  /**
   * zip :: EventStream a -> Behavior b -> EventStream [a,b]
   *
   * @name zip
   * @method
   * @memberOf EventStream
   * @instance
   * @param {Behavior} behavipr - The EventStream to zip with the current EventStream.
   * @returns {EventStream} A new EventStream.
   */
  EventStream.prototype.zip = function Stream_zip(behavior) {

    var source = this;
    var breakers = [];

    return new EventStream(function (sink) {

      breakers.push(source.subscribe(function (event) {
        if (event.isNext()) {
          sink((0, _framptonSignalsEvent.nextEvent)([event.get(), behavior.value]));
        } else {
          sink(event);
        }
      }));

      return function break_zip() {
        breakers.forEach(_framptonUtils.apply);
        breakers = null;
        source = null;
      };
    });
  };

  // debounce :: EventStream a -> Number -> EventStream a
  EventStream.prototype.debounce = function EventStream_debounce(delay) {

    var source = this;
    var timerId = null;
    var saved = null;
    var breakers = [];

    return new EventStream(function (sink) {

      breakers.push(source.subscribe(function (event) {
        if (event.isNext()) {
          saved = event.get();

          if (timerId) {
            clearTimeout(timerId);
          }

          timerId = setTimeout(function () {
            sink((0, _framptonSignalsEvent.nextEvent)(saved));
            saved = null;
            timerId = null;
          }, delay);
        } else {
          sink(event);
        }
      }));

      return function debounce_cleanup() {
        if (timerId) {
          clearTimeout(timerId);
          timerId = null;
        }
        breakers.forEach(_framptonUtils.apply);
        breakers = null;
        saved = null;
        source = null;
      };
    });
  };

  /**
   * throttle :: EventStream a -> Number -> EventStream a
   *
   * @name throttle
   * @method
   * @memberOf EventStream
   * @instance
   * @param {Number} delay - Time (milliseconds) to delay each update on the stream.
   * @returns {EventStream} A new Stream with the delay applied.
   */
  EventStream.prototype.throttle = function EventStream_throttle(delay) {

    var source = this;
    var timer = null;
    var saved = null;
    var breakers = [];

    return new EventStream(function (sink) {

      function applyTimeout() {

        return setTimeout(function () {

          timer = null;

          if (saved) {
            sink((0, _framptonSignalsEvent.nextEvent)(saved));
            saved = null;
          }
        }, delay);
      }

      breakers.push(source.subscribe(function (event) {

        if (event.isNext()) {
          saved = event.get();
          timer = timer !== null ? timer : applyTimeout();
        } else {
          sink(event);
        }
      }));

      return function throttle_cleanup() {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        breakers.forEach(_framptonUtils.apply);
        breakers = null;
        saved = null;
        source = null;
      };
    });
  };

  // dropRepeats :: EventStream a -> EventStream a
  EventStream.prototype.dropRepeats = function EventStream_dropRepeats() {
    var prevVal = null;
    return this.filter(function (val) {
      if (val !== prevVal) {
        prevVal = val;
        return true;
      }
      return false;
    });
  };

  // and :: EventStream a -> Behavior b -> EventStream a
  EventStream.prototype.and = function (behavior) {

    var source = this;
    var breakers = [];

    return new EventStream(function (sink) {

      breakers.push(source.subscribe(function (event) {

        if (event.isNext()) {
          if (behavior.value) {
            sink(event);
          }
        } else {
          sink(event);
        }
      }));

      return function and_cleanup() {
        breakers.forEach(_framptonUtils.apply);
        breakers = null;
        source = null;
      };
    });
  };

  // not :: EventStream a -> Behavior b -> EventStream a
  EventStream.prototype.not = function (behavior) {

    var source = this;
    var breakers = [];

    return new EventStream(function (sink) {

      breakers.push(source.subscribe(function (event) {

        if (event.isNext()) {
          if (!behavior.value) {
            sink(event);
          }
        } else {
          sink(event);
        }
      }));

      return function not_cleanup() {
        breakers.forEach(_framptonUtils.apply);
        breakers = null;
        source = null;
      };
    });
  };

  EventStream.prototype.log = function EventStream_log() {
    return withTransform(this, function (event) {
      (0, _framptonUtils.log)(event.get());
      return event;
    });
  };

  var isEventStream = function isEventStream(obj) {
    return obj instanceof EventStream;
  };

  exports['default'] = EventStream;
  exports.merge = fromMerge;
  exports.isEventStream = isEventStream;
});
define('frampton-signals/interval', ['exports', 'module', 'frampton-signals/event_stream', 'frampton-signals/event'], function (exports, module, _framptonSignalsEvent_stream, _framptonSignalsEvent) {
  'use strict';

  // interval :: EventStream Number
  module.exports = interval;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _EventStream = _interopRequire(_framptonSignalsEvent_stream);

  function interval() {
    return new _EventStream(function (sink) {

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
      };
    });
  }
});
define('frampton-signals/listen', ['exports', 'module', 'frampton-utils', 'frampton-signals/event_stream', 'frampton-signals/event', 'frampton-events'], function (exports, module, _framptonUtils, _framptonSignalsEvent_stream, _framptonSignalsEvent, _framptonEvents) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _EventStream = _interopRequire(_framptonSignalsEvent_stream);

  // listen :: String -> Dom -> EventStream Event
  module.exports = (0, _framptonUtils.curry)(function listen(eventName, target) {
    return new _EventStream(function (sink) {
      return (0, _framptonEvents.addListener)(eventName, function (evt) {
        return sink((0, _framptonSignalsEvent.nextEvent)(evt));
      }, target);
    });
  });
});
define('frampton-signals/null', ['exports', 'module', 'frampton-signals/event_stream'], function (exports, module, _framptonSignalsEvent_stream) {
  'use strict';

  module.exports = null_stream;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _EventStream = _interopRequire(_framptonSignalsEvent_stream);

  var instance = null;

  function null_stream() {
    return instance !== null ? instance : instance = new _EventStream(null, null);
  }
});
define('frampton-signals/send', ['exports', 'module', 'frampton-utils', 'frampton-signals/event'], function (exports, module, _framptonUtils, _framptonSignalsEvent) {
  'use strict';

  // send :: EventStream a -> EventStream b -> Task [a, b] -> ()
  module.exports = (0, _framptonUtils.curry)(function send(errors, values, task) {
    task.run(function (err) {
      return errors.push((0, _framptonSignalsEvent.nextEvent)(err));
    }, function (val) {
      return values.push((0, _framptonSignalsEvent.nextEvent)(val));
    });
  });
});
define('frampton-signals/sequential', ['exports', 'module', 'frampton-utils', 'frampton-list', 'frampton-signals/event_stream', 'frampton-signals/event'], function (exports, module, _framptonUtils, _framptonList, _framptonSignalsEvent_stream, _framptonSignalsEvent) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _EventStream = _interopRequire(_framptonSignalsEvent_stream);

  /**
   * Creates a new stream that sequentially emits the values of the given
   * array with the provided delay between each value.
   * @name sequential
   * @param {Number} delay Millisecond delay
   * @param {Array}  arr   Array of values
   * @returns {EventStream} A new EventStream
   */
  module.exports = (0, _framptonUtils.curry)(function sequential(delay, arr) {
    return new _EventStream(function (sink) {

      var stream = this;
      var isStopped = false;
      var timerId = null;

      function step(arr) {
        timerId = setTimeout(function () {
          sink((0, _framptonSignalsEvent.nextEvent)(arr[0]));
          timerId = null;
          if (arr.length > 1 && !isStopped) {
            step((0, _framptonList.drop)(1, arr));
          } else {
            stream.close();
          }
        }, delay);
      }

      step(arr);

      return function sequential_destroy() {
        if (timerId) {
          clearTimeout(timerId);
          timerId = null;
        }
        isStopped = true;
        stream = null;
        arr = null;
      };
    });
  });
});
define('frampton-signals/stepper', ['exports', 'module', 'frampton-utils', 'frampton-signals/behavior'], function (exports, module, _framptonUtils, _framptonSignalsBehavior) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Behavior = _interopRequire(_framptonSignalsBehavior);

  // stepper :: a -> EventStream a -> Behavior a
  module.exports = (0, _framptonUtils.curry)(function stepper(initial, stream) {
    return new _Behavior(initial, function (sink) {
      return stream.next(function (val) {
        sink(val);
      });
    });
  });
});
define('frampton-utils', ['exports', 'frampton-utils/compose', 'frampton-utils/curry', 'frampton-utils/extend', 'frampton-utils/guid', 'frampton-utils/inherits', 'frampton-utils/identity', 'frampton-utils/is_array', 'frampton-utils/is_defined', 'frampton-utils/is_equal', 'frampton-utils/is_nothing', 'frampton-utils/is_something', 'frampton-utils/is_null', 'frampton-utils/is_object', 'frampton-utils/is_string', 'frampton-utils/is_undefined', 'frampton-utils/is_boolean', 'frampton-utils/is_function', 'frampton-utils/is_promise', 'frampton-utils/noop', 'frampton-utils/assert', 'frampton-utils/log', 'frampton-utils/lazy', 'frampton-utils/apply', 'frampton-utils/get', 'frampton-utils/of_value'], function (exports, _framptonUtilsCompose, _framptonUtilsCurry, _framptonUtilsExtend, _framptonUtilsGuid, _framptonUtilsInherits, _framptonUtilsIdentity, _framptonUtilsIs_array, _framptonUtilsIs_defined, _framptonUtilsIs_equal, _framptonUtilsIs_nothing, _framptonUtilsIs_something, _framptonUtilsIs_null, _framptonUtilsIs_object, _framptonUtilsIs_string, _framptonUtilsIs_undefined, _framptonUtilsIs_boolean, _framptonUtilsIs_function, _framptonUtilsIs_promise, _framptonUtilsNoop, _framptonUtilsAssert, _framptonUtilsLog, _framptonUtilsLazy, _framptonUtilsApply, _framptonUtilsGet, _framptonUtilsOf_value) {
  'use strict';

  exports.__esModule = true;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _compose = _interopRequire(_framptonUtilsCompose);

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _extend = _interopRequire(_framptonUtilsExtend);

  var _guid = _interopRequire(_framptonUtilsGuid);

  var _inherits = _interopRequire(_framptonUtilsInherits);

  var _identity = _interopRequire(_framptonUtilsIdentity);

  var _isArray = _interopRequire(_framptonUtilsIs_array);

  var _isDefined = _interopRequire(_framptonUtilsIs_defined);

  var _isEqual = _interopRequire(_framptonUtilsIs_equal);

  var _isNothing = _interopRequire(_framptonUtilsIs_nothing);

  var _isSomething = _interopRequire(_framptonUtilsIs_something);

  var _isNull = _interopRequire(_framptonUtilsIs_null);

  var _isObject = _interopRequire(_framptonUtilsIs_object);

  var _isString = _interopRequire(_framptonUtilsIs_string);

  var _isUndefined = _interopRequire(_framptonUtilsIs_undefined);

  var _isBoolean = _interopRequire(_framptonUtilsIs_boolean);

  var _isFunction = _interopRequire(_framptonUtilsIs_function);

  var _isPromise = _interopRequire(_framptonUtilsIs_promise);

  var _noop = _interopRequire(_framptonUtilsNoop);

  var _assert = _interopRequire(_framptonUtilsAssert);

  var _log = _interopRequire(_framptonUtilsLog);

  var _lazy = _interopRequire(_framptonUtilsLazy);

  var _apply = _interopRequire(_framptonUtilsApply);

  var _get = _interopRequire(_framptonUtilsGet);

  var _ofValue = _interopRequire(_framptonUtilsOf_value);

  exports.compose = _compose;
  exports.curry = _curry;
  exports.extend = _extend;
  exports.guid = _guid;
  exports.inherits = _inherits;
  exports.identity = _identity;
  exports.isArray = _isArray;
  exports.isDefined = _isDefined;
  exports.isEqual = _isEqual;
  exports.isNothing = _isNothing;
  exports.isSomething = _isSomething;
  exports.isNull = _isNull;
  exports.isObject = _isObject;
  exports.isString = _isString;
  exports.isUndefined = _isUndefined;
  exports.isBoolean = _isBoolean;
  exports.isFunction = _isFunction;
  exports.isPromise = _isPromise;
  exports.noop = _noop;
  exports.assert = _assert;
  exports.log = _log;
  exports.lazy = _lazy;
  exports.apply = _apply;
  exports.get = _get;
  exports.ofValue = _ofValue;
});
define("frampton-utils/apply", ["exports", "module"], function (exports, module) {
  /**
   * Takes a function and warps it to be called at a later time.
   * @name apply
   * @memberOf Frampton
   * @method
   * @static
   * @param {Function} fn      The function to wrap.
   * @param {Object}   thisArg Context in which to apply function.
   */
  "use strict";

  module.exports = apply;

  function apply(fn, thisArg) {
    return fn.call(thisArg || null);
  }
});
define('frampton-utils/assert', ['exports', 'module'], function (exports, module) {
  /**
   * Occassionally we need to blow things up if something isn't right.
   * @name assert
   * @param {String} msg  - Message to throw with error.
   * @param {Any}    cond - A condition that evaluates to a Boolean. If false, an error is thrown.
   */
  'use strict';

  module.exports = assert;

  function assert(msg, cond) {
    if (!cond) {
      throw new Error(msg || 'An error occured'); // Boom!
    }
  }
});
define('frampton-utils/compose', ['exports', 'module', 'frampton-utils/assert', 'frampton-list/copy', 'frampton-list/foldr', 'frampton-list/head'], function (exports, module, _framptonUtilsAssert, _framptonListCopy, _framptonListFoldr, _framptonListHead) {
  'use strict';

  /**
   * Compose takes any number of functions and returns a function that when
   * executed will call the passed functions in order, passing the return of
   * each function to the next function in the execution order.
   *
   * @name compose
   * @memberOf Frampton
   * @static
   * @param {Function} functions - Any number of function used to build the composition.
   */
  module.exports = compose;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _assert = _interopRequire(_framptonUtilsAssert);

  var _copy = _interopRequire(_framptonListCopy);

  var _foldr = _interopRequire(_framptonListFoldr);

  var _head = _interopRequire(_framptonListHead);

  function compose() {
    var fns = (0, _copy)(arguments);
    (0, _assert)('Compose did not receive any arguments. You can\'t compose nothing. Stoopid.', fns.length > 0);
    return function composition() {
      return (0, _head)((0, _foldr)(function (args, fn) {
        return [fn.apply(this, args)];
      }, (0, _copy)(arguments), fns));
    };
  }
});
/* functions */
define('frampton-utils/curry', ['exports', 'module', 'frampton-utils/assert', 'frampton-utils/is_function'], function (exports, module, _framptonUtilsAssert, _framptonUtilsIs_function) {
  'use strict';

  /**
   * Takes a function and returns a new function that will wait to execute the original
   * function until it has received all of its arguments. Each time the function is called
   * without receiving all of its arguments it will return a new function waiting for the
   * remaining arguments.
   *
   * @name curry
   * @memberOf Frampton
   * @static
   * @param {Function} curry - Function to curry.
   */
  module.exports = curry;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _assert = _interopRequire(_framptonUtilsAssert);

  var _isFunction = _interopRequire(_framptonUtilsIs_function);

  function curry(fn) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    (0, _assert)('Argument passed to curry is not a function', (0, _isFunction)(fn));

    var arity = fn.length;

    function curried() {
      for (var _len2 = arguments.length, args2 = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args2[_key2] = arguments[_key2];
      }

      // an array of arguments for this instance of the curried function
      var locals = args;

      if (arguments.length > 0) {
        locals = locals.concat(args2);
      }

      if (locals.length >= arity) {
        return fn.apply(null, locals);
      } else {
        return curry.apply(null, [fn].concat(locals));
      }
    }

    return args.length >= arity ? curried() : curried;
  }
});
define('frampton-utils/extend', ['exports', 'module', 'frampton-list/foldl'], function (exports, module, _framptonListFoldl) {
  'use strict';

  module.exports = extend;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _foldl = _interopRequire(_framptonListFoldl);

  function extend(base) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return (0, _foldl)(function (acc, next) {
      var key;
      for (key in next) {
        acc[key] = next[key];
      }
      return acc;
    }, base, args);
  }
});
define('frampton-utils/get', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  //+ get :: String -> Object -> Any
  module.exports = (0, _curry)(function (prop, obj) {
    return obj[prop] || null;
  });
});
define("frampton-utils/guid", ["exports", "module"], function (exports, module) {
  "use strict";

  module.exports = guid;
  var id = 0;

  function guid() {
    return id++;
  }
});
define("frampton-utils/identity", ["exports", "module"], function (exports, module) {
  "use strict";

  module.exports = identity;

  function identity(x) {
    return x;
  }
});
define("frampton-utils/inherits", ["exports", "module"], function (exports, module) {
  /**
   * Similar to class extension in other languages. The child recieves all the
   * static and prototype methods/properties of the parent object.
   */
  "use strict";

  module.exports = inherits;

  function inherits(child, parent) {

    for (var key in parent) {
      if (parent.hasOwnProperty(key)) {
        child[key] = parent[key];
      }
    }

    function Class() {
      this.constructor = child;
    }

    Class.prototype = parent.prototype;
    child.prototype = new Class();
    child.__super__ = parent.prototype;

    return child;
  }
});
define("frampton-utils/is_array", ["exports", "module"], function (exports, module) {
  "use strict";

  module.exports = isArray;

  function isArray(arr) {
    return Object.prototype.toString.call(arr) === "[object Array]";
  }
});
define('frampton-utils/is_boolean', ['exports', 'module'], function (exports, module) {
  'use strict';

  module.exports = isBoolean;

  function isBoolean(obj) {
    return typeof obj === 'boolean';
  }
});
define('frampton-utils/is_defined', ['exports', 'module', 'frampton-utils/is_undefined'], function (exports, module, _framptonUtilsIs_undefined) {
  'use strict';

  module.exports = isDefined;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isUndefined = _interopRequire(_framptonUtilsIs_undefined);

  function isDefined(obj) {
    return !(0, _isUndefined)(obj);
  }
});
define('frampton-utils/is_equal', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  module.exports = (0, _curry)(function is_equal(a, b) {
    return a === b;
  });
});
define('frampton-utils/is_function', ['exports', 'module'], function (exports, module) {
  'use strict';

  module.exports = isFunction;

  function isFunction(fn) {
    return typeof fn === 'function';
  }
});
define('frampton-utils/is_nothing', ['exports', 'module', 'frampton-utils/is_undefined', 'frampton-utils/is_null'], function (exports, module, _framptonUtilsIs_undefined, _framptonUtilsIs_null) {
  'use strict';

  module.exports = isNothing;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isUndefined = _interopRequire(_framptonUtilsIs_undefined);

  var _isNull = _interopRequire(_framptonUtilsIs_null);

  function isNothing(obj) {
    return (0, _isUndefined)(obj) || (0, _isNull)(obj);
  }
});
define("frampton-utils/is_null", ["exports", "module"], function (exports, module) {
  "use strict";

  module.exports = isNull;

  function isNull(obj) {
    return obj === null;
  }
});
define('frampton-utils/is_object', ['exports', 'module', 'frampton-utils/is_something', 'frampton-utils/is_array'], function (exports, module, _framptonUtilsIs_something, _framptonUtilsIs_array) {
  'use strict';

  module.exports = isObject;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isSomething = _interopRequire(_framptonUtilsIs_something);

  var _isArray = _interopRequire(_framptonUtilsIs_array);

  function isObject(obj) {
    return (0, _isSomething)(obj) && !(0, _isArray)(obj) && typeof obj === 'object';
  }
});
define('frampton-utils/is_promise', ['exports', 'module', 'frampton-utils/is_object', 'frampton-utils/is_function'], function (exports, module, _framptonUtilsIs_object, _framptonUtilsIs_function) {
  'use strict';

  module.exports = isPromise;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isObject = _interopRequire(_framptonUtilsIs_object);

  var _isFunction = _interopRequire(_framptonUtilsIs_function);

  function isPromise(promise) {
    return (0, _isObject)(promise) && (0, _isFunction)(promise.then);
  }
});
define('frampton-utils/is_something', ['exports', 'module', 'frampton-utils/is_nothing'], function (exports, module, _framptonUtilsIs_nothing) {
  'use strict';

  module.exports = isSomething;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isNothing = _interopRequire(_framptonUtilsIs_nothing);

  function isSomething(obj) {
    return !(0, _isNothing)(obj);
  }
});
define('frampton-utils/is_string', ['exports', 'module'], function (exports, module) {
  'use strict';

  module.exports = isString;

  function isString(obj) {
    return typeof obj === 'string';
  }
});
define('frampton-utils/is_undefined', ['exports', 'module'], function (exports, module) {
  'use strict';

  module.exports = isUndefined;

  function isUndefined(obj) {
    return typeof obj === 'undefined';
  }
});
define("frampton-utils/lazy", ["exports", "module"], function (exports, module) {
  /**
   * Takes a function and warps it to be called at a later time.
   * @name lazy
   * @memberOf Frampton
   * @method
   * @static
   * @param {Function} fn The function to wrap.
   * @param {...Any} args Arguments to pass to the function when called.
   */
  "use strict";

  module.exports = lazy;

  function lazy(fn) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return function () {
      fn.apply(null, args);
    };
  }
});
define('frampton-utils/log', ['exports', 'module', 'frampton'], function (exports, module, _frampton) {
  'use strict';

  module.exports = log;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Frampton = _interopRequire(_frampton);

  function log(msg, data) {

    if (typeof console.log !== 'undefined' && _Frampton.isDev()) {
      if (data) {
        console.log(msg, data);
      } else {
        console.log(msg);
      }
    }

    return msg;
  }
});
define("frampton-utils/noop", ["exports", "module"], function (exports, module) {
  "use strict";

  module.exports = noop;

  function noop() {}
});
define('frampton-utils/not_implemented', ['exports', 'module'], function (exports, module) {
  'use strict';

  module.exports = function () {
    throw new Error('This method has not been implemented');
  };
});
define("frampton-utils/of_value", ["exports", "module"], function (exports, module) {
  "use strict";

  module.exports = of_value;

  function of_value(value) {
    return function () {
      return value;
    };
  }
});
define('frampton-window', ['exports', 'module', 'frampton-signals', 'frampton-utils/is_something'], function (exports, module, _framptonSignals, _framptonUtilsIs_something) {
  'use strict';

  module.exports = Window;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isSomething = _interopRequire(_framptonUtilsIs_something);

  var element = null;
  var resize = (0, _framptonSignals.listen)('resize', window);
  var dimensionsStream = (0, _framptonSignals.empty)();
  var dimensions = (0, _framptonSignals.stepper)([getWidth(), getHeight()], dimensionsStream);

  function getWidth() {
    return (0, _isSomething)(element) ? element.clientWidth : window.innerWidth;
  }

  function getHeight() {
    return (0, _isSomething)(element) ? element.clientHeight : window.innerHeight;
  }

  function updateIfNeeded() {
    var w = getWidth();
    var h = getHeight();
    if (w !== dimensions[0] || h !== dimensions[1]) {
      dimensionsStream.push((0, _framptonSignals.nextEvent)([w, h]));
    }
  }

  function update() {
    updateIfNeeded();
    setTimeout(updateIfNeeded, 0);
  }

  resize.next(update);

  function Window(element) {
    element = element;
    return {
      dimensions: dimensions
    };
  }
});
define('frampton', ['exports', 'module', 'frampton/namespace'], function (exports, module, _framptonNamespace) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Frampton = _interopRequire(_framptonNamespace);

  module.exports = _Frampton;
});
define('frampton/namespace', ['exports', 'module'], function (exports, module) {
  'use strict';

  if (typeof Frampton === 'undefined') {
    var Frampton = {};
  }

  Frampton.VERSION = '0.0.3';

  Frampton.TEST = 'test';

  Frampton.DEV = 'dev';

  Frampton.PROD = 'prod';

  if (typeof Frampton.ENV === 'undefined') {
    Frampton.ENV = {
      MODE: Frampton.PROD
    };
  }

  Frampton.isDev = function () {
    return Frampton.ENV.MODE === Frampton.DEV;
  };

  Frampton.isTest = function () {
    return Frampton.ENV.MODE === Frampton.TEST;
  };

  Frampton.isProd = function () {
    return Frampton.ENV.MODE === Frampton.PROD;
  };

  module.exports = Frampton;
});
define("frampton/runtime", ["exports"], function (exports) {
  "use strict";
});
require("frampton");

})();