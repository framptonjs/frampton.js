(function() {
/*globals Frampton:true */
var define, require;
var global = this;

/**

This loader code is taken from the guys over at Ember
https://github.com/emberjs/ember.js/

Copyright (c) 2015 Yehuda Katz, Tom Dale and Ember.js contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/
(function() {

  if (typeof Frampton === 'undefined') {
    Frampton = {};
  };

  if (typeof Frampton.__loader === 'undefined') {

    var registry = {};
    var seen = {};

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

    require = function(name) {
      return internalRequire(name, null);
    };

    function internalRequire(name, referrerName) {

      var exports = seen[name];
      var module = {};

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

      var mod = registry[name];
      var deps = mod.deps;
      var callback = mod.callback;
      var reified = [];
      var len = deps.length;
      var i = 0;

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

      var parts = child.split('/');
      var parentBase = name.split('/').slice(0, -1);
      var len = parts.length;
      var i = 0;

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

define('frampton-data', ['exports', 'frampton/namespace', 'frampton-data/task/create', 'frampton-data/task/fail', 'frampton-data/task/never', 'frampton-data/task/sequence', 'frampton-data/task/succeed', 'frampton-data/task/when', 'frampton-data/task/execute', 'frampton-data/union/create', 'frampton-data/record/create'], function (exports, _framptonNamespace, _framptonDataTaskCreate, _framptonDataTaskFail, _framptonDataTaskNever, _framptonDataTaskSequence, _framptonDataTaskSucceed, _framptonDataTaskWhen, _framptonDataTaskExecute, _framptonDataUnionCreate, _framptonDataRecordCreate) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _Frampton = _interopRequireDefault(_framptonNamespace);

  var _createTask = _interopRequireDefault(_framptonDataTaskCreate);

  var _fail = _interopRequireDefault(_framptonDataTaskFail);

  var _never = _interopRequireDefault(_framptonDataTaskNever);

  var _sequence = _interopRequireDefault(_framptonDataTaskSequence);

  var _succeed = _interopRequireDefault(_framptonDataTaskSucceed);

  var _when = _interopRequireDefault(_framptonDataTaskWhen);

  var _execute = _interopRequireDefault(_framptonDataTaskExecute);

  var _createUnion = _interopRequireDefault(_framptonDataUnionCreate);

  var _createRecord = _interopRequireDefault(_framptonDataRecordCreate);

  /**
   * @name Data
   * @namespace
   * @memberof Frampton
   */
  _Frampton['default'].Data = {};

  /**
   * @name Task
   * @memberof Frampton.Data
   * @class A data type for wrapping impure computations
   * @constructor Should not be called by the user.
   */
  _Frampton['default'].Data.Task = {};
  _Frampton['default'].Data.Task.create = _createTask['default'];
  _Frampton['default'].Data.Task.fail = _fail['default'];
  _Frampton['default'].Data.Task.succeed = _succeed['default'];
  _Frampton['default'].Data.Task.never = _never['default'];
  _Frampton['default'].Data.Task.sequence = _sequence['default'];
  _Frampton['default'].Data.Task.when = _when['default'];
  _Frampton['default'].Data.Task.execute = _execute['default'];

  /**
   * @name Union
   * @memberof Frampton.Data
   * @class
   */
  _Frampton['default'].Data.Union = {};
  _Frampton['default'].Data.Union.create = _createUnion['default'];

  /**
   * @name Record
   * @memberof Frampton.Data
   * @class
   */
  _Frampton['default'].Data.Record = {};
  _Frampton['default'].Data.Record.create = _createRecord['default'];
});
define('frampton-data/record/create', ['exports', 'module', 'frampton/namespace', 'frampton-utils/guid', 'frampton-utils/warn', 'frampton-utils/is_object', 'frampton-record/merge', 'frampton-record/keys'], function (exports, module, _framptonNamespace, _framptonUtilsGuid, _framptonUtilsWarn, _framptonUtilsIs_object, _framptonRecordMerge, _framptonRecordKeys) {
  'use strict';

  module.exports = create_record;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _Frampton = _interopRequireDefault(_framptonNamespace);

  var _guid = _interopRequireDefault(_framptonUtilsGuid);

  var _warn = _interopRequireDefault(_framptonUtilsWarn);

  var _isObject = _interopRequireDefault(_framptonUtilsIs_object);

  var _merge = _interopRequireDefault(_framptonRecordMerge);

  var _keys = _interopRequireDefault(_framptonRecordKeys);

  var blacklist = ['_id', '_props', 'ctor', 'keys', 'get', 'set', 'update', 'data'];

  function validateData(props, data) {
    if (!_Frampton['default'].isProd()) {
      for (var prop in data) {
        if (props.indexOf(prop) === -1) {
          throw new TypeError('Frampton.Data.Record received unknown key: ' + prop);
        }
      }
    }
  }

  function create_record(data, id, props) {

    var _id = id || _guid['default']();
    var _props = props || _keys['default'](data);

    var model = {};
    model.ctor = 'Frampton.Data.Record';

    /**
     * @name data
     * @memberof Frampton.Data.Record
     * @returns {Object}
     */
    model.data = function () {
      return Object.freeze(data);
    };

    /**
     * @name update
     * @memberof Frampton.Data.Record
     * @param {Object} update
     * @returns {Object}
     */
    model.update = function (update) {
      if (_isObject['default'](update)) {
        return create_record(_merge['default'](data, update), _id, _props);
      } else {
        _warn['default']('Frampton.Data.Record.update did not receive an object');
      }
    };

    // private
    model._id = _id;
    model._props = _props;

    // public
    for (var i = 0; i < _props.length; i++) {
      var key = _props[i];
      var value = data[key];
      if (blacklist.indexOf(key) === -1) {
        model[key] = value;
      } else {
        _warn['default']('Frampton.Data.Record received a protected key: ' + key);
      }
    }

    // In dev mode verify object properties
    validateData(_props, data);

    return Object.freeze(model);
  }
});
define('frampton-data/task/create', ['exports', 'module', 'frampton-utils/immediate', 'frampton-utils/is_function', 'frampton-utils/noop', 'frampton-utils/of_value', 'frampton-utils/is_equal', 'frampton-data/task/valid_sinks'], function (exports, module, _framptonUtilsImmediate, _framptonUtilsIs_function, _framptonUtilsNoop, _framptonUtilsOf_value, _framptonUtilsIs_equal, _framptonDataTaskValid_sinks) {
  'use strict';

  module.exports = create_task;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _immediate = _interopRequireDefault(_framptonUtilsImmediate);

  var _isFunction = _interopRequireDefault(_framptonUtilsIs_function);

  var _noop = _interopRequireDefault(_framptonUtilsNoop);

  var _ofValue = _interopRequireDefault(_framptonUtilsOf_value);

  var _isEqual = _interopRequireDefault(_framptonUtilsIs_equal);

  var _validSinks = _interopRequireDefault(_framptonDataTaskValid_sinks);

  function Task(task) {
    this.fn = task;
  }

  /**
   * Takes a hash of functions to call based on the resolution of the Task and runs the computation
   * contained within this Task.
   *
   * The sinks object should be of the form:
   * {
   *   reject : (err) => {},
   *   resolve : (val) => {},
   *   progress : (prog) => {}
   * }
   *
   * Each function is used by the contained computation to update us on the state of the running
   * computation.
   *
   * @name run
   * @method
   * @memberof Frampton.Data.Task#
   * @param {Object} sinks
   * @param {Function} sinks.reject - The function to call on failure.
   * @param {Function} sinks.resolve - The function to call on success.
   * @param {Function} sinks.progress - The function to call on progress.
   */
  Task.prototype.run = function (sinks) {
    var _this = this;

    _immediate['default'](function () {
      try {
        _this.fn(_validSinks['default'](sinks));
      } catch (e) {
        sinks.reject(e);
      }
    });
  };

  /**
   * of(return) :: a -> Success a
   *
   * Returns a Task that always resolves with the given value.
   *
   * @name of
   * @method
   * @memberof Frampton.Data.Task
   * @param {*} val - Value to resolve task with
   * @returns {Frampton.Data.Task}
   */
  Task.of = function (val) {
    return new Task(function (sinks) {
      sinks.resolve(val);
    });
  };

  /**
   * of(return) :: a -> Success a
   *
   * Returns a Task that always resolves with the given value.
   *
   * @name of
   * @method
   * @memberof Frampton.Data.Task#
   * @param {*} val - Value to resolve task with
   * @returns {Frampton.Data.Task}
   */
  Task.prototype.of = function (val) {
    return new Task(function (sinks) {
      sinks.resolve(val);
    });
  };

  /**
   * join :: Task x (Task x a) -> Task x a
   *
   * Takes a nested Task and removes one level of nesting.
   *
   * @name join
   * @method
   * @memberof Frampton.Data.Task#
   * @returns {Frampton.Data.Task}
   */
  Task.prototype.join = function () {
    var source = this;
    return new Task(function (sinks) {
      source.run({
        reject: sinks.reject,
        resolve: function resolve(val) {
          val.run(sinks);
        },
        progress: _noop['default']
      });
    });
  };

  /**
   * concat(>>) :: Task x a -> Task x b -> Task x b
   *
   * Runs one task after another, discarding the return value of the first.
   *
   * @name concat
   * @method
   * @memberof Frampton.Data.Task#
   * @param {Frampton.Data.Task} task - Task to run after this task
   * @returns {Frampton.Data.Task}
   */
  Task.prototype.concat = function (task) {
    var source = this;
    return new Task(function (sinks) {
      source.run({
        reject: sinks.reject,
        resolve: function resolve(val) {
          task.run(sinks);
        },
        progress: _noop['default']
      });
    });
  };

  /**
   * chain(>>=) :: Task x a -> (a -> Task x b) -> Task x b
   *
   * Maps the return value of one Task to another Task, chaining two Tasks together.
   *
   * @name chain
   * @method
   * @memberof Frampton.Data.Task#
   * @param {Function} mapping - Function to map the return value of this Task to another Task.
   * @returns {Frampton.Data.Task}
   */
  Task.prototype.chain = function (mapping) {
    return this.map(mapping).join();
  };

  /**
   * ap(<*>) :: Task x (a -> b) -> Task x a -> Task x b
   *
   * @name ap
   * @method
   * @memberof Frampton.Data.Task#
   * @param {Frampton.Data.Task} task
   * @returns {Frampton.Data.Task}
   */
  Task.prototype.ap = function (task) {
    return this.chain(function (fn) {
      return task.map(fn);
    });
  };

  /**
   * recover :: Task x a -> (x -> b) -> Task x b
   *
   * Used to map a reject to a resolve.
   *
   * @name recover
   * @method
   * @memberof Frampton.Data.Task#
   * @param {Function} mapping
   * @returns {Frampton.Data.Task}
   */
  Task.prototype.recover = function (mapping) {
    var source = this;
    return new Task(function (sinks) {
      source.run({
        reject: function reject(err) {
          sinks.resolve(mapping(err));
        },
        resolve: sinks.resolve,
        progress: sinks.progress
      });
    });
  };

  /**
   * default :: Task x a -> b -> Task x b
   *
   * Returns the given value as a resolve in case of a reject.
   *
   * @name default
   * @method
   * @memberof Frampton.Data.Task#
   * @param {*} val - A value to map errors to
   * @returns {Frampton.Data.Task}
   */
  Task.prototype['default'] = function (val) {
    return this.recover(function () {
      return val;
    });
  };

  /**
   * progress :: Task x a -> (a -> b) -> Task x b
   *
   * Maps progress branch to resolution branch
   *
   * @name progress
   * @method
   * @memberof Frampton.Data.Task#
   * @param {Function} mapping
   * @returns {Frampton.Data.Task}
   */
  Task.prototype.progress = function (mapping) {
    var source = this;
    var mappingFn = _isFunction['default'](mapping) ? mapping : _ofValue['default'](mapping);
    return new Task(function (sinks) {
      source.run({
        reject: sinks.reject,
        resolve: sinks.resolve,
        progress: function progress(val) {
          sinks.resolve(mappingFn(val));
        }
      });
    });
  };

  /**
   * map :: Task x a -> (a -> b) -> Task x b
   *
   * @name map
   * @method
   * @memberof Frampton.Data.Task#
   * @param {Function} mapping
   * @returns {Frampton.Data.Task}
   */
  Task.prototype.map = function (mapping) {
    var source = this;
    var mappingFn = _isFunction['default'](mapping) ? mapping : _ofValue['default'](mapping);
    return new Task(function (sinks) {
      source.run({
        reject: sinks.reject,
        resolve: function resolve(val) {
          sinks.resolve(mappingFn(val));
        },
        progress: sinks.progress
      });
    });
  };

  /**
   * success :: Task x a -> (a -> b) -> Task x b
   *
   * A symantic alias for Task.prototype.map
   *
   * @name success
   * @method
   * @memberof Frampton.Data.Task#
   * @param {Function} mapping - The function to map the resolve value.
   * @returns {Frampton.Data.Task}
   */
  Task.prototype.success = Task.prototype.map;

  /**
   * filter :: Task x a -> (a -> b) -> Task x b
   *
   * @name filter
   * @method
   * @memberof Frampton.Data.Task#
   * @param {Function} predicate - The function to filter the resolve value.
   * @returns {Frampton.Data.Task}
   */
  Task.prototype.filter = function (predicate) {
    var source = this;
    var filterFn = _isFunction['default'](predicate) ? predicate : _isEqual['default'](predicate);
    return new Task(function (sinks) {
      source.run({
        reject: sinks.reject,
        resolve: function resolve(val) {
          if (filterFn(val)) {
            sinks.resolve(val);
          } else {
            sinks.reject(val);
          }
        },
        progress: sinks.progress
      });
    });
  };

  /**
   * validate :: Task x a -> (a -> b) -> Task x b
   *
   * A symantic alias for filter. Used to validate the return value of a Task. It the given
   * predicate returns false a resolve is turned into a reject.
   *
   * @name validate
   * @method
   * @memberof Frampton.Data.Task#
   * @param {Function} predicate - The function to validate the resolve value.
   * @returns {Frampton.Data.Task}
   */
  Task.prototype.validate = Task.prototype.filter;

  /**
   * Method for creating new Tasks. This method should be used instead of calling the Task
   * constructor directly.
   *
   * @name create
   * @method
   * @memberof Frampton.Data.Task
   * @param {Function} computation - The function the Task should execute
   * @returns {Frampton.Data.Task}
   */

  function create_task(computation) {
    return new Task(computation);
  }
});
define('frampton-data/task/execute', ['exports', 'module', 'frampton-utils/log', 'frampton-utils/warn'], function (exports, module, _framptonUtilsLog, _framptonUtilsWarn) {
  'use strict';

  module.exports = execute;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _log = _interopRequireDefault(_framptonUtilsLog);

  var _warn = _interopRequireDefault(_framptonUtilsWarn);

  /**
   * execute :: Signal Task x a -> Signal a -> ()
   *
   * Takes a Signal of Tasks to execute and a function to call with the resolve values
   * of those Tasks. Progress and reject values are ignored (logged to the console in dev mode).
   * It is suggested to use Tasks that have their reject and progress values mapped to reslove
   * values using the recover and progress methods on the Task prototype.
   *
   * @name execute
   * @memberof Frampton.Task
   * @static
   * @param {Frampton.Signals.Signal} tasks - Signal of Tasks to execute
   * @param {Function} value - A function to pass the resolve values to
   */

  function execute(tasks, value) {
    tasks.value(function (task) {
      task.run({
        reject: function reject(err) {
          _warn['default']('Error running task: ', err);
        },
        resolve: function resolve(val) {
          value(val);
        },
        progress: function progress(val) {
          _log['default']('Task progress: ', val);
        }
      });
    });
  }
});
define('frampton-data/task/fail', ['exports', 'module', 'frampton-data/task/create'], function (exports, module, _framptonDataTaskCreate) {
  'use strict';

  module.exports = fail;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _create = _interopRequireDefault(_framptonDataTaskCreate);

  /**
   * fail :: x -> Task x a
   *
   * Creates a Task that always fails with the given value.
   *
   * @name fail
   * @method
   * @memberof Frampton.Data.Task
   * @param {*} err - Value used as the return value of the reject branch.
   * @returns {Frampton.Data.Task}
   */

  function fail(err) {
    return _create['default'](function (sinks) {
      return sinks.reject(err);
    });
  }
});
define('frampton-data/task/never', ['exports', 'module', 'frampton-data/task/create'], function (exports, module, _framptonDataTaskCreate) {
  'use strict';

  module.exports = never;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _create = _interopRequireDefault(_framptonDataTaskCreate);

  /**
   * never :: Task x a
   *
   * Creates a Task that never resolves.
   *
   * @name never
   * @method
   * @memberof Frampton.Data.Task
   * @returns {Frampton.Data.Task}
   */

  function never() {
    return _create['default'](function () {});
  }
});
define("frampton-data/task/sequence", ["exports", "module"], function (exports, module) {
  /**
   * sequence :: [Task x a] -> Task x a
   *
   * Creates a Task that runs the given Tasks in the order they are passed in. The new
   * Task will resolve when all of its parent Tasks have resolved. The resolve value of
   * the new Task is the resolve value of the last of its parents Tasks. The resolve
   * values for all other Tasks are discarded.
   *
   * @name sequence
   * @method
   * @memberof Frampton.Data.Task
   * @param {Frampton.Data.Task[]} tassk - The Tasks to wait for
   * @returns {Frampton.Data.Task}
   */
  "use strict";

  module.exports = sequence;

  function sequence() {
    for (var _len = arguments.length, tasks = Array(_len), _key = 0; _key < _len; _key++) {
      tasks[_key] = arguments[_key];
    }

    return tasks.reduce(function (acc, next) {
      return acc.concat(next);
    });
  }
});
define('frampton-data/task/succeed', ['exports', 'module', 'frampton-data/task/create'], function (exports, module, _framptonDataTaskCreate) {
  'use strict';

  module.exports = succeed;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _create = _interopRequireDefault(_framptonDataTaskCreate);

  /**
   * succeed :: a -> Task x a
   *
   * Creates a Task that always succeeds with the given value.
   *
   * @name succeed
   * @method
   * @memberof Frampton.Data.Task
   * @param {*} val - Value used as the return value of the resolve branch.
   * @returns {Frampton.Data.Task}
   */

  function succeed(val) {
    return _create['default'](function (sinks) {
      return sinks.resolve(val);
    });
  }
});
define('frampton-data/task/valid_sinks', ['exports', 'module', 'frampton-utils/noop'], function (exports, module, _framptonUtilsNoop) {
  'use strict';

  module.exports = valid_sinks;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _noop = _interopRequireDefault(_framptonUtilsNoop);

  /**
   * @name validSinks
   * @param {Object} sinks - Sinks to validate
   * @returns {Object} The validated sinks
   */

  function valid_sinks(sinks) {
    return {
      reject: sinks.reject || _noop['default'],
      resolve: sinks.resolve || _noop['default'],
      progress: sinks.progress || _noop['default']
    };
  }
});
define('frampton-data/task/when', ['exports', 'module', 'frampton-data/task/create'], function (exports, module, _framptonDataTaskCreate) {
  'use strict';

  module.exports = when;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _create = _interopRequireDefault(_framptonDataTaskCreate);

  /**
   * when :: [Task x a] -> Task x [a]
   *
   * Creates a Task that waits for each of the given Tasks to resolve before it resolves.
   * When it does resolve, it resolves with an Array containing the resolved values of each
   * of its parent Tasks. The Array contains the resolve values in the same order as the
   * order that the parent Tasks were passed in.
   *
   * @name when
   * @method
   * @memberof Frampton.Data.Task
   * @param {Frampton.Data.Task[]} tasks - The Tasks to wait for
   * @returns {Frampton.Data.Task}
   */

  function when() {
    for (var _len = arguments.length, tasks = Array(_len), _key = 0; _key < _len; _key++) {
      tasks[_key] = arguments[_key];
    }

    return _create['default'](function (sinks) {

      var valueArray = new Array(tasks.length);
      var len = tasks.length;
      var idx = 0;
      var count = 0;

      function logError(err) {}
      function logProgress(val) {}

      tasks.forEach(function (task) {
        var index = idx++;
        task.run({
          reject: logError,
          resolve: function resolve(val) {
            count = count + 1;
            valueArray[index] = val;
            if (count === len) {
              sinks.resolve(valueArray);
            }
          },
          progress: logProgress
        });
      });
    });
  }
});
define('frampton-data/union/create', ['exports', 'module', 'frampton-utils/curry_n', 'frampton-utils/warn', 'frampton-record/keys', 'frampton-data/union/utils/create_type', 'frampton-data/union/utils/case_of'], function (exports, module, _framptonUtilsCurry_n, _framptonUtilsWarn, _framptonRecordKeys, _framptonDataUnionUtilsCreate_type, _framptonDataUnionUtilsCase_of) {
  'use strict';

  module.exports = create_union;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curryN = _interopRequireDefault(_framptonUtilsCurry_n);

  var _warn = _interopRequireDefault(_framptonUtilsWarn);

  var _getKeys = _interopRequireDefault(_framptonRecordKeys);

  var _createType = _interopRequireDefault(_framptonDataUnionUtilsCreate_type);

  var _caseOf = _interopRequireDefault(_framptonDataUnionUtilsCase_of);

  var blacklist = ['ctor', 'children', 'caseOf'];

  /**
  
    const Action = Union({
      Foo : [String, Number],
      Bar : { name : String }
    });
  
    const foo = Action.Foo('test', 89);
  
    const bar = Action.Bar({ name : 'test' });
  
    Action.match({
      Foo : (str, num) => str + num,
      Bar : (name) => `my name is ${name}`
    });
  
   */

  /**
   * Creates constructors for each type described in config
   *
   * @name create
   * @memberof Frampton.Data.Union
   * @param {Object} values
   * @returns {Frampton.Data.Union}
   */

  function create_union(values) {
    var parent = {};
    var children = _getKeys['default'](values);

    parent.prototype = {};
    parent.ctor = 'Frampton.Data.Union';
    parent.children = children;
    parent.match = _curryN['default'](3, _caseOf['default'], parent);

    for (var _name in values) {
      if (blacklist.indexOf(_name) === -1) {
        parent[_name] = _createType['default'](parent, _name, values[_name]);
      } else {
        _warn['default']('Frampton.Data.Union received a protected key: ' + _name);
      }
    }

    return Object.freeze(parent);
  }
});
define('frampton-data/union/utils/case_of', ['exports', 'module', 'frampton/namespace', 'frampton-utils/is_something', 'frampton-utils/is_nothing', 'frampton-data/union/utils/validate_parent', 'frampton-data/union/utils/validate_options', 'frampton-data/union/utils/wildcard'], function (exports, module, _framptonNamespace, _framptonUtilsIs_something, _framptonUtilsIs_nothing, _framptonDataUnionUtilsValidate_parent, _framptonDataUnionUtilsValidate_options, _framptonDataUnionUtilsWildcard) {
  'use strict';

  module.exports = case_of;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _Frampton = _interopRequireDefault(_framptonNamespace);

  var _isSomething = _interopRequireDefault(_framptonUtilsIs_something);

  var _isNothing = _interopRequireDefault(_framptonUtilsIs_nothing);

  var _validateParent = _interopRequireDefault(_framptonDataUnionUtilsValidate_parent);

  var _validateOptions = _interopRequireDefault(_framptonDataUnionUtilsValidate_options);

  var _wildcard = _interopRequireDefault(_framptonDataUnionUtilsWildcard);

  function getMatch(child, cases) {
    var match = cases[child.ctor];
    if (_isSomething['default'](match)) {
      return match;
    } else {
      return cases[_wildcard['default']];
    }
  }

  /**
   * @name caseOf
   * @memberof Frampton.Data.Union
   * @param {Object} parent
   * @param {Object} cases
   * @param {Frampton.Data.Union} child
   * @returns {*}
   */

  function case_of(parent, cases, child) {

    // In dev mode we validate types
    // In prod we pray because we're screwed anyway
    if (!_Frampton['default'].isProd()) {
      _validateParent['default'](parent, child);
      _validateOptions['default'](parent, cases);
    }

    var match = getMatch(child, cases);

    if (_isNothing['default'](match)) {
      throw new Error('No match for value with name: ' + child.ctor);
    }

    // Destructure arguments for passing to callback
    return match.apply(undefined, child._values);
  }
});
define('frampton-data/union/utils/create_type', ['exports', 'module', 'frampton/namespace', 'frampton-utils/is_array', 'frampton-utils/is_something', 'frampton-utils/curry_n', 'frampton-data/union/utils/validator', 'frampton-data/union/utils/validate_args'], function (exports, module, _framptonNamespace, _framptonUtilsIs_array, _framptonUtilsIs_something, _framptonUtilsCurry_n, _framptonDataUnionUtilsValidator, _framptonDataUnionUtilsValidate_args) {
  'use strict';

  module.exports = create_type;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _Frampton = _interopRequireDefault(_framptonNamespace);

  var _isArray = _interopRequireDefault(_framptonUtilsIs_array);

  var _isSomething = _interopRequireDefault(_framptonUtilsIs_something);

  var _curryN = _interopRequireDefault(_framptonUtilsCurry_n);

  var _validator = _interopRequireDefault(_framptonDataUnionUtilsValidator);

  var _validateArgs = _interopRequireDefault(_framptonDataUnionUtilsValidate_args);

  function getValidators(parent, fields) {
    if (!_Frampton['default'].isProd()) {
      return fields.map(function (field) {
        return _validator['default'](parent, field);
      });
    } else {
      return null;
    }
  }

  /**
   * @name createType
   * @memberof Frampton.Data.Union
   * @param {Object} parent
   * @param {String} name
   * @param {Object} fields
   * @returns {Function}
   */

  function create_type(parent, name, fields) {

    if (!_isArray['default'](fields)) {
      throw new Error('Union must receive an array of fields for each type');
    }

    var len = fields.length;
    var validators = getValidators(parent, fields);

    var constructor = function constructor() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (_isSomething['default'](validators) && !_validateArgs['default'](validators, args)) {
        throw new TypeError('Frampton.Data.Union.' + name + ' recieved an unknown argument');
      }

      var child = [];
      var len = args.length;
      child.constructor = parent;
      child.ctor = name;
      child._values = args;

      for (var i = 0; i < len; i++) {
        child[i] = args[i];
      }

      return Object.freeze(child);
    };

    return len === 0 ? constructor : _curryN['default'](len, constructor);
  }
});
define('frampton-data/union/utils/object_validator', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  module.exports = _curry['default'](function object_validator(parent, child) {
    return child.constructor === parent;
  });
});
define('frampton-data/union/utils/validate_args', ['exports', 'module', 'frampton-utils/is_undefined'], function (exports, module, _framptonUtilsIs_undefined) {
  'use strict';

  module.exports = validate_args;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _isUndefined = _interopRequireDefault(_framptonUtilsIs_undefined);

  function validate_args(validators, args) {
    for (var i = 0; i < validators.length; i++) {
      if (_isUndefined['default'](args[i]) || !validators[i](args[i])) {
        return false;
      }
    }
    return true;
  }
});
define('frampton-data/union/utils/validate_options', ['exports', 'module', 'frampton-utils/warn', 'frampton-data/union/utils/wildcard'], function (exports, module, _framptonUtilsWarn, _framptonDataUnionUtilsWildcard) {
  'use strict';

  module.exports = validate_options;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _warn = _interopRequireDefault(_framptonUtilsWarn);

  var _wildcard = _interopRequireDefault(_framptonDataUnionUtilsWildcard);

  function hasMatch(cases, child) {
    return cases.hasOwnProperty(_wildcard['default']) || cases.hasOwnProperty(child);
  }

  function validate_options(parent, cases) {
    var children = parent.children;
    var len = children.length;
    for (var i = 0; i < len; i++) {
      var child = children[i];
      if (!hasMatch(cases, child)) {
        _warn['default']('Non-exhaustive pattern match for case: ' + child);
      }
    }
  }
});
define('frampton-data/union/utils/validate_parent', ['exports', 'module', 'frampton-utils/curry', 'frampton-utils/is_object', 'frampton-data/union/utils/object_validator'], function (exports, module, _framptonUtilsCurry, _framptonUtilsIs_object, _framptonDataUnionUtilsObject_validator) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  var _isObject = _interopRequireDefault(_framptonUtilsIs_object);

  var _objectValidator = _interopRequireDefault(_framptonDataUnionUtilsObject_validator);

  /**
   * Is the given parent the actual parent of the given child?
   */
  module.exports = _curry['default'](function validate_parent(parent, child) {
    if (!_objectValidator['default'](parent, child)) {
      if (_isObject['default'](child) && child.ctor) {
        throw new TypeError('Frampton.Data.Union.caseOf received unrecognized type: ' + child.ctor);
      } else {
        throw new TypeError('Frampton.Data.Union.caseOf received unrecognized type');
      }
    }
  });
});
define('frampton-data/union/utils/validator', ['exports', 'module', 'frampton-utils/is_boolean', 'frampton-utils/is_array', 'frampton-utils/is_number', 'frampton-utils/is_string', 'frampton-utils/is_function', 'frampton-utils/is_node', 'frampton-data/union/utils/object_validator'], function (exports, module, _framptonUtilsIs_boolean, _framptonUtilsIs_array, _framptonUtilsIs_number, _framptonUtilsIs_string, _framptonUtilsIs_function, _framptonUtilsIs_node, _framptonDataUnionUtilsObject_validator) {
  'use strict';

  module.exports = get_validator;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _isBoolean = _interopRequireDefault(_framptonUtilsIs_boolean);

  var _isArray = _interopRequireDefault(_framptonUtilsIs_array);

  var _isNumber = _interopRequireDefault(_framptonUtilsIs_number);

  var _isString = _interopRequireDefault(_framptonUtilsIs_string);

  var _isFunction = _interopRequireDefault(_framptonUtilsIs_function);

  var _isNode = _interopRequireDefault(_framptonUtilsIs_node);

  var _objectValidator = _interopRequireDefault(_framptonDataUnionUtilsObject_validator);

  function get_validator(parent, type) {

    switch (type) {
      case String:
        return _isString['default'];

      case Number:
        return _isNumber['default'];

      case Function:
        return _isFunction['default'];

      case Boolean:
        return _isBoolean['default'];

      case Array:
        return _isArray['default'];

      case Element:
        return _isNode['default'];

      case Node:
        return _isNode['default'];

      case undefined:
        return _objectValidator['default'](parent);

      default:
        return _objectValidator['default'](type);
    }

    return false;
  }
});
define('frampton-data/union/utils/wildcard', ['exports', 'module'], function (exports, module) {
  'use strict';

  module.exports = '_';
});
define('frampton-events', ['exports', 'frampton/namespace', 'frampton-events/on_event', 'frampton-events/on_selector', 'frampton-events/contains', 'frampton-events/event_target', 'frampton-events/event_value', 'frampton-events/get_position', 'frampton-events/get_position_relative', 'frampton-events/has_selector', 'frampton-events/contains_selector', 'frampton-events/selector_contains', 'frampton-events/closest_to_event', 'frampton-events/prevent_default'], function (exports, _framptonNamespace, _framptonEventsOn_event, _framptonEventsOn_selector, _framptonEventsContains, _framptonEventsEvent_target, _framptonEventsEvent_value, _framptonEventsGet_position, _framptonEventsGet_position_relative, _framptonEventsHas_selector, _framptonEventsContains_selector, _framptonEventsSelector_contains, _framptonEventsClosest_to_event, _framptonEventsPrevent_default) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _Frampton = _interopRequireDefault(_framptonNamespace);

  var _onEvent = _interopRequireDefault(_framptonEventsOn_event);

  var _onSelector = _interopRequireDefault(_framptonEventsOn_selector);

  var _contains = _interopRequireDefault(_framptonEventsContains);

  var _eventTarget = _interopRequireDefault(_framptonEventsEvent_target);

  var _eventValue = _interopRequireDefault(_framptonEventsEvent_value);

  var _getPosition = _interopRequireDefault(_framptonEventsGet_position);

  var _getPositionRelative = _interopRequireDefault(_framptonEventsGet_position_relative);

  var _hasSelector = _interopRequireDefault(_framptonEventsHas_selector);

  var _containsSelector = _interopRequireDefault(_framptonEventsContains_selector);

  var _selectorContains = _interopRequireDefault(_framptonEventsSelector_contains);

  var _closestToEvent = _interopRequireDefault(_framptonEventsClosest_to_event);

  var _preventDefault = _interopRequireDefault(_framptonEventsPrevent_default);

  /**
   * @name Events
   * @namespace
   * @memberof Frampton
   */
  _Frampton['default'].Events = {};
  _Frampton['default'].Events.onEvent = _onEvent['default'];
  _Frampton['default'].Events.onSelector = _onSelector['default'];
  _Frampton['default'].Events.contains = _contains['default'];
  _Frampton['default'].Events.eventTarget = _eventTarget['default'];
  _Frampton['default'].Events.eventValue = _eventValue['default'];
  _Frampton['default'].Events.hasSelector = _hasSelector['default'];
  _Frampton['default'].Events.containsSelector = _containsSelector['default'];
  _Frampton['default'].Events.selectorContains = _selectorContains['default'];
  _Frampton['default'].Events.getPosition = _getPosition['default'];
  _Frampton['default'].Events.getPositionRelative = _getPositionRelative['default'];
  _Frampton['default'].Events.closestToEvent = _closestToEvent['default'];
  _Frampton['default'].Events.preventDefault = _preventDefault['default'];
});
define('frampton-events/closest_to_event', ['exports', 'module', 'frampton-utils/curry', 'frampton-utils/compose', 'frampton-style/closest', 'frampton-events/event_target'], function (exports, module, _framptonUtilsCurry, _framptonUtilsCompose, _framptonStyleClosest, _framptonEventsEvent_target) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  var _compose = _interopRequireDefault(_framptonUtilsCompose);

  var _closest = _interopRequireDefault(_framptonStyleClosest);

  var _eventTarget = _interopRequireDefault(_framptonEventsEvent_target);

  /**
   * closestToEvent :: String -> DomEvent -> DomNode
   *
   * Gets the closest parent to the event target matching the given selector
   *
   * @name closestToEvent
   * @memberof Frampton.Events
   * @static
   * @param {String} selector
   * @param {Object} evt
   * @returns {Object} A DomNode matching the given selector
   */
  module.exports = _curry['default'](function closest_to_event(selector, evt) {
    return _compose['default'](_closest['default'](selector), _eventTarget['default'])(evt);
  });
});
define('frampton-events/contains_selector', ['exports', 'module', 'frampton-utils/curry', 'frampton-utils/compose', 'frampton-style/contains', 'frampton-events/event_target'], function (exports, module, _framptonUtilsCurry, _framptonUtilsCompose, _framptonStyleContains, _framptonEventsEvent_target) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  var _compose = _interopRequireDefault(_framptonUtilsCompose);

  var _contains = _interopRequireDefault(_framptonStyleContains);

  var _eventTarget = _interopRequireDefault(_framptonEventsEvent_target);

  /**
   * containsSelector :: String -> DomEvent -> Boolean
   *
   * Does the target of the given event object contain an object with the
   * given selector?
   *
   * @name containsSelector
   * @static
   * @memberof Frampton.Events
   * @param {String} selector - A selector to test
   * @param {Object} evt - An event object whose target will be tested against
   * @returns {Boolean} Does the event target, or one of its children, have the given selector
   */
  module.exports = _curry['default'](function contains_selector(selector, evt) {
    return _compose['default'](_contains['default'](selector), _eventTarget['default'])(evt);
  });
});
define('frampton-events/contains', ['exports', 'module', 'frampton-utils/curry', 'frampton-utils/compose', 'frampton-html/contains', 'frampton-events/event_target'], function (exports, module, _framptonUtilsCurry, _framptonUtilsCompose, _framptonHtmlContains, _framptonEventsEvent_target) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  var _compose = _interopRequireDefault(_framptonUtilsCompose);

  var _contains = _interopRequireDefault(_framptonHtmlContains);

  var _eventTarget = _interopRequireDefault(_framptonEventsEvent_target);

  /**
   * contains :: DomNode -> DomEvent -> Boolean
   *
   * @name contains
   * @memberof Frampton.Events
   * @static
   * @param {Object} element
   * @param {Object} evt
   * @returns {Boolean}
   */
  module.exports = _curry['default'](function curried_contains(element, evt) {
    return _compose['default'](_contains['default'](element), _eventTarget['default'])(evt);
  });
});
define('frampton-events/document_cache', ['exports', 'module', 'frampton-events/simple_cache'], function (exports, module, _framptonEventsSimple_cache) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _simpleCahce = _interopRequireDefault(_framptonEventsSimple_cache);

  module.exports = _simpleCahce['default']();
});
define('frampton-events/event_dispatcher', ['exports', 'frampton-utils/assert', 'frampton-utils/is_function', 'frampton-utils/is_defined', 'frampton-utils/lazy', 'frampton-events/event_map'], function (exports, _framptonUtilsAssert, _framptonUtilsIs_function, _framptonUtilsIs_defined, _framptonUtilsLazy, _framptonEventsEvent_map) {
  'use strict';

  exports.__esModule = true;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _assert = _interopRequireDefault(_framptonUtilsAssert);

  var _isFunction = _interopRequireDefault(_framptonUtilsIs_function);

  var _isDefined = _interopRequireDefault(_framptonUtilsIs_defined);

  var _lazy = _interopRequireDefault(_framptonUtilsLazy);

  var _EVENT_MAP = _interopRequireDefault(_framptonEventsEvent_map);

  // get dom event -> filter -> return stream
  function addDomEvent(name, node, callback) {
    node.addEventListener(name, callback, !_EVENT_MAP['default'][name].bubbles);
  }

  function addCustomEvent(name, target, callback) {
    var listen = _isFunction['default'](target.addEventListener) ? target.addEventListener : _isFunction['default'](target.on) ? target.on : null;

    _assert['default']('addListener received an unknown type as target', _isFunction['default'](listen));

    listen.call(target, name, callback);
  }

  function removeDomEvent(name, node, callback) {
    node.removeEventListener(name, callback, !_EVENT_MAP['default'][name].bubbles);
  }

  function removeCustomEvent(name, target, callback) {
    var remove = _isFunction['default'](target.removeEventListener) ? target.removeEventListener : _isFunction['default'](target.off) ? target.off : null;

    _assert['default']('removeListener received an unknown type as target', _isFunction['default'](remove));

    remove.call(target, name, callback);
  }

  function addListener(eventName, target, callback) {

    if (_isDefined['default'](_EVENT_MAP['default'][eventName]) && _isFunction['default'](target.addEventListener)) {
      addDomEvent(eventName, target, callback);
    } else {
      addCustomEvent(eventName, target, callback);
    }

    return _lazy['default'](removeListener, [eventName, target, callback]);
  }

  function removeListener(eventName, target, callback) {
    if (_isDefined['default'](_EVENT_MAP['default'][eventName]) && _isFunction['default'](target.removeEventListener)) {
      removeDomEvent(eventName, target, callback);
    } else {
      removeCustomEvent(eventName, target, callback);
    }
  }

  exports.addListener = addListener;
  exports.removeListener = removeListener;
});
define("frampton-events/event_map", ["exports", "module"], function (exports, module) {
  "use strict";

  module.exports = {

    abort: {
      bubbles: true,
      signal: null
    },

    blur: {
      bubbles: false,
      signal: null
    },

    change: {
      bubbles: true,
      signal: null
    },

    click: {
      bubbles: true,
      signal: null
    },

    error: {
      bubbles: true,
      signal: null
    },

    focus: {
      bubbles: false,
      signal: null
    },

    focusin: {
      bubbles: true,
      signal: null
    },

    focusout: {
      bubbles: true,
      signal: null
    },

    input: {
      bubbles: true,
      signal: null
    },

    keyup: {
      bubbles: true,
      signal: null
    },

    keydown: {
      bubbles: true,
      signal: null
    },

    keypress: {
      bubbles: true,
      signal: null
    },

    load: {
      bubbles: true,
      signal: null
    },

    mousedown: {
      bubbles: true,
      signal: null
    },

    mouseup: {
      bubbles: true,
      signal: null
    },

    mousemove: {
      bubbles: true,
      signal: null
    },

    mouseenter: {
      bubbles: false,
      signal: null
    },

    mouseleave: {
      bubbles: false,
      signal: null
    },

    mouseover: {
      bubbles: true,
      signal: null
    },

    mouseout: {
      bubbles: true,
      signal: null
    },

    touchstart: {
      bubbles: true,
      signal: null
    },

    touchend: {
      bubbles: true,
      signal: null
    },

    touchcancel: {
      bubbles: true,
      signal: null
    },

    touchleave: {
      bubbles: true,
      signal: null
    },

    touchmove: {
      bubbles: true,
      signal: null
    },

    submit: {
      bubbles: true,
      signal: null
    },

    animationstart: {
      bubbles: true,
      signal: null
    },

    animationend: {
      bubbles: true,
      signal: null
    },

    animationiteration: {
      bubbles: true,
      signal: null
    },

    transitionend: {
      bubbles: true,
      signal: null
    },

    drag: {
      bubbles: true,
      signal: null
    },

    drop: {
      bubbles: true,
      signal: null
    },

    dragstart: {
      bubbles: true,
      signal: null
    },

    dragend: {
      bubbles: true,
      signal: null
    },

    dragenter: {
      bubbles: true,
      signal: null
    },

    dragleave: {
      bubbles: true,
      signal: null
    },

    dragover: {
      bubbles: true,
      signal: null
    },

    scroll: {
      bubbles: true,
      signal: null
    },

    wheel: {
      bubbles: true,
      signal: null
    }
  };
});
define('frampton-events/event_supported', ['exports', 'module', 'frampton-utils/is_function', 'frampton-utils/memoize'], function (exports, module, _framptonUtilsIs_function, _framptonUtilsMemoize) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _isFunction = _interopRequireDefault(_framptonUtilsIs_function);

  var _memoize = _interopRequireDefault(_framptonUtilsMemoize);

  var TAGNAMES = {
    select: 'input',
    change: 'input',
    submit: 'form',
    reset: 'form',
    error: 'img',
    load: 'img',
    abort: 'img'
  };

  /**
   * Tests whether a given event is supported by the current browser.
   *
   * @name eventSupported
   * @static
   * @private
   * @memberof Frampton.Events
   * @param {String} eventName The name of the event to test
   * @returns {Boolean} Is the event supported
   */
  module.exports = _memoize['default'](function event_supported(eventName) {
    var el = document.createElement(TAGNAMES[eventName] || 'div');
    eventName = 'on' + eventName;
    var isSupported = (eventName in el);
    if (!isSupported) {
      el.setAttribute(eventName, 'return;');
      isSupported = _isFunction['default'](el[eventName]);
    }
    el = null;
    return !!isSupported;
  });
});
define("frampton-events/event_target", ["exports", "module"], function (exports, module) {
  /**
   * eventTarget :: DomEvent -> Object
   *
   * @name eventTarget
   * @memberof Frampton.Events
   * @static
   * @param {Object} evt
   * @returns {Object} The target value of the event object, usually a DomNode
   */
  "use strict";

  module.exports = event_target;

  function event_target(evt) {
    return evt.target;
  }
});
define('frampton-events/event_value', ['exports', 'module', 'frampton-utils/compose', 'frampton-html/element_value', 'frampton-events/event_target'], function (exports, module, _framptonUtilsCompose, _framptonHtmlElement_value, _framptonEventsEvent_target) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _compose = _interopRequireDefault(_framptonUtilsCompose);

  var _elementValue = _interopRequireDefault(_framptonHtmlElement_value);

  var _eventTarget = _interopRequireDefault(_framptonEventsEvent_target);

  /**
   * eventValue :: DomEvent -> String
   *
   * @name eventValue
   * @memberof Frampton.Events
   * @static
   * @param {Object} evt
   * @returns {String} The value property of the event target
   */
  module.exports = _compose['default'](_elementValue['default'], _eventTarget['default']);
});
define('frampton-events/get_document_signal', ['exports', 'module', 'frampton-events/document_cache', 'frampton-events/get_event_signal'], function (exports, module, _framptonEventsDocument_cache, _framptonEventsGet_event_signal) {
  'use strict';

  module.exports = get_document_signal;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _documentCache = _interopRequireDefault(_framptonEventsDocument_cache);

  var _getEventSignal = _interopRequireDefault(_framptonEventsGet_event_signal);

  /**
   * @name getDocumentSignal
   * @memberof Frampton.Events
   * @static
   * @private
   * @param {String} name Event name to look up
   * @returns {Frampton.Signal.Signal}
   */

  function get_document_signal(name) {
    return _documentCache['default'](name, function () {
      return _getEventSignal['default'](name, document);
    });
  }
});
define('frampton-events/get_event_signal', ['exports', 'module', 'frampton-utils/is_empty', 'frampton-signal/create', 'frampton-events/event_dispatcher'], function (exports, module, _framptonUtilsIs_empty, _framptonSignalCreate, _framptonEventsEvent_dispatcher) {
  'use strict';

  module.exports = get_event_signal;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _isEmpty = _interopRequireDefault(_framptonUtilsIs_empty);

  var _createSignal = _interopRequireDefault(_framptonSignalCreate);

  function get_event_signal(name, target) {
    var parts = name.split(' ').filter(function (val) {
      return !_isEmpty['default'](val);
    });
    var len = parts.length;
    var sigs = [];
    for (var i = 0; i < len; i++) {
      var sig = _createSignal['default']();
      _framptonEventsEvent_dispatcher.addListener(parts[i], target, sig.push);
      sigs.push(sig);
    }
    return _framptonSignalCreate.mergeMany(sigs);
  }
});
define('frampton-events/get_position_relative', ['exports', 'module', 'frampton-utils/curry', 'frampton-events/get_position'], function (exports, module, _framptonUtilsCurry, _framptonEventsGet_position) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  var _getPosition = _interopRequireDefault(_framptonEventsGet_position);

  /**
   * getPositionRelative :: DomNode -> DomEvent -> [Number, Number]
   *
   * @name getPositionRelative
   * @memberof Frampton.Events
   * @static
   * @param {Object} node
   * @param {Object} evt
   * @returns {Array} A pair where the 0 index is the x coord and the 1 index is the y coord
   */
  module.exports = _curry['default'](function get_position_relative(node, evt) {

    var position = _getPosition['default'](evt);

    var rect = node.getBoundingClientRect();
    var rel_x = rect.left + document.body.scrollLeft + document.documentElement.scrollLeft;
    var rel_y = rect.top + document.body.scrollTop + document.documentElement.scrollTop;

    var pos_x = position[0] - Math.round(rel_x) - node.clientLeft;
    var pos_y = position[1] - Math.round(rel_y) - node.clientTop;

    return [pos_x, pos_y];
  });
});
define("frampton-events/get_position", ["exports", "module"], function (exports, module) {
  /**
   * getPosition :: DomEvent -> [Number, Number]
   *
   * @name getPosition
   * @memberof Frampton.Events
   * @static
   * @param {Object} evt
   * @returns {Array} A pair where the 0 index is the x coord and the 1 index is the y coord
   */
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
define('frampton-events/has_selector', ['exports', 'module', 'frampton-utils/curry', 'frampton-utils/compose', 'frampton-style/matches', 'frampton-events/event_target'], function (exports, module, _framptonUtilsCurry, _framptonUtilsCompose, _framptonStyleMatches, _framptonEventsEvent_target) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  var _compose = _interopRequireDefault(_framptonUtilsCompose);

  var _matches = _interopRequireDefault(_framptonStyleMatches);

  var _eventTarget = _interopRequireDefault(_framptonEventsEvent_target);

  /**
   * hasSelector :: String -> DomEvent -> Boolean
   *
   * @name hasSelector
   * @memberof Frampton.Events
   * @static
   * @param {String} selector
   * @param {Object} evt
   * @returns {Boolean}
   */
  module.exports = _curry['default'](function has_selector(selector, evt) {
    return _compose['default'](_matches['default'](selector), _eventTarget['default'])(evt);
  });
});
define('frampton-events/on_event', ['exports', 'module', 'frampton-utils/is_function', 'frampton-utils/is_nothing', 'frampton-events/contains', 'frampton-events/event_map', 'frampton-events/get_document_signal', 'frampton-events/get_event_signal'], function (exports, module, _framptonUtilsIs_function, _framptonUtilsIs_nothing, _framptonEventsContains, _framptonEventsEvent_map, _framptonEventsGet_document_signal, _framptonEventsGet_event_signal) {
  'use strict';

  module.exports = on_event;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _isFunction = _interopRequireDefault(_framptonUtilsIs_function);

  var _isNothing = _interopRequireDefault(_framptonUtilsIs_nothing);

  var _contains = _interopRequireDefault(_framptonEventsContains);

  var _EVENT_MAP = _interopRequireDefault(_framptonEventsEvent_map);

  var _getDocumentSignal = _interopRequireDefault(_framptonEventsGet_document_signal);

  var _getEventSignal = _interopRequireDefault(_framptonEventsGet_event_signal);

  /**
   * onEvent :: String -> Dom -> Signal Event
   *
   * @name onEvent
   * @memberof Frampton.Events
   * @static
   * @param {String} eventName Name of event to listen for
   * @param {Object} target    Object on which to listen for event
   * @returns {Frampton.Signal.Signal} A Signal of all occurances of the given event on the given object
   */

  function on_event(eventName, target) {
    if (_EVENT_MAP['default'][eventName] && (_isNothing['default'](target) || _isFunction['default'](target.addEventListener))) {
      if (_isNothing['default'](target)) {
        return _getDocumentSignal['default'](eventName);
      } else {
        return _getDocumentSignal['default'](eventName).filter(_contains['default'](target));
      }
    } else {
      return _getEventSignal['default'](eventName, target);
    }
  }
});
define('frampton-events/on_selector', ['exports', 'module', 'frampton-utils/is_something', 'frampton-utils/is_string', 'frampton-utils/is_empty', 'frampton-events/closest_to_event', 'frampton-events/selector_contains', 'frampton-events/event_map', 'frampton-events/get_document_signal', 'frampton-events/selector_cache'], function (exports, module, _framptonUtilsIs_something, _framptonUtilsIs_string, _framptonUtilsIs_empty, _framptonEventsClosest_to_event, _framptonEventsSelector_contains, _framptonEventsEvent_map, _framptonEventsGet_document_signal, _framptonEventsSelector_cache) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _isSomething = _interopRequireDefault(_framptonUtilsIs_something);

  var _isString = _interopRequireDefault(_framptonUtilsIs_string);

  var _isEmpty = _interopRequireDefault(_framptonUtilsIs_empty);

  var _closestToEvent = _interopRequireDefault(_framptonEventsClosest_to_event);

  var _selectorContains = _interopRequireDefault(_framptonEventsSelector_contains);

  var _EVENT_MAP = _interopRequireDefault(_framptonEventsEvent_map);

  var _getDocumentSignal = _interopRequireDefault(_framptonEventsGet_document_signal);

  var _selectorCache = _interopRequireDefault(_framptonEventsSelector_cache);

  function validateEventName(name) {
    var parts = name.split(' ').filter(function (val) {
      return !_isEmpty['default'](val);
    });
    var len = parts.length;
    for (var i = 0; i < len; i++) {
      if (!_isSomething['default'](_EVENT_MAP['default'][parts[i]])) {
        return false;
      }
    }
    return true;
  }

  function mouseEnterSelector(selector) {
    var previousElement = null;
    return _getDocumentSignal['default']('mouseover').filter(function (evt) {
      var current = _closestToEvent['default'](selector, evt);
      if (_isSomething['default'](current) && current !== previousElement) {
        previousElement = current;
        return true;
      } else {
        return false;
      }
    });
  }

  function mouseLeaveSelector(selector) {
    var previousElement = null;
    return _getDocumentSignal['default']('mouseleave').filter(function (evt) {
      var current = _closestToEvent['default'](selector, evt);
      if (_isSomething['default'](current) && current !== previousElement) {
        previousElement = current;
        return true;
      } else if (_isSomething['default'](current)) {
        previousElement = current;
        return false;
      } else {
        return false;
      }
    });
  }

  /**
   * onSelector :: String -> String -> Signal Event
   *
   * @name onSelector
   * @memberof Frampton.Events
   * @static
   * @param {String} eventName Name of event to listen for
   * @param {String} selector  Selector to filter events by
   * @returns {Frampton.Signal.Signal} A Signal of all occurances of the given event within given selector
   */
  function onSelector(eventName, selector) {
    if (validateEventName(eventName) && _isString['default'](selector)) {
      return _selectorCache['default'](eventName + ' | ' + selector, function () {
        if (eventName === 'mouseenter') {
          return mouseEnterSelector(selector);
        } else if (eventName === 'mouseleave') {
          return mouseLeaveSelector(selector);
        } else {
          return _getDocumentSignal['default'](eventName).filter(function (evt) {
            return _selectorContains['default'](selector, evt);
          });
        }
      });
    } else {
      throw new Error('Frampton.Events.onSelector given unexpected arguments name: ' + eventName + ', selector: ' + selector);
    }
  }

  module.exports = onSelector;
});
define('frampton-events/once', ['exports', 'module', 'frampton-events/listen'], function (exports, module, _framptonEventsListen) {
  'use strict';

  module.exports = once;

  function once(eventName, target) {
    return _framptonEventsListen.listen(eventName, target).take(1);
  }
});
define('frampton-events/prevent_default', ['exports', 'module', 'frampton-utils/is_function', 'frampton-utils/is_object'], function (exports, module, _framptonUtilsIs_function, _framptonUtilsIs_object) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _isFunction = _interopRequireDefault(_framptonUtilsIs_function);

  var _isObject = _interopRequireDefault(_framptonUtilsIs_object);

  module.exports = function (evt) {
    if (_isObject['default'](evt) && _isFunction['default'](evt.preventDefault) && _isFunction['default'](evt.stopPropagation)) {
      evt.preventDefault();
      evt.stopPropagation();
    }
    return evt;
  };
});
define('frampton-events/selector_cache', ['exports', 'module', 'frampton-events/simple_cache'], function (exports, module, _framptonEventsSimple_cache) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _simpleCahce = _interopRequireDefault(_framptonEventsSimple_cache);

  module.exports = _simpleCahce['default']();
});
define('frampton-events/selector_contains', ['exports', 'module', 'frampton-utils/curry', 'frampton-utils/is_something', 'frampton-events/closest_to_event'], function (exports, module, _framptonUtilsCurry, _framptonUtilsIs_something, _framptonEventsClosest_to_event) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  var _isSomething = _interopRequireDefault(_framptonUtilsIs_something);

  var _closestToEvent = _interopRequireDefault(_framptonEventsClosest_to_event);

  /**
   * selectorContains :: String -> DomEvent -> Boolean
   *
   * Tests if the target of a given event is contained in a node that matches
   * the given selector.
   *
   * @name selectorContains
   * @memberof Frampton.Events
   * @static
   * @param {String} selector
   * @param {Object} evt
   * @returns {Boolean} Is the event contained in a node that matches the given selector
   */
  module.exports = _curry['default'](function selector_contains(selector, evt) {
    return _isSomething['default'](_closestToEvent['default'](selector, evt));
  });
});
define('frampton-events/simple_cache', ['exports', 'module', 'frampton-utils/is_nothing'], function (exports, module, _framptonUtilsIs_nothing) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _isNothing = _interopRequireDefault(_framptonUtilsIs_nothing);

  module.exports = function () {

    var store = {};

    return function (name, fn) {
      if (_isNothing['default'](store[name])) {
        store[name] = fn();
      }
      return store[name];
    };
  };
});
define('frampton-html', ['exports', 'frampton/namespace', 'frampton-html/attribute', 'frampton-html/contains', 'frampton-html/element_value', 'frampton-html/data', 'frampton-html/set_html'], function (exports, _framptonNamespace, _framptonHtmlAttribute, _framptonHtmlContains, _framptonHtmlElement_value, _framptonHtmlData, _framptonHtmlSet_html) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _Frampton = _interopRequireDefault(_framptonNamespace);

  var _attribute = _interopRequireDefault(_framptonHtmlAttribute);

  var _contains = _interopRequireDefault(_framptonHtmlContains);

  var _elementValue = _interopRequireDefault(_framptonHtmlElement_value);

  var _data = _interopRequireDefault(_framptonHtmlData);

  var _set = _interopRequireDefault(_framptonHtmlSet_html);

  /**
   * @name Html
   * @namespace
   * @memberof Frampton
   */
  _Frampton['default'].Html = {};
  _Frampton['default'].Html.attribute = _attribute['default'];
  _Frampton['default'].Html.contains = _contains['default'];
  _Frampton['default'].Html.elementValue = _elementValue['default'];
  _Frampton['default'].Html.data = _data['default'];
  _Frampton['default'].Html.set = _set['default'];
});
define('frampton-html/attribute', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  /**
   * attribute :: String -> Element -> String
   *
   * @name attribute
   * @param {String} name
   * @param {Element} element
   * @returns {*}
   */
  module.exports = _curry['default'](function (name, element) {
    return element.getAttribute(name);
  });
});
define('frampton-html/contains', ['exports', 'module', 'frampton-utils/curry', 'frampton-utils/is_function'], function (exports, module, _framptonUtilsCurry, _framptonUtilsIs_function) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  var _isFunction = _interopRequireDefault(_framptonUtilsIs_function);

  // contains :: Dom -> Dom -> Boolean
  module.exports = _curry['default'](function (parent, child) {
    if (parent === child) {
      return true;
    } else if (_isFunction['default'](parent.contains)) {
      return parent.contains(child);
    } else {
      while (child = child.parentNode) {
        if (parent === child) {
          return true;
        }
        return false;
      }
    }
  });
});
define('frampton-html/data', ['exports', 'module', 'frampton-utils/curry', 'frampton-html/attribute'], function (exports, module, _framptonUtilsCurry, _framptonHtmlAttribute) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  var _attribute = _interopRequireDefault(_framptonHtmlAttribute);

  /**
   * data :: String -> Element -> String
   *
   * @name attribute
   * @param {String} name
   * @param {Element} element
   * @returns {*}
   */
  module.exports = _curry['default'](function (name, element) {
    return _attribute['default']('data-' + name, element);
  });
});
define("frampton-html/element_value", ["exports", "module"], function (exports, module) {
  /**
   * elementValue :: Object -> Any
   *
   * @name elementValue
   * @method
   * @memberof Frampton.Html
   * @param {Object} element
   * @returns {*}
   */
  "use strict";

  module.exports = element_value;

  function element_value(element) {
    return element.value || null;
  }
});
define('frampton-html/set_html', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  module.exports = _curry['default'](function (element, html) {
    element.innerHTML = html;
  });
});
define('frampton-keyboard', ['exports', 'frampton/namespace', 'frampton-keyboard/keyboard', 'frampton-keyboard/utils/key_code', 'frampton-keyboard/utils/is_key', 'frampton-keyboard/utils/is_enter', 'frampton-keyboard/utils/is_esc', 'frampton-keyboard/utils/is_up', 'frampton-keyboard/utils/is_down', 'frampton-keyboard/utils/is_left', 'frampton-keyboard/utils/is_right', 'frampton-keyboard/utils/is_space', 'frampton-keyboard/utils/is_ctrl', 'frampton-keyboard/utils/is_shift'], function (exports, _framptonNamespace, _framptonKeyboardKeyboard, _framptonKeyboardUtilsKey_code, _framptonKeyboardUtilsIs_key, _framptonKeyboardUtilsIs_enter, _framptonKeyboardUtilsIs_esc, _framptonKeyboardUtilsIs_up, _framptonKeyboardUtilsIs_down, _framptonKeyboardUtilsIs_left, _framptonKeyboardUtilsIs_right, _framptonKeyboardUtilsIs_space, _framptonKeyboardUtilsIs_ctrl, _framptonKeyboardUtilsIs_shift) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _Frampton = _interopRequireDefault(_framptonNamespace);

  var _Keyboard = _interopRequireDefault(_framptonKeyboardKeyboard);

  var _keyCode = _interopRequireDefault(_framptonKeyboardUtilsKey_code);

  var _isKey = _interopRequireDefault(_framptonKeyboardUtilsIs_key);

  var _isEnter = _interopRequireDefault(_framptonKeyboardUtilsIs_enter);

  var _isEsc = _interopRequireDefault(_framptonKeyboardUtilsIs_esc);

  var _isUp = _interopRequireDefault(_framptonKeyboardUtilsIs_up);

  var _isDown = _interopRequireDefault(_framptonKeyboardUtilsIs_down);

  var _isLeft = _interopRequireDefault(_framptonKeyboardUtilsIs_left);

  var _isRight = _interopRequireDefault(_framptonKeyboardUtilsIs_right);

  var _isSpace = _interopRequireDefault(_framptonKeyboardUtilsIs_space);

  var _isCtrl = _interopRequireDefault(_framptonKeyboardUtilsIs_ctrl);

  var _isShift = _interopRequireDefault(_framptonKeyboardUtilsIs_shift);

  /**
   * @name Keyboard
   * @namespace
   * @memberof Frampton
   */
  _Frampton['default'].Keyboard = _Keyboard['default'];

  _Frampton['default'].Keyboard.Utils = {};
  _Frampton['default'].Keyboard.Utils.keyCode = _keyCode['default'];
  _Frampton['default'].Keyboard.Utils.isKey = _isKey['default'];
  _Frampton['default'].Keyboard.Utils.isEnter = _isEnter['default'];
  _Frampton['default'].Keyboard.Utils.isEsc = _isEsc['default'];
  _Frampton['default'].Keyboard.Utils.isUp = _isUp['default'];
  _Frampton['default'].Keyboard.Utils.isDown = _isDown['default'];
  _Frampton['default'].Keyboard.Utils.isLeft = _isLeft['default'];
  _Frampton['default'].Keyboard.Utils.isRight = _isRight['default'];
  _Frampton['default'].Keyboard.Utils.isShift = _isShift['default'];
  _Frampton['default'].Keyboard.Utils.isSpace = _isSpace['default'];
  _Frampton['default'].Keyboard.Utils.isCtrl = _isCtrl['default'];
});
define('frampton-keyboard/keyboard', ['exports', 'module', 'frampton-utils/curry', 'frampton-list/contains', 'frampton-list/append', 'frampton-list/remove', 'frampton-events/on_event', 'frampton-signal/stepper', 'frampton-keyboard/utils/key_map', 'frampton-keyboard/utils/key_code'], function (exports, module, _framptonUtilsCurry, _framptonListContains, _framptonListAppend, _framptonListRemove, _framptonEventsOn_event, _framptonSignalStepper, _framptonKeyboardUtilsKey_map, _framptonKeyboardUtilsKey_code) {
  'use strict';

  module.exports = Keyboard;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  var _contains = _interopRequireDefault(_framptonListContains);

  var _append = _interopRequireDefault(_framptonListAppend);

  var _remove = _interopRequireDefault(_framptonListRemove);

  var _onEvent = _interopRequireDefault(_framptonEventsOn_event);

  var _stepper = _interopRequireDefault(_framptonSignalStepper);

  var _KEY_MAP = _interopRequireDefault(_framptonKeyboardUtilsKey_map);

  var _keyCode = _interopRequireDefault(_framptonKeyboardUtilsKey_code);

  //+ keyUp :: Signal DomEvent
  var keyUp = _onEvent['default']('keyup');

  //+ keyDown :: Signal DomEvent
  var keyDown = _onEvent['default']('keydown');

  //+ keyPress :: Signal DomEvent
  var keyPress = _onEvent['default']('keypress');

  //+ keyUpCodes :: Signal KeyCode
  var keyUpCodes = keyUp.map(_keyCode['default']);

  //+ keyDownCodes :: Signal KeyCode
  var keyDownCodes = keyDown.map(_keyCode['default']);

  var addKey = function addKey(keyCode) {
    return function (arr) {
      if (!_contains['default'](arr, keyCode)) {
        return _append['default'](arr, keyCode);
      }
      return arr;
    };
  };

  var removeKey = function removeKey(keyCode) {
    return function (arr) {
      return _remove['default'](keyCode, arr);
    };
  };

  var update = function update(acc, fn) {
    return fn(acc);
  };

  //+ rawEvents :: Signal Function
  var rawEvents = keyUpCodes.map(removeKey).merge(keyDownCodes.map(addKey));

  //+ keysDown :: Signal []
  var keysDown = rawEvents.fold(update, []);

  //+ keyIsDown :: KeyCode -> Signal Boolean
  var keyIsDown = function keyIsDown(keyCode) {
    return keysDown.map(function (arr) {
      return _contains['default'](arr, keyCode);
    });
  };

  //+ direction :: KeyCode -> [KeyCode] -> Boolean
  var direction = _curry['default'](function (keyCode, arr) {
    return _contains['default'](arr, keyCode) ? 1 : 0;
  });

  //+ isUp :: [KeyCode] -> Boolean
  var isUp = direction(_KEY_MAP['default'].UP);

  //+ isDown :: [KeyCode] -> Boolean
  var isDown = direction(_KEY_MAP['default'].DOWN);

  //+ isRight :: [KeyCode] -> Boolean
  var isRight = direction(_KEY_MAP['default'].RIGHT);

  //+ isLeft :: [KeyCode] -> Boolean
  var isLeft = direction(_KEY_MAP['default'].LEFT);

  //+ arrows :: Signal [horizontal, vertical]
  var arrows = keysDown.map(function (arr) {
    return [isRight(arr) - isLeft(arr), isUp(arr) - isDown(arr)];
  });

  var defaultKeyboard = {
    downs: keyDown,
    ups: keyUp,
    presses: keyPress,
    codes: keyUpCodes,
    arrows: _stepper['default']([0, 0], arrows),
    shift: _stepper['default'](false, keyIsDown(_KEY_MAP['default'].SHIFT)),
    ctrl: _stepper['default'](false, keyIsDown(_KEY_MAP['default'].CTRL)),
    escape: _stepper['default'](false, keyIsDown(_KEY_MAP['default'].ESC)),
    enter: _stepper['default'](false, keyIsDown(_KEY_MAP['default'].ENTER)),
    space: _stepper['default'](false, keyIsDown(_KEY_MAP['default'].SPACE))
  };

  function Keyboard() {
    return defaultKeyboard;
  }
});
define('frampton-keyboard/utils/is_ctrl', ['exports', 'module', 'frampton-keyboard/utils/is_key', 'frampton-keyboard/utils/key_map'], function (exports, module, _framptonKeyboardUtilsIs_key, _framptonKeyboardUtilsKey_map) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _isKey = _interopRequireDefault(_framptonKeyboardUtilsIs_key);

  var _KEY_MAP = _interopRequireDefault(_framptonKeyboardUtilsKey_map);

  // is_ctrl :: KeyCode -> Boolean
  module.exports = _isKey['default'](_KEY_MAP['default'].CTRL);
});
define('frampton-keyboard/utils/is_down', ['exports', 'module', 'frampton-keyboard/utils/is_key', 'frampton-keyboard/utils/key_map'], function (exports, module, _framptonKeyboardUtilsIs_key, _framptonKeyboardUtilsKey_map) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _isKey = _interopRequireDefault(_framptonKeyboardUtilsIs_key);

  var _KEY_MAP = _interopRequireDefault(_framptonKeyboardUtilsKey_map);

  // is_down :: KeyCode -> Boolean
  module.exports = _isKey['default'](_KEY_MAP['default'].DOWN);
});
define('frampton-keyboard/utils/is_enter', ['exports', 'module', 'frampton-keyboard/utils/is_key', 'frampton-keyboard/utils/key_map'], function (exports, module, _framptonKeyboardUtilsIs_key, _framptonKeyboardUtilsKey_map) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _isKey = _interopRequireDefault(_framptonKeyboardUtilsIs_key);

  var _KEY_MAP = _interopRequireDefault(_framptonKeyboardUtilsKey_map);

  // is_enter :: KeyCode -> Boolean
  module.exports = _isKey['default'](_KEY_MAP['default'].ENTER);
});
define('frampton-keyboard/utils/is_esc', ['exports', 'module', 'frampton-keyboard/utils/is_key', 'frampton-keyboard/utils/key_map'], function (exports, module, _framptonKeyboardUtilsIs_key, _framptonKeyboardUtilsKey_map) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _isKey = _interopRequireDefault(_framptonKeyboardUtilsIs_key);

  var _KEY_MAP = _interopRequireDefault(_framptonKeyboardUtilsKey_map);

  // is_esc :: KeyCode -> Boolean
  module.exports = _isKey['default'](_KEY_MAP['default'].ESC);
});
define('frampton-keyboard/utils/is_key', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  // isKey :: KeyCode -> KeyCode -> Boolean
  module.exports = _curry['default'](function is_key(key, keyCode) {
    return key === keyCode;
  });
});
define('frampton-keyboard/utils/is_left', ['exports', 'module', 'frampton-keyboard/utils/is_key', 'frampton-keyboard/utils/key_map'], function (exports, module, _framptonKeyboardUtilsIs_key, _framptonKeyboardUtilsKey_map) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _isKey = _interopRequireDefault(_framptonKeyboardUtilsIs_key);

  var _KEY_MAP = _interopRequireDefault(_framptonKeyboardUtilsKey_map);

  // is_left :: KeyCode -> Boolean
  module.exports = _isKey['default'](_KEY_MAP['default'].LEFT);
});
define('frampton-keyboard/utils/is_right', ['exports', 'module', 'frampton-keyboard/utils/is_key', 'frampton-keyboard/utils/key_map'], function (exports, module, _framptonKeyboardUtilsIs_key, _framptonKeyboardUtilsKey_map) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _isKey = _interopRequireDefault(_framptonKeyboardUtilsIs_key);

  var _KEY_MAP = _interopRequireDefault(_framptonKeyboardUtilsKey_map);

  // is_right :: KeyCode -> Boolean
  module.exports = _isKey['default'](_KEY_MAP['default'].RIGHT);
});
define('frampton-keyboard/utils/is_shift', ['exports', 'module', 'frampton-keyboard/utils/is_key', 'frampton-keyboard/utils/key_map'], function (exports, module, _framptonKeyboardUtilsIs_key, _framptonKeyboardUtilsKey_map) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _isKey = _interopRequireDefault(_framptonKeyboardUtilsIs_key);

  var _KEY_MAP = _interopRequireDefault(_framptonKeyboardUtilsKey_map);

  // is_shift :: KeyCode -> Boolean
  module.exports = _isKey['default'](_KEY_MAP['default'].SHIFT);
});
define('frampton-keyboard/utils/is_space', ['exports', 'module', 'frampton-keyboard/utils/is_key', 'frampton-keyboard/utils/key_map'], function (exports, module, _framptonKeyboardUtilsIs_key, _framptonKeyboardUtilsKey_map) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _isKey = _interopRequireDefault(_framptonKeyboardUtilsIs_key);

  var _KEY_MAP = _interopRequireDefault(_framptonKeyboardUtilsKey_map);

  // is_space :: KeyCode -> Boolean
  module.exports = _isKey['default'](_KEY_MAP['default'].SPACE);
});
define('frampton-keyboard/utils/is_up', ['exports', 'module', 'frampton-keyboard/utils/is_key', 'frampton-keyboard/utils/key_map'], function (exports, module, _framptonKeyboardUtilsIs_key, _framptonKeyboardUtilsKey_map) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _isKey = _interopRequireDefault(_framptonKeyboardUtilsIs_key);

  var _KEY_MAP = _interopRequireDefault(_framptonKeyboardUtilsKey_map);

  // is_up :: KeyCode -> Boolean
  module.exports = _isKey['default'](_KEY_MAP['default'].UP);
});
define('frampton-keyboard/utils/key_code', ['exports', 'module', 'frampton-utils/get'], function (exports, module, _framptonUtilsGet) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _get = _interopRequireDefault(_framptonUtilsGet);

  // key_code :: DomEvent -> KeyCode
  module.exports = _get['default']('keyCode');
});
define("frampton-keyboard/utils/key_map", ["exports", "module"], function (exports, module) {
  "use strict";

  module.exports = {
    ENTER: 13,
    ESC: 27,
    SPACE: 32,
    CTRL: 17,
    SHIFT: 16,
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39
  };
});
define('frampton-list', ['exports', 'frampton/namespace', 'frampton-list/add', 'frampton-list/append', 'frampton-list/contains', 'frampton-list/copy', 'frampton-list/diff', 'frampton-list/drop', 'frampton-list/each', 'frampton-list/filter', 'frampton-list/find', 'frampton-list/first', 'frampton-list/foldl', 'frampton-list/foldr', 'frampton-list/init', 'frampton-list/last', 'frampton-list/length', 'frampton-list/max', 'frampton-list/min', 'frampton-list/prepend', 'frampton-list/product', 'frampton-list/remove', 'frampton-list/remove_index', 'frampton-list/replace', 'frampton-list/replace_index', 'frampton-list/reverse', 'frampton-list/second', 'frampton-list/split', 'frampton-list/sum', 'frampton-list/tail', 'frampton-list/take', 'frampton-list/third', 'frampton-list/zip'], function (exports, _framptonNamespace, _framptonListAdd, _framptonListAppend, _framptonListContains, _framptonListCopy, _framptonListDiff, _framptonListDrop, _framptonListEach, _framptonListFilter, _framptonListFind, _framptonListFirst, _framptonListFoldl, _framptonListFoldr, _framptonListInit, _framptonListLast, _framptonListLength, _framptonListMax, _framptonListMin, _framptonListPrepend, _framptonListProduct, _framptonListRemove, _framptonListRemove_index, _framptonListReplace, _framptonListReplace_index, _framptonListReverse, _framptonListSecond, _framptonListSplit, _framptonListSum, _framptonListTail, _framptonListTake, _framptonListThird, _framptonListZip) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _Frampton = _interopRequireDefault(_framptonNamespace);

  var _add = _interopRequireDefault(_framptonListAdd);

  var _append = _interopRequireDefault(_framptonListAppend);

  var _contains = _interopRequireDefault(_framptonListContains);

  var _copy = _interopRequireDefault(_framptonListCopy);

  var _diff = _interopRequireDefault(_framptonListDiff);

  var _drop = _interopRequireDefault(_framptonListDrop);

  var _each = _interopRequireDefault(_framptonListEach);

  var _filter = _interopRequireDefault(_framptonListFilter);

  var _find = _interopRequireDefault(_framptonListFind);

  var _first = _interopRequireDefault(_framptonListFirst);

  var _foldl = _interopRequireDefault(_framptonListFoldl);

  var _foldr = _interopRequireDefault(_framptonListFoldr);

  var _init = _interopRequireDefault(_framptonListInit);

  var _last = _interopRequireDefault(_framptonListLast);

  var _length = _interopRequireDefault(_framptonListLength);

  var _max = _interopRequireDefault(_framptonListMax);

  var _min = _interopRequireDefault(_framptonListMin);

  var _prepend = _interopRequireDefault(_framptonListPrepend);

  var _product = _interopRequireDefault(_framptonListProduct);

  var _remove = _interopRequireDefault(_framptonListRemove);

  var _removeAt = _interopRequireDefault(_framptonListRemove_index);

  var _replace = _interopRequireDefault(_framptonListReplace);

  var _replaceAt = _interopRequireDefault(_framptonListReplace_index);

  var _reverse = _interopRequireDefault(_framptonListReverse);

  var _second = _interopRequireDefault(_framptonListSecond);

  var _split = _interopRequireDefault(_framptonListSplit);

  var _sum = _interopRequireDefault(_framptonListSum);

  var _tail = _interopRequireDefault(_framptonListTail);

  var _take = _interopRequireDefault(_framptonListTake);

  var _third = _interopRequireDefault(_framptonListThird);

  var _zip = _interopRequireDefault(_framptonListZip);

  /**
   * @name List
   * @namespace
   * @memberof Frampton
   */
  _Frampton['default'].List = {};
  _Frampton['default'].List.add = _add['default'];
  _Frampton['default'].List.append = _append['default'];
  _Frampton['default'].List.contains = _contains['default'];
  _Frampton['default'].List.copy = _copy['default'];
  _Frampton['default'].List.diff = _diff['default'];
  _Frampton['default'].List.drop = _drop['default'];
  _Frampton['default'].List.each = _each['default'];
  _Frampton['default'].List.filter = _filter['default'];
  _Frampton['default'].List.find = _find['default'];
  _Frampton['default'].List.foldl = _foldl['default'];
  _Frampton['default'].List.foldr = _foldr['default'];
  _Frampton['default'].List.first = _first['default'];
  _Frampton['default'].List.second = _second['default'];
  _Frampton['default'].List.third = _third['default'];
  _Frampton['default'].List.init = _init['default'];
  _Frampton['default'].List.last = _last['default'];
  _Frampton['default'].List.length = _length['default'];
  _Frampton['default'].List.max = _max['default'];
  _Frampton['default'].List.min = _min['default'];
  _Frampton['default'].List.prepend = _prepend['default'];
  _Frampton['default'].List.product = _product['default'];
  _Frampton['default'].List.remove = _remove['default'];
  _Frampton['default'].List.removeAt = _removeAt['default'];
  _Frampton['default'].List.replace = _replace['default'];
  _Frampton['default'].List.replaceAt = _replaceAt['default'];
  _Frampton['default'].List.reverse = _reverse['default'];
  _Frampton['default'].List.split = _split['default'];
  _Frampton['default'].List.sum = _sum['default'];
  _Frampton['default'].List.tail = _tail['default'];
  _Frampton['default'].List.take = _take['default'];
  _Frampton['default'].List.zip = _zip['default'];
});
define('frampton-list/add', ['exports', 'module', 'frampton-utils/curry', 'frampton-list/contains', 'frampton-list/append', 'frampton-list/copy'], function (exports, module, _framptonUtilsCurry, _framptonListContains, _framptonListAppend, _framptonListCopy) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  var _contains = _interopRequireDefault(_framptonListContains);

  var _append = _interopRequireDefault(_framptonListAppend);

  var _copy = _interopRequireDefault(_framptonListCopy);

  /**
   * @name addToList
   * @method
   * @memberof Frampton.List
   * @param {Array} xs  Array to add object to
   * @param {*}   obj Object to add to array
   * @returns {Array} A new array with the object added
   */
  module.exports = _curry['default'](function add_to_list(xs, obj) {
    return !_contains['default'](xs, obj) ? _append['default'](xs, obj) : _copy['default'](xs);
  });
});
define('frampton-list/append', ['exports', 'module', 'frampton-utils/curry', 'frampton-utils/is_something', 'frampton-list/length'], function (exports, module, _framptonUtilsCurry, _framptonUtilsIs_something, _framptonListLength) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  var _isSomething = _interopRequireDefault(_framptonUtilsIs_something);

  var _length = _interopRequireDefault(_framptonListLength);

  /**
   * @name append
   * @method
   * @memberof Frampton.List
   * @param {Array} xs
   * @param {*} obj
   * @returns {Array}
   */
  module.exports = _curry['default'](function (xs, obj) {
    if (_isSomething['default'](obj)) {
      var len = _length['default'](xs);
      var newArray = new Array(len + 1);
      for (var i = 0; i < len; i++) {
        newArray[i] = xs[i];
      }
      newArray[len] = obj;
      return Object.freeze(newArray);
    } else {
      return xs;
    }
  });
});
define('frampton-list/at', ['exports', 'module', 'frampton-utils/curry', 'frampton-utils/assert', 'frampton-utils/is_defined', 'frampton-utils/is_array'], function (exports, module, _framptonUtilsCurry, _framptonUtilsAssert, _framptonUtilsIs_defined, _framptonUtilsIs_array) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  var _assert = _interopRequireDefault(_framptonUtilsAssert);

  var _isDefined = _interopRequireDefault(_framptonUtilsIs_defined);

  var _isArray = _interopRequireDefault(_framptonUtilsIs_array);

  /**
   * @name at
   * @method
   * @memberof Frampton.List
   */
  module.exports = _curry['default'](function at(index, xs) {
    _assert['default']("Frampton.List.at recieved a non-array", _isArray['default'](xs));
    return _isDefined['default'](xs[index]) ? xs[index] : null;
  });
});
define('frampton-list/contains', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  /**
   * @name contains
   * @method
   * @memberof Frampton.List
   * @param {Array} xs
   * @param {*}   obj
   * @retruns {Boolean}
   */
  module.exports = _curry['default'](function (xs, obj) {
    return xs.indexOf(obj) > -1;
  });
});
define('frampton-list/copy', ['exports', 'module', 'frampton-list/length'], function (exports, module, _framptonListLength) {
  'use strict';

  module.exports = copy;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _length = _interopRequireDefault(_framptonListLength);

  /**
   * @name copy
   * @method
   * @memberof Frampton.List
   */

  function copy(xs, begin, end) {

    var argLen = _length['default'](xs),
        idx = 0,
        arrLen,
        arr,
        i;

    begin = begin || 0;
    end = end || argLen;
    arrLen = end - begin;

    if (argLen > 0) {
      arr = new Array(arrLen);
      for (i = begin; i < end; i++) {
        arr[idx++] = xs[i];
      }
    }

    return Object.freeze(arr || []);
  }
});
define('frampton-list/diff', ['exports', 'module', 'frampton-utils/curry', 'frampton-list/contains', 'frampton-list/each'], function (exports, module, _framptonUtilsCurry, _framptonListContains, _framptonListEach) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  var _contains = _interopRequireDefault(_framptonListContains);

  var _each = _interopRequireDefault(_framptonListEach);

  /**
   * @name diff
   * @method
   * @memberof Frampton.List
   * @returns {Array}
   */
  module.exports = _curry['default'](function curried_diff(xs, ys) {

    var diff = [];

    _each['default'](function (item) {
      if (!_contains['default'](ys, item)) {
        diff.push(item);
      }
    }, xs);

    return Object.freeze(diff);
  });
});
define('frampton-list/drop', ['exports', 'module', 'frampton-utils/assert', 'frampton-utils/curry', 'frampton-utils/is_array', 'frampton-list/filter'], function (exports, module, _framptonUtilsAssert, _framptonUtilsCurry, _framptonUtilsIs_array, _framptonListFilter) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _assert = _interopRequireDefault(_framptonUtilsAssert);

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  var _isArray = _interopRequireDefault(_framptonUtilsIs_array);

  var _filter = _interopRequireDefault(_framptonListFilter);

  /**
   * @name drop
   * @method
   * @memberof Frampton.List
   */
  module.exports = _curry['default'](function curried_drop(n, xs) {
    _assert['default']("Frampton.List.drop recieved a non-array", _isArray['default'](xs));
    return _filter['default'](function (next) {
      if (n === 0) {
        return true;
      } else {
        n--;
      }
      return false;
    }, xs);
  });
});
define('frampton-list/each', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  /**
   * @name each
   * @method
   * @memberof Frampton.List
   * @param {Functino} fn Function to run on each element
   * @param {Array} xs Array to
   */
  module.exports = _curry['default'](function curried_each(fn, xs) {
    var len = xs.length;
    for (var i = 0; i < len; i++) {
      fn(xs[i], i);
    }
  });
});
define('frampton-list/filter', ['exports', 'module', 'frampton-utils/curry', 'frampton-list/length'], function (exports, module, _framptonUtilsCurry, _framptonListLength) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  var _length = _interopRequireDefault(_framptonListLength);

  /**
   * @name filter
   * @method
   * @memberof Frampton.List
   * @param {Function} predicate
   * @param {Array} xs
   * @returns {Array} A new array
   */
  module.exports = _curry['default'](function filter(predicate, xs) {

    var len = _length['default'](xs);
    var newList = [];

    for (var i = 0; i < len; i++) {
      if (predicate(xs[i])) {
        newList.push(xs[i]);
      }
    }

    return Object.freeze(newList);
  });
});
define('frampton-list/find', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  module.exports = _curry['default'](function (obj, xs) {
    return xs.indexOf(obj);
  });
});
define('frampton-list/first', ['exports', 'module', 'frampton-list/at'], function (exports, module, _framptonListAt) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _at = _interopRequireDefault(_framptonListAt);

  /**
   * @name first
   * @method
   * @memberof Frampton.List
   */
  module.exports = _at['default'](0);
});
define('frampton-list/foldl', ['exports', 'module', 'frampton-utils/assert', 'frampton-utils/curry_n', 'frampton-utils/is_array'], function (exports, module, _framptonUtilsAssert, _framptonUtilsCurry_n, _framptonUtilsIs_array) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _assert = _interopRequireDefault(_framptonUtilsAssert);

  var _curryN = _interopRequireDefault(_framptonUtilsCurry_n);

  var _isArray = _interopRequireDefault(_framptonUtilsIs_array);

  /**
   * @name foldl
   * @method
   * @memberof Frampton.List
   */
  module.exports = _curryN['default'](3, function curried_foldl(fn, acc, xs) {
    _assert['default']("Frampton.List.foldl recieved a non-array", _isArray['default'](xs));
    var len = xs.length;
    for (var i = 0; i < len; i++) {
      acc = fn(acc, xs[i]);
    }
    return acc;
  });
});
define('frampton-list/foldr', ['exports', 'module', 'frampton-utils/assert', 'frampton-utils/curry_n', 'frampton-utils/is_array'], function (exports, module, _framptonUtilsAssert, _framptonUtilsCurry_n, _framptonUtilsIs_array) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _assert = _interopRequireDefault(_framptonUtilsAssert);

  var _curryN = _interopRequireDefault(_framptonUtilsCurry_n);

  var _isArray = _interopRequireDefault(_framptonUtilsIs_array);

  /**
   * @name foldr
   * @method
   * @memberof Frampton.List
   */
  module.exports = _curryN['default'](3, function curried_foldr(fn, acc, xs) {
    _assert['default']("Frampton.List.foldr recieved a non-array", _isArray['default'](xs));
    var len = xs.length;
    while (len--) {
      acc = fn(acc, xs[len]);
    }
    return acc;
  });
});
define('frampton-list/init', ['exports', 'module', 'frampton-utils/assert', 'frampton-utils/is_array'], function (exports, module, _framptonUtilsAssert, _framptonUtilsIs_array) {
  'use strict';

  module.exports = init;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _assert = _interopRequireDefault(_framptonUtilsAssert);

  var _isArray = _interopRequireDefault(_framptonUtilsIs_array);

  /**
   * @name init
   * @method
   * @memberof Frampton.List
   */

  function init(xs) {
    _assert['default']("Frampton.List.init recieved a non-array", _isArray['default'](xs));
    switch (xs.length) {

      case 0:
        return Object.freeze([]);

      default:
        return Object.freeze(xs.slice(0, xs.length - 1));
    }
  }
});
define('frampton-list/last', ['exports', 'module', 'frampton-utils/assert', 'frampton-utils/is_array'], function (exports, module, _framptonUtilsAssert, _framptonUtilsIs_array) {
  'use strict';

  module.exports = last;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _assert = _interopRequireDefault(_framptonUtilsAssert);

  var _isArray = _interopRequireDefault(_framptonUtilsIs_array);

  /**
   * @name last
   * @method
   * @memberof Frampton.List
   */

  function last(xs) {
    _assert['default']("Frampton.List.last recieved a non-array", _isArray['default'](xs));
    switch (xs.length) {

      case 0:
        return null;

      default:
        return xs[xs.length - 1];
    }
  }
});
define('frampton-list/length', ['exports', 'module', 'frampton-utils/is_something', 'frampton-utils/is_defined'], function (exports, module, _framptonUtilsIs_something, _framptonUtilsIs_defined) {
  'use strict';

  module.exports = length;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _isSomething = _interopRequireDefault(_framptonUtilsIs_something);

  var _isDefined = _interopRequireDefault(_framptonUtilsIs_defined);

  /**
   * @name length
   * @method
   * @memberof Frampton.List
   */

  function length(xs) {
    return _isSomething['default'](xs) && _isDefined['default'](xs.length) ? xs.length : 0;
  }
});
define('frampton-list/max', ['exports', 'module', 'frampton-list/foldl', 'frampton-utils/is_nothing'], function (exports, module, _framptonListFoldl, _framptonUtilsIs_nothing) {
  'use strict';

  module.exports = maximum;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _foldl = _interopRequireDefault(_framptonListFoldl);

  var _isNothing = _interopRequireDefault(_framptonUtilsIs_nothing);

  /**
   * @name maximum
   * @method
   * @memberof Frampton.List
   * @param {Array} xs
   */

  function maximum(xs) {
    return _foldl['default'](function (acc, next) {
      if (_isNothing['default'](acc) || next > acc) {
        acc = next;
      }
      return acc;
    }, null, xs);
  }
});
define('frampton-list/min', ['exports', 'module', 'frampton-list/foldl', 'frampton-utils/is_nothing'], function (exports, module, _framptonListFoldl, _framptonUtilsIs_nothing) {
  'use strict';

  module.exports = min;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _foldl = _interopRequireDefault(_framptonListFoldl);

  var _isNothing = _interopRequireDefault(_framptonUtilsIs_nothing);

  /**
   * @name min
   * @method
   * @memberof Frampton.List
   * @param {Array} xs
   */

  function min(xs) {
    return _foldl['default'](function (acc, next) {
      if (_isNothing['default'](acc) || next < acc) {
        acc = next;
      }
      return acc;
    }, null, xs);
  }
});
define('frampton-list/prepend', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  /**
   * @name prepend
   * @method
   * @memberof Frampton.List
   * @param {Array} xs
   * @param {*} obj
   */
  module.exports = _curry['default'](function (xs, obj) {
    return Object.freeze([].concat(obj).concat(xs));
  });
});
define('frampton-list/product', ['exports', 'module', 'frampton-list/foldl'], function (exports, module, _framptonListFoldl) {
  'use strict';

  module.exports = product;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _foldl = _interopRequireDefault(_framptonListFoldl);

  /**
   * @name product
   * @method
   * @memberof Frampton.List
   * @param {Array} xs
   */

  function product(xs) {
    return _foldl['default'](function (acc, next) {
      return acc * next;
    }, 1, xs);
  }
});
define('frampton-list/remove_index', ['exports', 'module', 'frampton-list/length'], function (exports, module, _framptonListLength) {
  'use strict';

  module.exports = remove_index;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _length = _interopRequireDefault(_framptonListLength);

  /**
   * @name removeIndex
   * @method
   * @memberof Frampton.List
   * @param {Number} index
   * @param {Array} xs
   * @returns {Array} A new array
   */

  function remove_index(index, xs) {

    var len = _length['default'](xs);
    var newList = [];

    for (var i = 0; i < len; i++) {
      if (i !== index) {
        newList.push(xs[i]);
      }
    }

    return Object.freeze(newList);
  }
});
define('frampton-list/remove', ['exports', 'module', 'frampton-utils/curry', 'frampton-list/filter'], function (exports, module, _framptonUtilsCurry, _framptonListFilter) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  var _filter = _interopRequireDefault(_framptonListFilter);

  /**
   * remove :: List a -> Any a -> List a
   *
   * @name remove
   * @method
   * @memberof Frampton.List
   * @param {Array} xs
   * @param {Object} obj
   */
  module.exports = _curry['default'](function curried_remove(obj, xs) {
    return _filter['default'](function (next) {
      return next !== obj;
    }, xs);
  });
});
define('frampton-list/replace_index', ['exports', 'module', 'frampton-utils/curry', 'frampton-list/length'], function (exports, module, _framptonUtilsCurry, _framptonListLength) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  var _length = _interopRequireDefault(_framptonListLength);

  module.exports = _curry['default'](function replace_index(index, obj, xs) {
    var len = _length['default'](xs);
    var newArray = new Array(len);
    for (var i = 0; i < len; i++) {
      if (i === index) {
        newArray[i] = obj;
      } else {
        newArray[i] = xs[i];
      }
    }
    return Object.freeze(newArray);
  });
});
define('frampton-list/replace', ['exports', 'module', 'frampton-utils/curry', 'frampton-list/find', 'frampton-list/replace_index'], function (exports, module, _framptonUtilsCurry, _framptonListFind, _framptonListReplace_index) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  var _find = _interopRequireDefault(_framptonListFind);

  var _replaceIndex = _interopRequireDefault(_framptonListReplace_index);

  module.exports = _curry['default'](function replace(oldObj, newObj, xs) {
    var index = _find['default'](oldObj, xs);
    if (index > -1) {
      return _replaceIndex['default'](index, newObj, xs);
    } else {
      return xs;
    }
  });
});
define('frampton-list/reverse', ['exports', 'module', 'frampton-list/foldr'], function (exports, module, _framptonListFoldr) {
  'use strict';

  module.exports = reverse;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _foldr = _interopRequireDefault(_framptonListFoldr);

  /**
   * reverse :: List a -> List a
   *
   * @name reverse
   * @method
   * @memberof Frampton.List
   */

  function reverse(xs) {
    return Object.freeze(_foldr['default'](function (acc, next) {
      acc.push(next);
      return acc;
    }, [], xs));
  }
});
define('frampton-list/second', ['exports', 'module', 'frampton-list/at'], function (exports, module, _framptonListAt) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _at = _interopRequireDefault(_framptonListAt);

  /**
   * @name second
   * @method
   * @memberof Frampton.List
   */
  module.exports = _at['default'](1);
});
define('frampton-list/split', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  /**
   * split :: Number -> List a -> (List a, List a)
   *
   * @name split
   * @method
   * @memberof Frampton.List
   */
  module.exports = _curry['default'](function split(n, xs) {
    var ys = [];
    var zs = [];
    var len = xs.length;

    for (var i = 0; i < len; i++) {
      if (i < n) {
        ys.push(xs[i]);
      } else {
        zs.push(xs[i]);
      }
    }

    return Object.freeze([ys, zs]);
  });
});
define('frampton-list/sum', ['exports', 'module', 'frampton-list/foldl'], function (exports, module, _framptonListFoldl) {
  'use strict';

  module.exports = sum;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _foldl = _interopRequireDefault(_framptonListFoldl);

  /**
   * + sum :: Number a => List a -> a
   *
   * @name sum
   * @method
   * @memberof Frampton.List
   * @param {Array} xs
   */

  function sum(xs) {
    return _foldl['default'](function (acc, next) {
      return acc + next;
    }, 0, xs);
  }
});
define('frampton-list/tail', ['exports', 'module', 'frampton-utils/assert', 'frampton-utils/is_array'], function (exports, module, _framptonUtilsAssert, _framptonUtilsIs_array) {
  /**
   * @name tail
   * @method
   * @memberof Frampton.List
   */
  'use strict';

  module.exports = tail;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _assert = _interopRequireDefault(_framptonUtilsAssert);

  var _isArray = _interopRequireDefault(_framptonUtilsIs_array);

  function tail(xs) {
    _assert['default']("Frampton.List.tail recieved a non-array", _isArray['default'](xs));
    switch (xs.length) {
      case 0:
        return Object.freeze([]);
      default:
        return Object.freeze(xs.slice(1));
    }
  }
});
define('frampton-list/take', ['exports', 'module', 'frampton-utils/assert', 'frampton-utils/curry', 'frampton-utils/is_array', 'frampton-math/min'], function (exports, module, _framptonUtilsAssert, _framptonUtilsCurry, _framptonUtilsIs_array, _framptonMathMin) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _assert = _interopRequireDefault(_framptonUtilsAssert);

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  var _isArray = _interopRequireDefault(_framptonUtilsIs_array);

  var _min = _interopRequireDefault(_framptonMathMin);

  module.exports = _curry['default'](function take(num, xs) {
    _assert['default']("Frampton.List.take recieved a non-array", _isArray['default'](xs));
    var newList = [];
    var len = _min['default'](xs.length, num);
    for (var i = 0; i < len; i++) {
      newList.push(xs[i]);
    }
    return newList;
  });
});
define('frampton-list/third', ['exports', 'module', 'frampton-list/at'], function (exports, module, _framptonListAt) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _at = _interopRequireDefault(_framptonListAt);

  /**
   * @name third
   * @method
   * @memberof Frampton.List
   */
  module.exports = _at['default'](2);
});
define('frampton-list/zip', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  /**
   * zip :: List a -> List b - List (a, b)
   *
   * @name zip
   * @method
   * @memberof Frampton.List
   * @param {Array} xs
   * @param {Array} ys
   */
  module.exports = _curry['default'](function zip_array(xs, ys) {

    var xLen = xs.length;
    var yLen = ys.length;
    var len = xLen > yLen ? yLen : xLen;
    var zs = new Array(len);

    for (var i = 0; i < len; i++) {
      zs[i] = [xs[i], ys[i]];
    }

    return Object.freeze(zs);
  });
});
define('frampton-math', ['exports', 'frampton/namespace', 'frampton-math/add', 'frampton-math/subtract', 'frampton-math/multiply', 'frampton-math/divide', 'frampton-math/modulo', 'frampton-math/max', 'frampton-math/min'], function (exports, _framptonNamespace, _framptonMathAdd, _framptonMathSubtract, _framptonMathMultiply, _framptonMathDivide, _framptonMathModulo, _framptonMathMax, _framptonMathMin) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _Frampton = _interopRequireDefault(_framptonNamespace);

  var _add = _interopRequireDefault(_framptonMathAdd);

  var _subtract = _interopRequireDefault(_framptonMathSubtract);

  var _multiply = _interopRequireDefault(_framptonMathMultiply);

  var _divide = _interopRequireDefault(_framptonMathDivide);

  var _modulo = _interopRequireDefault(_framptonMathModulo);

  var _max = _interopRequireDefault(_framptonMathMax);

  var _min = _interopRequireDefault(_framptonMathMin);

  /**
   * @name Math
   * @namespace
   * @memberof Frampton
   */
  _Frampton['default'].Math = {};
  _Frampton['default'].Math.add = _add['default'];
  _Frampton['default'].Math.subtract = _subtract['default'];
  _Frampton['default'].Math.multiply = _multiply['default'];
  _Frampton['default'].Math.divide = _divide['default'];
  _Frampton['default'].Math.modulo = _modulo['default'];
  _Frampton['default'].Math.max = _max['default'];
  _Frampton['default'].Math.min = _min['default'];
});
define('frampton-math/add', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  /**
   * @name add
   * @method
   * @memberof Frampton.Math
   * @param {Number} left
   * @param {Number} right
   * @returns {Number}
   */
  module.exports = _curry['default'](function add(left, right) {
    return left + right;
  });
});
define('frampton-math/divide', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  /**
   * @name divide
   * @method
   * @memberof Frampton.Math
   * @param {Number} left
   * @param {Number} right
   * @returns {Number}
   */
  module.exports = _curry['default'](function divide(left, right) {
    return left / right;
  });
});
define('frampton-math/max', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  /**
   * @name max
   * @method
   * @memberof Frampton.Math
   * @param {Number} left - First number to test
   * @param {Number} right - Second number to test
   * @returns {Number} The larger of the two numbers
   */
  module.exports = _curry['default'](function max(left, right) {
    return left > right ? left : right;
  });
});
define('frampton-math/min', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  /**
   * @name min
   * @method
   * @memberof Frampton.Math
   * @param {Number} left - First number to test
   * @param {Number} right - Second number to test
   * @returns {Number} The smaller of the two numbers
   */
  module.exports = _curry['default'](function min(left, right) {
    return left < right ? left : right;
  });
});
define('frampton-math/modulo', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  /**
   * @name modulo
   * @method
   * @memberof Frampton.Math
   * @param {Number} left
   * @param {Number} right
   * @returns {Number}
   */
  module.exports = _curry['default'](function modulo(left, right) {
    return left % right;
  });
});
define('frampton-math/multiply', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  /**
   * @name multiply
   * @method
   * @memberof Frampton.Math
   * @param {Number} a
   * @param {Number} b
   * @returns {Number}
   */
  module.exports = _curry['default'](function multiply(a, b) {
    return a * b;
  });
});
define('frampton-math/subtract', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  /**
   * @name subtract
   * @method
   * @memberof Frampton.Math
   * @param {Number} left
   * @param {Number} right
   * @returns {Number}
   */
  module.exports = _curry['default'](function (left, right) {
    return left - right;
  });
});
define('frampton-mouse', ['exports', 'frampton/namespace', 'frampton-mouse/mouse'], function (exports, _framptonNamespace, _framptonMouseMouse) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _Frampton = _interopRequireDefault(_framptonNamespace);

  var _Mouse = _interopRequireDefault(_framptonMouseMouse);

  _Frampton['default'].Mouse = _Mouse['default'];
});
define('frampton-mouse/mouse', ['exports', 'module', 'frampton-signal/stepper', 'frampton-events/on_event', 'frampton-events/contains', 'frampton-events/get_position', 'frampton-events/get_position_relative'], function (exports, module, _framptonSignalStepper, _framptonEventsOn_event, _framptonEventsContains, _framptonEventsGet_position, _framptonEventsGet_position_relative) {
  'use strict';

  module.exports = Mouse;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _stepper = _interopRequireDefault(_framptonSignalStepper);

  var _onEvent = _interopRequireDefault(_framptonEventsOn_event);

  var _contains = _interopRequireDefault(_framptonEventsContains);

  var _getPosition = _interopRequireDefault(_framptonEventsGet_position);

  var _getPositionRelative = _interopRequireDefault(_framptonEventsGet_position_relative);

  var clicks = _onEvent['default']('click');
  var downs = _onEvent['default']('mousedown');
  var ups = _onEvent['default']('mouseup');
  var moves = _onEvent['default']('mousemove');
  var isDown = _stepper['default'](false, downs.map(true).merge(ups.map(false)));

  var defaultMouse = {
    clicks: clicks,
    downs: downs,
    ups: ups,
    position: _stepper['default']([0, 0], moves.map(_getPosition['default'])),
    isDown: isDown
  };

  /**
   * @name Mouse
   * @memberof Frampton
   * @class
   */

  function Mouse(element) {
    if (!element) {
      return defaultMouse;
    } else {
      return {
        clicks: clicks.filter(_contains['default'](element)),
        downs: downs.filter(_contains['default'](element)),
        ups: ups.filter(_contains['default'](element)),
        position: _stepper['default']([0, 0], moves.filter(_contains['default'](element)).map(_getPositionRelative['default'](element))),
        isDown: isDown
      };
    }
  }
});
define('frampton-record', ['exports', 'frampton/namespace', 'frampton-record/filter', 'frampton-record/reduce', 'frampton-record/map', 'frampton-record/merge', 'frampton-record/for_each', 'frampton-record/as_list', 'frampton-record/copy', 'frampton-record/update'], function (exports, _framptonNamespace, _framptonRecordFilter, _framptonRecordReduce, _framptonRecordMap, _framptonRecordMerge, _framptonRecordFor_each, _framptonRecordAs_list, _framptonRecordCopy, _framptonRecordUpdate) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _Frampton = _interopRequireDefault(_framptonNamespace);

  var _filter = _interopRequireDefault(_framptonRecordFilter);

  var _reduce = _interopRequireDefault(_framptonRecordReduce);

  var _map = _interopRequireDefault(_framptonRecordMap);

  var _merge = _interopRequireDefault(_framptonRecordMerge);

  var _forEach = _interopRequireDefault(_framptonRecordFor_each);

  var _asList = _interopRequireDefault(_framptonRecordAs_list);

  var _copy = _interopRequireDefault(_framptonRecordCopy);

  var _update = _interopRequireDefault(_framptonRecordUpdate);

  /**
   * @name Record
   * @namespace
   * @memberof Frampton
   */
  _Frampton['default'].Record = {};
  _Frampton['default'].Record.copy = _copy['default'];
  _Frampton['default'].Record.update = _update['default'];
  _Frampton['default'].Record.filter = _filter['default'];
  _Frampton['default'].Record.reduce = _reduce['default'];
  _Frampton['default'].Record.map = _map['default'];
  _Frampton['default'].Record.each = _forEach['default'];
  _Frampton['default'].Record.asList = _asList['default'];
  _Frampton['default'].Record.merge = _merge['default'];
});
define('frampton-record/as_list', ['exports', 'module', 'frampton-record/reduce'], function (exports, module, _framptonRecordReduce) {
  'use strict';

  module.exports = as_list;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _reduce = _interopRequireDefault(_framptonRecordReduce);

  // as_list :: Object -> Array [String, *]
  /**
   * @name as_list
   * @method
   * @memberof Frampton.Record
   * @param {Object} obj Object to transform
   * @returns {Array}
   */

  function as_list(obj) {
    return Object.freeze(_reduce['default'](function (acc, nextValue, nextKey) {
      acc.push([nextKey, nextValue]);
      return acc;
    }, [], obj));
  }
});
define('frampton-record/copy', ['exports', 'module', 'frampton-record/for_each'], function (exports, module, _framptonRecordFor_each) {
  'use strict';

  module.exports = copy_object;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _forEach = _interopRequireDefault(_framptonRecordFor_each);

  /**
   * copy :: Object -> Object
   *
   * @name copy
   * @method
   * @memberof Frampton.Object
   * @param {Object} obj object to copy
   * @returns {Object}
   */

  function copy_object(obj) {

    var newObj = {};

    _forEach['default'](function (value, key) {
      newObj[key] = value;
    }, obj);

    return Object.freeze(newObj);
  }
});
define('frampton-record/filter', ['exports', 'module', 'frampton-utils/curry', 'frampton-record/for_each'], function (exports, module, _framptonUtilsCurry, _framptonRecordFor_each) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  var _forEach = _interopRequireDefault(_framptonRecordFor_each);

  /**
   * @name filter
   * @method
   * @memberof Frampton.Record
   * @param {Function} predicate A function to filter the object. The functino recieves the
   * value and key as arguments to make its decision
   * @returns {Object}
   */
  module.exports = _curry['default'](function curried_filter(predicate, obj) {

    var newObj = {};

    _forEach['default'](function (value, key) {
      if (predicate(value, key)) {
        newObj[key] = value;
      }
    }, obj);

    return Object.freeze(newObj);
  });
});
define('frampton-record/for_each', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  /**
   * @name forEach
   * @method
   * @memberof Frampton.Record
   * @param {Function} fn Function to call for each key/value pair
   * @param {Object} obj Object to iterate over
   */
  module.exports = _curry['default'](function curried_for_each(fn, obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        fn(obj[key], key);
      }
    }
  });
});
define('frampton-record/keys', ['exports', 'module', 'frampton-utils/is_function'], function (exports, module, _framptonUtilsIs_function) {
  'use strict';

  module.exports = keys;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _isFunction = _interopRequireDefault(_framptonUtilsIs_function);

  var hasOwnProp = Object.prototype.hasOwnProperty;

  function getKeys(obj) {
    var result = [];
    for (var key in obj) {
      if (hasOwnProp.call(obj, key)) {
        result.push(key);
      }
    }
    return result;
  }

  /**
   * @name keys
   * @method
   * @memberof Frampton.Record
   * @param {Object} obj Object whose keys to get
   * @returns {String[]}
   */

  function keys(obj) {
    if (_isFunction['default'](Object.keys)) {
      return Object.keys(obj).filter(function (key) {
        return hasOwnProp.call(obj, key);
      });
    } else {
      return getKeys(obj);
    }
  }
});
define('frampton-record/map', ['exports', 'module', 'frampton-utils/curry', 'frampton-record/for_each'], function (exports, module, _framptonUtilsCurry, _framptonRecordFor_each) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  var _forEach = _interopRequireDefault(_framptonRecordFor_each);

  /**
   * @name map
   * @method
   * @memberof Frampton.Record
   * @param {Function} fn Function used to map the object
   * @param {Object} obj Object to map
   * @returns {Object} A new object with its values mapped using the given function
   */
  module.exports = _curry['default'](function curried_map(fn, obj) {

    var newObj = {};

    _forEach['default'](function (value, key) {
      newObj[key] = fn(value, key);
    }, obj);

    return Object.freeze(newObj);
  });
});
define('frampton-record/merge', ['exports', 'module', 'frampton-utils/curry', 'frampton-utils/extend'], function (exports, module, _framptonUtilsCurry, _framptonUtilsExtend) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  var _extend = _interopRequireDefault(_framptonUtilsExtend);

  /**
   * Merges two objects into one. Priority is given to the keys on the second object.
   *
   * @name merge
   * @method
   * @memberof Frampton.Record
   * @param {Object} obj1 First object to merge
   * @param {Object} obj2 Second object to merge
   * @returns {Object}
   */
  module.exports = _curry['default'](function curried_merge(obj1, obj2) {
    return Object.freeze(_extend['default']({}, obj1, obj2));
  });
});
define('frampton-record/of', ['exports', 'module', 'frampton-record/copy'], function (exports, module, _framptonRecordCopy) {
  'use strict';

  module.exports = of_record;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _copy = _interopRequireDefault(_framptonRecordCopy);

  /**
   * of :: Object -> Object
   *
   * @name of
   * @method
   * @memberof Frampton.Record
   * @param {Object} obj object to copy
   * @returns {Object}
   */

  function of_record(obj) {
    return _copy['default'](obj);
  }
});
define('frampton-record/reduce', ['exports', 'module', 'frampton-utils/curry', 'frampton-record/for_each'], function (exports, module, _framptonUtilsCurry, _framptonRecordFor_each) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  var _forEach = _interopRequireDefault(_framptonRecordFor_each);

  /**
   * reduce :: Function -> Any -> Object -> Object
   *
   * @name reduce
   * @method
   * @memberof Frampton.Record
   * @param {Function} fn Function used to reduce the object
   * @param {*} acc Initial value of reduce operation
   * @param {Object} obj Object to iterate over for the reduce
   * @returns {*}
   */
  module.exports = _curry['default'](function curried_reduce(fn, acc, obj) {

    _forEach['default'](function (value, key) {
      acc = fn(acc, value, key);
    }, obj);

    return acc;
  });
});
define('frampton-record/update', ['exports', 'module', 'frampton-record/for_each'], function (exports, module, _framptonRecordFor_each) {
  'use strict';

  module.exports = update_object;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _forEach = _interopRequireDefault(_framptonRecordFor_each);

  /**
   * update :: Object -> Object -> Object
   *
   * @name update
   * @method
   * @memberof Frampton.Record
   * @param {Object} base   object to copy
   * @param {Object} update object describing desired udpate
   * @returns {Object}
   */

  function update_object(base, update) {

    var newObj = {};

    _forEach['default'](function (value, key) {
      if (update[key]) {
        newObj[key] = update[key];
      } else {
        newObj[key] = value;
      }
    }, base);

    return Object.freeze(newObj);
  }
});
define('frampton-signal', ['exports', 'frampton/namespace', 'frampton-signal/create', 'frampton-signal/stepper', 'frampton-signal/combine', 'frampton-signal/swap', 'frampton-signal/toggle', 'frampton-signal/is_signal', 'frampton-signal/forward'], function (exports, _framptonNamespace, _framptonSignalCreate, _framptonSignalStepper, _framptonSignalCombine, _framptonSignalSwap, _framptonSignalToggle, _framptonSignalIs_signal, _framptonSignalForward) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _Frampton = _interopRequireDefault(_framptonNamespace);

  var _create = _interopRequireDefault(_framptonSignalCreate);

  var _stepper = _interopRequireDefault(_framptonSignalStepper);

  var _combine = _interopRequireDefault(_framptonSignalCombine);

  var _swap = _interopRequireDefault(_framptonSignalSwap);

  var _toggle = _interopRequireDefault(_framptonSignalToggle);

  var _isSignal = _interopRequireDefault(_framptonSignalIs_signal);

  var _forward = _interopRequireDefault(_framptonSignalForward);

  /**
   * @name Signal
   * @class
   * @memberof Frampton
   */
  _Frampton['default'].Signal = {};
  _Frampton['default'].Signal.create = _create['default'];
  _Frampton['default'].Signal.stepper = _stepper['default'];
  _Frampton['default'].Signal.combine = _combine['default'];
  _Frampton['default'].Signal.merge = _framptonSignalCreate.mergeMany;
  _Frampton['default'].Signal.swap = _swap['default'];
  _Frampton['default'].Signal.toggle = _toggle['default'];
  _Frampton['default'].Signal.isSignal = _isSignal['default'];
  _Frampton['default'].Signal.forward = _forward['default'];
});
define('frampton-signal/combine', ['exports', 'module', 'frampton-signal/create'], function (exports, module, _framptonSignalCreate) {
  'use strict';

  module.exports = combine;

  /**
   * Method to combine multiple Signals into one with a given mapping function. Values
   * of the Signals are passed to the mapping function in the same order they appear
   * in the array.
   *
   * @name combine
   * @method
   * @memberof Frampton.Signal
   * @param {Function} mapping - Function used to combine given Signals
   * @param {Frampton.Signal[]} parents - Array of Signals to combine
   * @returns {Frampton.Signal} A new Signal
   */

  function combine(mapping, parents) {
    return _framptonSignalCreate.createSignal(function (self) {
      self.push(mapping.apply(null, parents.map(function (parent) {
        return parent._value;
      })));
    }, parents);
  }
});
define('frampton-signal/create', ['exports', 'frampton-utils/guid', 'frampton-utils/is_defined', 'frampton-utils/is_promise', 'frampton-utils/is_function', 'frampton-utils/is_equal', 'frampton-utils/of_value', 'frampton-utils/noop', 'frampton-utils/log'], function (exports, _framptonUtilsGuid, _framptonUtilsIs_defined, _framptonUtilsIs_promise, _framptonUtilsIs_function, _framptonUtilsIs_equal, _framptonUtilsOf_value, _framptonUtilsNoop, _framptonUtilsLog) {
  'use strict';

  exports.__esModule = true;
  exports.createSignal = createSignal;
  exports.mergeMany = mergeMany;
  exports['default'] = create;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _guid = _interopRequireDefault(_framptonUtilsGuid);

  var _isDefined = _interopRequireDefault(_framptonUtilsIs_defined);

  var _isPromise = _interopRequireDefault(_framptonUtilsIs_promise);

  var _isFunction = _interopRequireDefault(_framptonUtilsIs_function);

  var _isEqual = _interopRequireDefault(_framptonUtilsIs_equal);

  var _ofValue = _interopRequireDefault(_framptonUtilsOf_value);

  var _noop = _interopRequireDefault(_framptonUtilsNoop);

  var _log = _interopRequireDefault(_framptonUtilsLog);

  var signalGraph = [];
  var updateQueue = [];
  var updateInProgress = false;

  // Removing duplicates from right->left ensures all of a node's dependencies have
  // been updated before the node is updated.
  function removeDuplicatesWeigthed(graph) {
    var temp = [];
    var i = graph.length - 1;
    for (; i >= 0; i--) {
      if (temp.indexOf(graph[i]) === -1) {
        temp.unshift(graph[i]);
      }
    }
    return temp;
  }

  // Build the initial graph by queuing children breadth first
  function buildRawGraph(sig) {
    var graph = [];
    return (function addChildren(next) {
      var len = next._children.length;
      var i;
      for (i = 0; i < len; i++) {
        graph.push(next._children[i]);
      }
      for (i = 0; i < len; i++) {
        addChildren(next._children[i]);
      }
      return graph;
    })(sig);
  }

  function buildSignalGraph(sig) {
    return removeDuplicatesWeigthed(buildRawGraph(sig));
  }

  function finishUpdate() {
    var len = signalGraph.length;
    var sig = null;
    var i;
    for (i = 0; i < len; i++) {
      sig = signalGraph[i];
      sig._updater = null;
      sig._queued = false;
    }
    signalGraph.length = 0;
  }

  function runUpdate() {
    var numberOfNodes = signalGraph.length;
    var node = null;
    var i = 0;
    updateInProgress = true;
    for (i = 0; i < numberOfNodes; i++) {
      node = signalGraph[i];
      if (node._queued) {
        node._update(node);
      }
    }
    finishUpdate();
    updateInProgress = false;
  }

  function markChildren(sig) {
    var len = sig._children.length;
    var child = null;
    var i;
    for (i = 0; i < len; i++) {
      child = sig._children[i];
      child._updater = sig;
      child._queued = true;
    }
  }

  function notInGraph(sig) {
    return signalGraph.indexOf(sig) === -1;
  }

  function scheduleUpdate(sig, val) {
    updateQueue.push({
      signal: sig,
      value: val
    });
  }

  function checkUpdateQueue() {
    var update;
    if (updateQueue.length > 0) {
      update = updateQueue.shift();
      updateValue(update.signal, update.value);
    }
  }

  function updateValue(sig, val) {
    if (_isPromise['default'](val)) {
      val.then(sig);
    } else {
      sig._value = val;
      sig._hasValue = true;
      markChildren(sig);
      if (!updateInProgress) {
        signalGraph = buildSignalGraph(sig);
        runUpdate();
        checkUpdateQueue();
      } else if (notInGraph(sig)) {
        scheduleUpdate(sig, val);
      }
    }
  }

  function toString() {
    return 'Signal(' + this._value + ')';
  }

  /**
   * @name merge
   * @method
   * @memberof Frampton.Signal.Signal#
   * @param {Frampton.Signal.Signal} sig2
   * @returns {Frampton.Signal.Signal}
   */
  function merge(sig2) {
    var sig1 = this;
    return mergeMany([sig1, sig2]);
  }

  /**
   * ap(<*>) :: Signal (a -> b) -> Signal a -> Signal b
   *
   * @name ap
   * @method
   * @memberof Frampton.Signal.Signal#
   * @param {Frampton.Signal.Signal} arg
   * @returns {Frampton.Signal.Signal}
   */
  function ap(arg) {
    var parent = this;
    var initial = parent._hasValue && arg._hasValue ? parent._value(arg._value) : undefined;
    return createSignal(function (self) {
      self.push(parent._value(arg._value));
    }, [parent], initial);
  }

  /**
   * @name sample
   * @method
   * @private
   * @memberof Frampton.Signal.Signal#
   * @param {Frampton.Signal.Signal} tag
   * @returns {Frampton.Signal.Signal}
   */
  function sample(tag) {
    var parent = this;
    return createSignal(function (self) {
      self.push(tag._value);
    }, [parent], tag._value);
  }

  /**
   * @name take
   * @method
   * @private
   * @memberof Frampton.Signal.Signal#
   * @param {Number} limit
   * @returns {Frampton.Signal.Signal}
   */
  function take(limit) {
    var parent = this;
    return createSignal(function (self) {
      if (limit-- > 0) {
        self.push(parent._value);
      } else {
        self.close();
      }
    }, [parent]);
  }

  /**
   * Like reduce on Arrays, this method is used to reduce all values of a Signal down to a
   * single value using the given function.
   *
   * The function recieves arguments in the order of (accumulator, next value). The function
   * should return a new value that will then be the new accumulator for the next interation.
   *
   * @name fold
   * @method
   * @private
   * @memberof Frampton.Signal.Signal#
   * @param {Function} fn
   * @param {Function} initial
   * @returns {Frampton.Signal.Signal}
   */
  function fold(fn, initial) {
    var parent = this;
    return createSignal(function (self) {
      self.push(fn(self._value, parent._value));
    }, [parent], initial);
  }

  /**
   * Remove values from the Signal based on the given predicate function. If a function is not
   * given then filter will use strict equals with the value given to test new values on the
   * Signal.
   *
   * @name filter
   * @method
   * @private
   * @memberof Frampton.Signal.Signal#
   * @param {*} predicate - Usually a function to test values of the Signal
   * @returns {Frampton.Signal.Signal}
   */
  function filter(predicate) {
    var parent = this;
    var filterFn = _isFunction['default'](predicate) ? predicate : _isEqual['default'](predicate);
    var initial = parent._hasValue && filterFn(parent._value) ? parent._value : undefined;
    return createSignal(function (self) {
      if (filterFn(parent._value)) {
        self.push(parent._value);
      }
    }, [parent], initial);
  }

  /**
   * @name filterPrevious
   * @method
   * @private
   * @memberof Frampton.Signal.Signal#
   * @param {Function} predicate - A binary function to test the previous value against the current
   *                               value to decide if you want to keep the new value.
   * @returns {Frampton.Signal.Signal}
   */
  function filterPrevious(predicate) {
    var parent = this;
    var initial = parent._hasValue ? parent._value : undefined;
    return createSignal(function (self) {
      if (predicate(self._value, parent._value)) {
        self.push(parent._value);
      }
    }, [parent], initial);
  }

  /**
   * @name and
   * @method
   * @private
   * @memberof Frampton.Signal.Signal#
   * @param {Frampton.Signal.Signal} predicate - A Signal that must be truthy for values on this Signal
   *                                             to continue.
   * @returns {Frampton.Signal.Signal}
   */
  function and(predicate) {
    var parent = this;
    var initial = parent._hasValue && predicate._value ? parent._value : undefined;
    return createSignal(function (self) {
      if (predicate._value) {
        self.push(parent._value);
      }
    }, [parent], initial);
  }

  /**
   * @name not
   * @method
   * @private
   * @memberof Frampton.Signal.Signal#
   * @param {Frampton.Signal.Signal} predicate - A Signal that must be falsy for values on this Signal
   *                                             to continue.
   * @returns {Frampton.Signal.Signal}
   */
  function not(predicate) {
    var parent = this;
    var initial = parent._hasValue && !predicate._value ? parent._value : undefined;
    return createSignal(function (self) {
      if (!predicate._value) {
        self.push(parent.value);
      }
    }, [parent], initial);
  }

  /**
   * @name map
   * @method
   * @private
   * @memberof Frampton.Signal.Signal#
   * @param {*} mapping - A function or value to map the signal with. If a function, the value
   *                        on the parent signal will be passed to the function and the signal will
   *                        be mapped to the return value of the function. If a value, the value of
   *                        the parent signal will be replaced with the value.
   * @returns {Frampton.Signal.Signal} A new signal with mapped values
   */
  function map(mapping) {
    var parent = this;
    var mappingFn = _isFunction['default'](mapping) ? mapping : _ofValue['default'](mapping);
    var initial = parent._hasValue ? mappingFn(parent._value) : undefined;
    return createSignal(function (self) {
      self.push(mappingFn(parent._value));
    }, [parent], initial);
  }

  /**
   * @name debounce
   * @method
   * @private
   * @memberof Frampton.Signal.Signal#
   * @param {Number} delay - Milliseconds to debounce the signal
   * @returns {Frampton.Signal.Signal}
   */
  function debounce(delay) {
    var parent = this;
    var timer = null;
    return createSignal(function (self) {
      if (!timer) {
        timer = setTimeout(function () {
          self.push(parent._value);
          timer = null;
        }, delay || 10);
      }
    }, [parent], parent._value);
  }

  /**
   * @name delay
   * @method
   * @private
   * @memberof Frampton.Signal.Signal#
   * @param {Number} time - Milliseconds to delay values of this Signal.
   * @returns {Frampton.Signal.Signal}
   */
  function delay(time) {
    var parent = this;
    return createSignal(function (self) {
      (function (saved) {
        setTimeout(function () {
          self.push(saved);
        }, time);
      })(parent._value);
    }, [parent], parent._value);
  }

  /**
   * dropRepeats :: Signal a -> Signal a
   *
   * Uses strict equals to drop repeated values from the parent signal.
   *
   * @name dropRepeats
   * @method
   * @memberof Frampton.Signal.Signal#
   * @returns {Frampton.Signal.Signal}
   */
  function dropRepeats() {
    return this.filterPrevious(function (prev, next) {
      return prev !== next;
    });
  }

  /**
   * Calls the given function when this signal updates. This function will call for the first
   * time the next time the Signal updates. If there is a current value on the Signal it is
   * ignored. If you are interested in the current value of the Signal use either the value or
   * changes method.
   *
   * @name next
   * @method
   * @memberof Frampton.Signal.Signal#
   * @param {Function} fn - The function to call
   * @returns {Frampton.Signal.Signal}
   */
  function next(fn) {
    var parent = this;
    return createSignal(function (self) {
      fn(parent._value);
    }, [parent]);
  }

  /**
   * Calls the given function when this Signal has a value. The function is called immediately
   * if this Signal already has a value, then is called again each time this Signal updates.
   *
   * @name value
   * @method
   * @memberof Frampton.Signal.Signal#
   * @param {Function} fn - The function to call
   * @returns {Frampton.Signal.Signal}
   */
  function value(fn) {
    var parent = this;
    var child = createSignal(function (self) {
      fn(parent._value);
    }, [parent], parent._value);

    if (child._hasValue) {
      fn(child._value);
    }

    return child;
  }

  /**
   * Works just like the value method, just repeated values are dropped.
   *
   * @name changes
   * @method
   * @memberof Frampton.Signal.Signal#
   * @param {Function} fn - The function to call
   * @returns {Frampton.Signal.Signal}
   */
  function changes(fn) {
    return this.dropRepeats().value(fn);
  }

  /**
   * Removes the Signal from the Signal graph.
   *
   * @name close
   * @method
   * @memberof Frampton.Signal.Signal#
   */
  function close() {

    var sig = this;

    sig._children.forEach(function (child) {
      child._parents = child._parents.filter(function (parent) {
        return parent._id !== sig._id;
      });
    });

    sig._parents.forEach(function (parent) {
      parent._children = parent._children.filter(function (child) {
        return child._id !== sig._id;
      });
    });

    sig._children.length = 0;
    sig._parents.length = 0;
  }

  /**
   * Logs the values of a given signal to the console.
   *
   * @name logValue
   * @method
   * @memberof Frampton.Signal.Signal#
   * @returns {Frampton.Signal.Signal}
   */
  function logValue(msg) {
    var parent = this;
    return createSignal(function (self) {
      if (msg) {
        _log['default'](msg);
      } else {
        _log['default'](parent._value);
      }
      self.push(parent._value);
    }, [parent], parent._value);
  }

  /**
   * @name createSignal
   * @memberof Frampton.Signal
   * @method
   * @private
   * @param {function}                 update  - Function to call when this signal updates
   * @param {Frampton.Signal.Signal[]} parents - List of signals this signal depends on
   * @param {*}                        initial - Initial value for this signal
   * @returns {Frampton.Signal.Signal}
   */

  function createSignal(update, parents, initial) {

    var signal = {};

    signal.push = function (val) {
      updateValue(signal, val);
    };

    signal.get = function () {
      return signal._value;
    };

    // Constructor
    signal.ctor = 'Frampton.Signal';

    // Private
    signal._id = _guid['default']();
    signal._value = initial;
    signal._hasValue = _isDefined['default'](initial);
    signal._queued = false;
    signal._updater = null;
    signal._parents = parents || [];
    signal._children = [];
    signal._update = update || _noop['default'];

    // Public
    signal.debounce = debounce;
    signal.delay = delay;
    signal.ap = ap;
    signal.merge = merge;
    signal.map = map;
    signal.filter = filter;
    signal.filterPrevious = filterPrevious;
    signal.and = and;
    signal.not = not;
    signal.fold = fold;
    signal.sample = sample;
    signal.take = take;
    signal.dropRepeats = dropRepeats;
    signal.log = logValue;
    signal.next = next;
    signal.value = value;
    signal.changes = changes;
    signal.close = close;
    signal.toString = toString;

    for (var i = 0; i < signal._parents.length; i++) {
      signal._parents[i]._children.push(signal);
    }

    return Object.seal(signal);
  }

  /**
   * @name mergeMany
   * @memberof Frampton.Signal
   * @method
   * @param {Frampton.Signal.Signal[]} parents - Signals to merge
   */

  function mergeMany(parents) {
    var initial = parents.length > 0 ? parents[0]._value : undefined;
    return createSignal(function (self) {
      self.push(self._updater._value);
    }, parents, initial);
  }

  /**
   * Used to create new instances of Frampton.Signal. This should be used instead of calling
   * the Signal constructor directly.
   *
   * @name create
   * @memberof Frampton.Signal
   * @method
   * @param {*} [initial] - Initial value for this signal
   * @returns {Frampton.Signal}
   */

  function create(initial) {
    return createSignal(null, null, initial);
  }
});
define("frampton-signal/forward", ["exports", "module"], function (exports, module) {
  /**
   * @name forward
   * @memberof Frampton.Signal
   * @param {Frampton.Signal#} sig
   * @param {Function} mapping
   * @returns {Frampton.Signal#}
   */
  "use strict";

  module.exports = forward;

  function forward(sig, mapping) {
    return function (val) {
      sig.push(mapping(val));
    };
  }
});
define('frampton-signal/is_signal', ['exports', 'module', 'frampton-utils/is_function', 'frampton-utils/is_string'], function (exports, module, _framptonUtilsIs_function, _framptonUtilsIs_string) {
  'use strict';

  module.exports = is_signal;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _isFunction = _interopRequireDefault(_framptonUtilsIs_function);

  var _isString = _interopRequireDefault(_framptonUtilsIs_string);

  function is_signal(obj) {
    return _isFunction['default'](obj) && _isString['default'](obj.ctor) && obj.ctor === 'Frampton.Signal';
  }
});
define('frampton-signal/stepper', ['exports', 'module', 'frampton-utils/curry', 'frampton-signal/create'], function (exports, module, _framptonUtilsCurry, _framptonSignalCreate) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  var _createSignal = _interopRequireDefault(_framptonSignalCreate);

  // stepper :: a -> Signal a -> Signal a
  module.exports = _curry['default'](function (initial, updater) {
    var sig = _createSignal['default'](initial);
    return sig.merge(updater.dropRepeats());
  });
});
define('frampton-signal/swap', ['exports', 'module', 'frampton-utils/curry', 'frampton-signal/stepper'], function (exports, module, _framptonUtilsCurry, _framptonSignalStepper) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  var _stepper = _interopRequireDefault(_framptonSignalStepper);

  /**
   * swap :: Signal a -> Signal b -> Signal Boolean
   *
   * @name swap
   * @method
   * @memberof Frampton.Signal
   * @param {Frampton.Signal.Signal} sig1
   * @param {Frampton.Signal.Signal} sig2
   * @returns {Frampton.Signal.Signal}
   */
  module.exports = _curry['default'](function toggle(sig1, sig2) {
    return _stepper['default'](false, sig1.map(true).merge(sig2.map(false)));
  });
});
define('frampton-signal/toggle', ['exports', 'module', 'frampton-utils/assert', 'frampton-utils/curry', 'frampton-utils/is_boolean', 'frampton-signal/create'], function (exports, module, _framptonUtilsAssert, _framptonUtilsCurry, _framptonUtilsIs_boolean, _framptonSignalCreate) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _assert = _interopRequireDefault(_framptonUtilsAssert);

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  var _isBoolean = _interopRequireDefault(_framptonUtilsIs_boolean);

  var _createSignal = _interopRequireDefault(_framptonSignalCreate);

  /**
   * toggle :: Boolean -> Signal a -> Signal Boolean
   *
   * Creates a signal that emits alternating Boolean values on occurences of input signal.
   *
   * @name toggle
   * @method
   * @memberof Frampton.Signal
   * @param {Boolean} initial Value to initialize toggle to
   * @param {Frampton.Signal.Signal} updater Signal to update toggle to
   * @returns {Frampton.Signal.Signal}
   */
  module.exports = _curry['default'](function (initial, updater) {
    _assert['default']('Frampton.Signal.toggle must be initialized with a Boolean', _isBoolean['default'](initial));
    var sig = _createSignal['default'](initial);
    var current = initial;
    return sig.merge(updater.map(function () {
      current = !current;
      return current;
    }));
  });
});
define('frampton-string', ['exports', 'frampton/namespace', 'frampton-string/replace', 'frampton-string/trim', 'frampton-string/join', 'frampton-string/split', 'frampton-string/lines', 'frampton-string/words', 'frampton-string/starts_with', 'frampton-string/ends_with', 'frampton-string/contains', 'frampton-string/capitalize', 'frampton-string/dash_to_camel', 'frampton-string/length', 'frampton-string/normalize_newline'], function (exports, _framptonNamespace, _framptonStringReplace, _framptonStringTrim, _framptonStringJoin, _framptonStringSplit, _framptonStringLines, _framptonStringWords, _framptonStringStarts_with, _framptonStringEnds_with, _framptonStringContains, _framptonStringCapitalize, _framptonStringDash_to_camel, _framptonStringLength, _framptonStringNormalize_newline) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _Frampton = _interopRequireDefault(_framptonNamespace);

  var _replace = _interopRequireDefault(_framptonStringReplace);

  var _trim = _interopRequireDefault(_framptonStringTrim);

  var _join = _interopRequireDefault(_framptonStringJoin);

  var _split = _interopRequireDefault(_framptonStringSplit);

  var _lines = _interopRequireDefault(_framptonStringLines);

  var _words = _interopRequireDefault(_framptonStringWords);

  var _startsWith = _interopRequireDefault(_framptonStringStarts_with);

  var _endsWith = _interopRequireDefault(_framptonStringEnds_with);

  var _contains = _interopRequireDefault(_framptonStringContains);

  var _capitalize = _interopRequireDefault(_framptonStringCapitalize);

  var _dashToCamel = _interopRequireDefault(_framptonStringDash_to_camel);

  var _length = _interopRequireDefault(_framptonStringLength);

  var _normalizeNewline = _interopRequireDefault(_framptonStringNormalize_newline);

  /**
   * @name String
   * @namespace
   * @memberof Frampton
   */
  _Frampton['default'].String = {};
  _Frampton['default'].String.replace = _replace['default'];
  _Frampton['default'].String.trim = _trim['default'];
  _Frampton['default'].String.join = _join['default'];
  _Frampton['default'].String.split = _split['default'];
  _Frampton['default'].String.lines = _lines['default'];
  _Frampton['default'].String.words = _words['default'];
  _Frampton['default'].String.startsWith = _startsWith['default'];
  _Frampton['default'].String.endsWith = _endsWith['default'];
  _Frampton['default'].String.contains = _contains['default'];
  _Frampton['default'].String.capitalize = _capitalize['default'];
  _Frampton['default'].String.dashToCamel = _dashToCamel['default'];
  _Frampton['default'].String.length = _length['default'];
  _Frampton['default'].String.normalizeNewline = _normalizeNewline['default'];
});
define("frampton-string/capitalize", ["exports", "module"], function (exports, module) {
  "use strict";

  module.exports = capitalize;

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
});
define('frampton-string/contains', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  // contains :: String -> String -> Boolean
  module.exports = _curry['default'](function contains(sub, str) {
    return str.indexOf(sub) > -1;
  });
});
define("frampton-string/dash_to_camel", ["exports", "module"], function (exports, module) {
  "use strict";

  module.exports = dash_to_camel;

  function dash_to_camel(str) {
    return str.replace(/-([a-z])/g, function (m, w) {
      return w.toUpperCase();
    });
  }
});
define('frampton-string/ends_with', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  // ends_with :: String -> String -> Boolean
  module.exports = _curry['default'](function ends_with(sub, str) {
    return str.length >= sub.length && str.lastIndexOf(sub) === str.length - sub.length;
  });
});
define('frampton-string/is_empty', ['exports', 'module'], function (exports, module) {
  'use strict';

  module.exports = is_empty;

  function is_empty(str) {
    return str.trim() === '';
  }
});
define('frampton-string/join', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  /**
   * join :: String -> Array String -> String
   * @name join
   * @method
   * @memberof Frampton.String
   * @param {String} sep
   * @param {Array} strs
   * @returns {String}
   */
  module.exports = _curry['default'](function join(sep, strs) {
    return strs.join(sep);
  });
});
define('frampton-string/length', ['exports', 'module', 'frampton-utils/is_something', 'frampton-utils/is_defined', 'frampton-string/normalize_newline'], function (exports, module, _framptonUtilsIs_something, _framptonUtilsIs_defined, _framptonStringNormalize_newline) {
  'use strict';

  module.exports = length;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _isSomething = _interopRequireDefault(_framptonUtilsIs_something);

  var _isDefined = _interopRequireDefault(_framptonUtilsIs_defined);

  var _normalizeNewline = _interopRequireDefault(_framptonStringNormalize_newline);

  /**
   * @name length
   * @memberof Frampton.String
   * @static
   * @param {String}
   * @returns {Number}
   */

  function length(str) {
    return _isSomething['default'](str) && _isDefined['default'](str.length) ? _normalizeNewline['default'](str).length : 0;
  }
});
define("frampton-string/lines", ["exports", "module"], function (exports, module) {
  // lines :: String -> Array String
  "use strict";

  module.exports = lines;

  function lines(str) {
    return str.split(/\r\n|\r|\n/g);
  }
});
define('frampton-string/normalize_newline', ['exports', 'module'], function (exports, module) {
  /**
   * Returns a string with newlines normalized to \n. Windows machines will use
   * \r\n for newlines which can lead to irregularities when dealing with strings
   *
   * @name normalizeNewline
   * @memberof Frampton.String
   * @static
   * @param {String} str
   * @returns {String}
   */
  'use strict';

  module.exports = normalize_newline;

  function normalize_newline(str) {
    return str.replace(/\r\n/g, '\n');
  }
});
define('frampton-string/replace', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  /**
   * replace :: String -> String -> String -> String
   * @name replace
   * @method
   * @memberof Frampton.String
   * @param {String} newSubStr
   * @param {String} oldSubStr
   * @param {String} str
   * @returns {String}
   */
  module.exports = _curry['default'](function replace(newSubStr, oldSubStr, str) {
    return str.replace(oldSubStr, newSubStr);
  });
});
define('frampton-string/split', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  // split :: String -> String -> Array String
  module.exports = _curry['default'](function join(sep, str) {
    return str.split(sep);
  });
});
define('frampton-string/starts_with', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  // starts_with :: String -> String -> Boolean
  module.exports = _curry['default'](function starts_with(sub, str) {
    return str.indexOf(sub) === 0;
  });
});
define("frampton-string/trim", ["exports", "module"], function (exports, module) {
  "use strict";

  module.exports = trim;

  function trim(str) {
    return str.trim();
  }
});
define("frampton-string/words", ["exports", "module"], function (exports, module) {
  // words :: String -> Array String
  "use strict";

  module.exports = words;

  function words(str) {
    return str.trim().split(/\s+/g);
  }
});
define('frampton-style', ['exports', 'frampton/namespace', 'frampton-style/add_class', 'frampton-style/remove_class', 'frampton-style/has_class', 'frampton-style/matches', 'frampton-style/current_value', 'frampton-style/set_style', 'frampton-style/remove_style', 'frampton-style/apply_styles', 'frampton-style/remove_styles', 'frampton-style/closest', 'frampton-style/contains', 'frampton-style/selector_contains', 'frampton-style/supported', 'frampton-style/supported_props'], function (exports, _framptonNamespace, _framptonStyleAdd_class, _framptonStyleRemove_class, _framptonStyleHas_class, _framptonStyleMatches, _framptonStyleCurrent_value, _framptonStyleSet_style, _framptonStyleRemove_style, _framptonStyleApply_styles, _framptonStyleRemove_styles, _framptonStyleClosest, _framptonStyleContains, _framptonStyleSelector_contains, _framptonStyleSupported, _framptonStyleSupported_props) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _Frampton = _interopRequireDefault(_framptonNamespace);

  var _addClass = _interopRequireDefault(_framptonStyleAdd_class);

  var _removeClass = _interopRequireDefault(_framptonStyleRemove_class);

  var _hasClass = _interopRequireDefault(_framptonStyleHas_class);

  var _matches = _interopRequireDefault(_framptonStyleMatches);

  var _current = _interopRequireDefault(_framptonStyleCurrent_value);

  var _setStyle = _interopRequireDefault(_framptonStyleSet_style);

  var _removeStyle = _interopRequireDefault(_framptonStyleRemove_style);

  var _applyStyles = _interopRequireDefault(_framptonStyleApply_styles);

  var _removeStyles = _interopRequireDefault(_framptonStyleRemove_styles);

  var _closest = _interopRequireDefault(_framptonStyleClosest);

  var _contains = _interopRequireDefault(_framptonStyleContains);

  var _selectorContains = _interopRequireDefault(_framptonStyleSelector_contains);

  var _supported = _interopRequireDefault(_framptonStyleSupported);

  var _supportedProps = _interopRequireDefault(_framptonStyleSupported_props);

  /**
   * @name Style
   * @namespace
   * @memberof Frampton
   */
  _Frampton['default'].Style = {};
  _Frampton['default'].Style.addClass = _addClass['default'];
  _Frampton['default'].Style.closest = _closest['default'];
  _Frampton['default'].Style.removeClass = _removeClass['default'];
  _Frampton['default'].Style.hasClass = _hasClass['default'];
  _Frampton['default'].Style.matches = _matches['default'];
  _Frampton['default'].Style.current = _current['default'];
  _Frampton['default'].Style.setStyle = _setStyle['default'];
  _Frampton['default'].Style.removeStyle = _removeStyle['default'];
  _Frampton['default'].Style.applyStyles = _applyStyles['default'];
  _Frampton['default'].Style.removeStyles = _removeStyles['default'];
  _Frampton['default'].Style.contains = _contains['default'];
  _Frampton['default'].Style.selectorContains = _selectorContains['default'];
  _Frampton['default'].Style.supported = _supported['default'];
  _Frampton['default'].Style.supportedProps = _supportedProps['default'];
});
define('frampton-style/add_class', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  /**
   * @name addClass
   * @method
   * @memberof Frampton.Style
   * @param {Object} element
   * @param {String} name
   */
  module.exports = _curry['default'](function add_class(element, name) {
    element.classList.add(name);
  });
});
define('frampton-style/apply_styles', ['exports', 'module', 'frampton-utils/curry', 'frampton-utils/is_something', 'frampton-style/remove_style', 'frampton-style/set_style'], function (exports, module, _framptonUtilsCurry, _framptonUtilsIs_something, _framptonStyleRemove_style, _framptonStyleSet_style) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  var _isSomething = _interopRequireDefault(_framptonUtilsIs_something);

  var _removeStyle = _interopRequireDefault(_framptonStyleRemove_style);

  var _setStyle = _interopRequireDefault(_framptonStyleSet_style);

  /**
   * @name applyStyles
   * @method
   * @memberof Frampton.Style
   * @param {Object} element DomNode to add styles to
   * @param {Object} props   Has of props to add
   */
  module.exports = _curry['default'](function apply_styles(element, props) {
    for (var key in props) {
      var value = props[key];
      if (_isSomething['default'](value)) {
        _setStyle['default'](element, key, value);
      } else {
        _removeStyle['default'](element, key, value);
      }
    }
  });
});
define('frampton-style/closest', ['exports', 'module', 'frampton-utils/curry', 'frampton-style/matches'], function (exports, module, _framptonUtilsCurry, _framptonStyleMatches) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  var _matches = _interopRequireDefault(_framptonStyleMatches);

  /**
   * Searches up the Dom Tree from a given node and returns the first element
   * that matches the selector. If no match is found, null is returned.
   *
   * @name closest
   * @method
   * @memberof Frampton.Style
   * @param {String} selector Selector to search for
   * @param {Object} element  DomNode to start search from
   * @returns {Object} The first DomNode matching the selector or null.
   */
  module.exports = _curry['default'](function closest(selector, element) {

    while (element) {
      if (_matches['default'](selector, element)) {
        break;
      }
      element = element.parentElement;
    }

    return element || null;
  });
});
define('frampton-style/contains', ['exports', 'module', 'frampton-utils/curry', 'frampton-style/matches'], function (exports, module, _framptonUtilsCurry, _framptonStyleMatches) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  var _matches = _interopRequireDefault(_framptonStyleMatches);

  /**
   * Searches inside the given element and returns true if the given element, or
   * one of its children matches the given selector, false otherwise.
   *
   * @name contains
   * @method
   * @memberof Frampton.Style
   * @param {String} selector Selector to search for
   * @param {Object} element  DomNode to search inside of
   * @returns {Boolean} Is there a match for the selector?
   */
  module.exports = _curry['default'](function contains(selector, element) {
    return _matches['default'](selector, element) || element.querySelectorAll(selector).length > 0;
  });
});
define('frampton-style/current_value', ['exports', 'module', 'frampton-utils/curry', 'frampton-style/supported'], function (exports, module, _framptonUtilsCurry, _framptonStyleSupported) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  var _supported = _interopRequireDefault(_framptonStyleSupported);

  var style = window.getComputedStyle;

  /**
   * current :: DomNode -> String -> String
   *
   * @name currentValue
   * @method
   * @memberof Frampton.Style
   * @param {Object} element DomNode whose property to check
   * @param {String} prop    Name of property to check
   * @returns {String} String representation of current property value
   */
  module.exports = _curry['default'](function current(element, prop) {
    return style(element).getPropertyValue(_supported['default'](prop));
  });
});
define('frampton-style/has_class', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  /**
   * Returns a Boolean indicated if the given DomNode has the given class.
   *
   * @name hasClass
   * @method
   * @memberof Frampton.Style
   * @param {String} name    Class to test for
   * @param {Object} element DomNode to test
   * @returns {Boolean}
   */
  module.exports = _curry['default'](function has_class(name, element) {
    return element.classList.contains(name);
  });
});
define('frampton-style/matches', ['exports', 'module', 'frampton-utils/curry', 'frampton-utils/is_function'], function (exports, module, _framptonUtilsCurry, _framptonUtilsIs_function) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  var _isFunction = _interopRequireDefault(_framptonUtilsIs_function);

  /**
   * @name matches
   * @method
   * @memberof Frampton.Style
   * @param {String} selector
   * @param {Object} element
   * @returns {Boolean}
   */
  module.exports = _curry['default'](function matches(selector, element) {

    if (_isFunction['default'](element.matches)) {
      return element.matches(selector);
    } else {
      var elementList = document.querySelectorAll(selector);
      var i = 0;

      while (elementList[i] && elementList[i] !== element) {
        i++;
      }

      return elementList[i] ? true : false;
    }
  });
});
define('frampton-style/remove_class', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  /**
   * @name removeClass
   * @method
   * @memberof Frampton.Style
   * @param {Object} element
   * @param {String} name
   */
  module.exports = _curry['default'](function remove_class(element, name) {
    element.classList.remove(name);
  });
});
define('frampton-style/remove_style', ['exports', 'module', 'frampton-utils/curry', 'frampton-style/supported'], function (exports, module, _framptonUtilsCurry, _framptonStyleSupported) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  var _supported = _interopRequireDefault(_framptonStyleSupported);

  /**
   * @name removeStyle
   * @method
   * @memberof Frampton.Style
   * @param {Object} element
   * @param {String} key
   */
  module.exports = _curry['default'](function remove_style(element, key) {
    element.style.removeProperty(_supported['default'](key));
  });
});
define('frampton-style/remove_styles', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  /**
   * removeStyles :: DomNode -> Object -> ()
   *
   * @name removeStyles
   * @method
   * @memberof Frampton.Style
   * @param {Object} element A dom node to remove styles from
   * @param {Object} props   A hash of properties to remove
   */
  module.exports = _curry['default'](function remove_styles(element, props) {
    for (var key in props) {
      element.style.removeProperty(key);
    }
  });
});
define('frampton-style/selector_contains', ['exports', 'module', 'frampton-utils/curry', 'frampton-html/contains'], function (exports, module, _framptonUtilsCurry, _framptonHtmlContains) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  var _contains = _interopRequireDefault(_framptonHtmlContains);

  /**
   * Searches inside all elements with the given selector and returns if one of them
   * contains the given element.
   *
   * @name selectorContains
   * @method
   * @memberof Frampton.Style
   * @param {String} selector Selector to search inside of
   * @param {Object} element  DomNode to search for
   * @returns {Boolean} Is there a match for the element?
   */
  module.exports = _curry['default'](function selector_contains(selector, element) {

    var elementList = document.querySelectorAll(selector);
    var i = 0;

    while (elementList[i] && !_contains['default'](elementList[i], element)) {
      i++;
    }

    return elementList[i] ? true : false;
  });
});
define('frampton-style/set_style', ['exports', 'module', 'frampton-utils/curry', 'frampton-style/supported'], function (exports, module, _framptonUtilsCurry, _framptonStyleSupported) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  var _supported = _interopRequireDefault(_framptonStyleSupported);

  /**
   * @name setStyle
   * @method
   * @memberof Frampton.Style
   * @param {Object} element - Element to apply style to
   * @param {String} key - Style to update
   * @param {String} value - Value of style
   */
  module.exports = _curry['default'](function set_style(element, key, value) {
    element.style.setProperty(_supported['default'](key), value, '');
  });
});
define('frampton-style/supported_by_element', ['exports', 'module', 'frampton-utils/curry', 'frampton-utils/is_something', 'frampton-string/capitalize', 'frampton-string/dash_to_camel'], function (exports, module, _framptonUtilsCurry, _framptonUtilsIs_something, _framptonStringCapitalize, _framptonStringDash_to_camel) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  var _isSomething = _interopRequireDefault(_framptonUtilsIs_something);

  var _capitalize = _interopRequireDefault(_framptonStringCapitalize);

  var _dashToCamel = _interopRequireDefault(_framptonStringDash_to_camel);

  var vendors = {
    'webkit': 'webkit',
    'Webkit': 'webkit',
    'Moz': 'moz',
    'ms': 'ms',
    'Ms': 'ms'
  };

  /**
   * @name supportedByElement
   * @method
   * @memberof Frampton.Style
   * @param {Object} element
   * @param {String} prop
   * @returns {String}
   */
  module.exports = _curry['default'](function supported_by_element(element, prop) {

    var camelProp = _dashToCamel['default'](prop);

    if (_isSomething['default'](element.style[camelProp])) {
      return prop;
    }

    for (var key in vendors) {
      var propToCheck = key + _capitalize['default'](camelProp);
      if (_isSomething['default'](element.style[propToCheck])) {
        return ('-' + vendors[key] + '-' + prop).toLowerCase();
      }
    }

    return null;
  });
});
define('frampton-style/supported_props', ['exports', 'module', 'frampton-utils/warn', 'frampton-style/supported'], function (exports, module, _framptonUtilsWarn, _framptonStyleSupported) {
  'use strict';

  module.exports = supported_props;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _warn = _interopRequireDefault(_framptonUtilsWarn);

  var _supported = _interopRequireDefault(_framptonStyleSupported);

  /**
   * @name supportedProps
   * @method
   * @memberof Frampton.Style
   * @param {Object} props
   * @returns {Object}
   */

  function supported_props(props) {
    var obj = {};
    var temp;
    for (var key in props) {
      temp = _supported['default'](key);
      if (temp) {
        obj[_supported['default'](key)] = props[key];
      } else {
        _warn['default']('style prop ' + key + ' is not supported by this browser');
      }
    }
    return obj;
  }
});
define('frampton-style/supported', ['exports', 'module', 'frampton-utils/memoize', 'frampton-style/supported_by_element'], function (exports, module, _framptonUtilsMemoize, _framptonStyleSupported_by_element) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _memoize = _interopRequireDefault(_framptonUtilsMemoize);

  var _supportedByElement = _interopRequireDefault(_framptonStyleSupported_by_element);

  /**
   * supported :: String -> String
   *
   * @name supported
   * @method
   * @memberof Frampton.Style
   * @param {String} prop A standard CSS property name
   * @returns {String} The property name with any vendor prefixes required by the browser, or null if the property is not supported
   */
  module.exports = _memoize['default'](_supportedByElement['default'](document.createElement('div')));
});
define('frampton-utils', ['exports', 'frampton/namespace', 'frampton-utils/always', 'frampton-utils/apply', 'frampton-utils/assert', 'frampton-utils/compose', 'frampton-utils/curry', 'frampton-utils/curry_n', 'frampton-utils/equal', 'frampton-utils/error', 'frampton-utils/extend', 'frampton-utils/get', 'frampton-utils/has_length', 'frampton-utils/has_prop', 'frampton-utils/identity', 'frampton-utils/immediate', 'frampton-utils/is_array', 'frampton-utils/is_boolean', 'frampton-utils/is_defined', 'frampton-utils/is_empty', 'frampton-utils/is_equal', 'frampton-utils/is_false', 'frampton-utils/is_function', 'frampton-utils/is_node', 'frampton-utils/is_nothing', 'frampton-utils/is_null', 'frampton-utils/is_number', 'frampton-utils/is_numeric', 'frampton-utils/is_object', 'frampton-utils/is_primitive', 'frampton-utils/is_promise', 'frampton-utils/is_something', 'frampton-utils/is_string', 'frampton-utils/is_true', 'frampton-utils/is_undefined', 'frampton-utils/is_value', 'frampton-utils/lazy', 'frampton-utils/log', 'frampton-utils/memoize', 'frampton-utils/noop', 'frampton-utils/not', 'frampton-utils/of_value', 'frampton-utils/once', 'frampton-utils/warn'], function (exports, _framptonNamespace, _framptonUtilsAlways, _framptonUtilsApply, _framptonUtilsAssert, _framptonUtilsCompose, _framptonUtilsCurry, _framptonUtilsCurry_n, _framptonUtilsEqual, _framptonUtilsError, _framptonUtilsExtend, _framptonUtilsGet, _framptonUtilsHas_length, _framptonUtilsHas_prop, _framptonUtilsIdentity, _framptonUtilsImmediate, _framptonUtilsIs_array, _framptonUtilsIs_boolean, _framptonUtilsIs_defined, _framptonUtilsIs_empty, _framptonUtilsIs_equal, _framptonUtilsIs_false, _framptonUtilsIs_function, _framptonUtilsIs_node, _framptonUtilsIs_nothing, _framptonUtilsIs_null, _framptonUtilsIs_number, _framptonUtilsIs_numeric, _framptonUtilsIs_object, _framptonUtilsIs_primitive, _framptonUtilsIs_promise, _framptonUtilsIs_something, _framptonUtilsIs_string, _framptonUtilsIs_true, _framptonUtilsIs_undefined, _framptonUtilsIs_value, _framptonUtilsLazy, _framptonUtilsLog, _framptonUtilsMemoize, _framptonUtilsNoop, _framptonUtilsNot, _framptonUtilsOf_value, _framptonUtilsOnce, _framptonUtilsWarn) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _Frampton = _interopRequireDefault(_framptonNamespace);

  var _always = _interopRequireDefault(_framptonUtilsAlways);

  var _apply = _interopRequireDefault(_framptonUtilsApply);

  var _assert = _interopRequireDefault(_framptonUtilsAssert);

  var _compose = _interopRequireDefault(_framptonUtilsCompose);

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  var _curryN = _interopRequireDefault(_framptonUtilsCurry_n);

  var _equal = _interopRequireDefault(_framptonUtilsEqual);

  var _error = _interopRequireDefault(_framptonUtilsError);

  var _extend = _interopRequireDefault(_framptonUtilsExtend);

  var _get = _interopRequireDefault(_framptonUtilsGet);

  var _hasLength = _interopRequireDefault(_framptonUtilsHas_length);

  var _hasProp = _interopRequireDefault(_framptonUtilsHas_prop);

  var _identity = _interopRequireDefault(_framptonUtilsIdentity);

  var _immediate = _interopRequireDefault(_framptonUtilsImmediate);

  var _isArray = _interopRequireDefault(_framptonUtilsIs_array);

  var _isBoolean = _interopRequireDefault(_framptonUtilsIs_boolean);

  var _isDefined = _interopRequireDefault(_framptonUtilsIs_defined);

  var _isEmpty = _interopRequireDefault(_framptonUtilsIs_empty);

  var _isEqual = _interopRequireDefault(_framptonUtilsIs_equal);

  var _isFalse = _interopRequireDefault(_framptonUtilsIs_false);

  var _isFunction = _interopRequireDefault(_framptonUtilsIs_function);

  var _isNode = _interopRequireDefault(_framptonUtilsIs_node);

  var _isNothing = _interopRequireDefault(_framptonUtilsIs_nothing);

  var _isNull = _interopRequireDefault(_framptonUtilsIs_null);

  var _isNumber = _interopRequireDefault(_framptonUtilsIs_number);

  var _isNumeric = _interopRequireDefault(_framptonUtilsIs_numeric);

  var _isObject = _interopRequireDefault(_framptonUtilsIs_object);

  var _isPrimitive = _interopRequireDefault(_framptonUtilsIs_primitive);

  var _isPromise = _interopRequireDefault(_framptonUtilsIs_promise);

  var _isSomething = _interopRequireDefault(_framptonUtilsIs_something);

  var _isString = _interopRequireDefault(_framptonUtilsIs_string);

  var _isTrue = _interopRequireDefault(_framptonUtilsIs_true);

  var _isUndefined = _interopRequireDefault(_framptonUtilsIs_undefined);

  var _isValue = _interopRequireDefault(_framptonUtilsIs_value);

  var _lazy = _interopRequireDefault(_framptonUtilsLazy);

  var _log = _interopRequireDefault(_framptonUtilsLog);

  var _memoize = _interopRequireDefault(_framptonUtilsMemoize);

  var _noop = _interopRequireDefault(_framptonUtilsNoop);

  var _not = _interopRequireDefault(_framptonUtilsNot);

  var _ofValue = _interopRequireDefault(_framptonUtilsOf_value);

  var _once = _interopRequireDefault(_framptonUtilsOnce);

  var _warn = _interopRequireDefault(_framptonUtilsWarn);

  /**
   * @name Utils
   * @namespace
   * @memberof Frampton
   */
  _Frampton['default'].Utils = {};
  _Frampton['default'].Utils.always = _always['default'];
  _Frampton['default'].Utils.apply = _apply['default'];
  _Frampton['default'].Utils.assert = _assert['default'];
  _Frampton['default'].Utils.compose = _compose['default'];
  _Frampton['default'].Utils.curry = _curry['default'];
  _Frampton['default'].Utils.curryN = _curryN['default'];
  _Frampton['default'].Utils.equal = _equal['default'];
  _Frampton['default'].Utils.error = _error['default'];
  _Frampton['default'].Utils.extend = _extend['default'];
  _Frampton['default'].Utils.get = _get['default'];
  _Frampton['default'].Utils.hasLength = _hasLength['default'];
  _Frampton['default'].Utils.hasProp = _hasProp['default'];
  _Frampton['default'].Utils.identity = _identity['default'];
  _Frampton['default'].Utils.immediate = _immediate['default'];
  _Frampton['default'].Utils.isArray = _isArray['default'];
  _Frampton['default'].Utils.isBoolean = _isBoolean['default'];
  _Frampton['default'].Utils.isDefined = _isDefined['default'];
  _Frampton['default'].Utils.isEmpty = _isEmpty['default'];
  _Frampton['default'].Utils.isEqual = _isEqual['default'];
  _Frampton['default'].Utils.isFalse = _isFalse['default'];
  _Frampton['default'].Utils.isFunction = _isFunction['default'];
  _Frampton['default'].Utils.isNode = _isNode['default'];
  _Frampton['default'].Utils.isNothing = _isNothing['default'];
  _Frampton['default'].Utils.isNull = _isNull['default'];
  _Frampton['default'].Utils.isNumber = _isNumber['default'];
  _Frampton['default'].Utils.isNumeric = _isNumeric['default'];
  _Frampton['default'].Utils.isObject = _isObject['default'];
  _Frampton['default'].Utils.isPrimitive = _isPrimitive['default'];
  _Frampton['default'].Utils.isPromise = _isPromise['default'];
  _Frampton['default'].Utils.isSomething = _isSomething['default'];
  _Frampton['default'].Utils.isString = _isString['default'];
  _Frampton['default'].Utils.isTrue = _isTrue['default'];
  _Frampton['default'].Utils.isUndefined = _isUndefined['default'];
  _Frampton['default'].Utils.isValue = _isValue['default'];
  _Frampton['default'].Utils.lazy = _lazy['default'];
  _Frampton['default'].Utils.log = _log['default'];
  _Frampton['default'].Utils.memoize = _memoize['default'];
  _Frampton['default'].Utils.noop = _noop['default'];
  _Frampton['default'].Utils.not = _not['default'];
  _Frampton['default'].Utils.ofValue = _ofValue['default'];
  _Frampton['default'].Utils.once = _once['default'];
  _Frampton['default'].Utils.warn = _warn['default'];
});
define('frampton-utils/always', ['exports', 'module', 'frampton-utils/curry_n'], function (exports, module, _framptonUtilsCurry_n) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curryN = _interopRequireDefault(_framptonUtilsCurry_n);

  /**
   * Create a function that always returns the same value every time
   * it is called
   *
   * @name always
   * @method
   * @memberof Frampton.Utils
   * @param {Function} fn The function to wrap.
   * @param {*} args The arguments to pass to the function.
   */
  module.exports = _curryN['default'](2, function always(fn) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var value;
    return function () {
      if (value === undefined) {
        value = fn.apply(undefined, args);
      }
      return value;
    };
  });
});
define("frampton-utils/apply", ["exports", "module"], function (exports, module) {
  /**
   * Takes a function and warps it to be called at a later time.
   *
   * @name apply
   * @method
   * @memberof Frampton.Utils
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
   *
   * @name assert
   * @method
   * @memberof Frampton.Utils
   * @param {String} msg  - Message to throw with error.
   * @param {*}    cond - A condition that evaluates to a Boolean. If false, an error is thrown.
   */
  'use strict';

  module.exports = assert;

  function assert(msg, cond) {
    if (!cond) {
      throw new Error(msg || 'An error occured'); // Boom!
    }
  }
});
define('frampton-utils/compose', ['exports', 'module', 'frampton-utils/assert', 'frampton-list/foldr', 'frampton-list/first'], function (exports, module, _framptonUtilsAssert, _framptonListFoldr, _framptonListFirst) {
  'use strict';

  module.exports = compose;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _assert = _interopRequireDefault(_framptonUtilsAssert);

  var _foldr = _interopRequireDefault(_framptonListFoldr);

  var _first = _interopRequireDefault(_framptonListFirst);

  /**
   * Compose takes any number of functions and returns a function that when
   * executed will call the passed functions in order, passing the return of
   * each function to the next function in the execution order.
   *
   * @name compose
   * @memberof Frampton.Utils
   * @method
   * @param {function} functions - Any number of function used to build the composition.
   * @returns {function} A new function that runs each of the given functions in succession
   */

  function compose() {
    for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
      fns[_key] = arguments[_key];
    }

    _assert['default']("Compose did not receive any arguments. You can't compose nothing.", fns.length > 0);
    return function composition() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return _first['default'](_foldr['default'](function (args, fn) {
        return [fn.apply(this, args)];
      }, args, fns));
    };
  }
});
define('frampton-utils/curry_n', ['exports', 'module', 'frampton-utils/assert', 'frampton-utils/is_function'], function (exports, module, _framptonUtilsAssert, _framptonUtilsIs_function) {
  'use strict';

  module.exports = curry_n;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _assert = _interopRequireDefault(_framptonUtilsAssert);

  var _isFunction = _interopRequireDefault(_framptonUtilsIs_function);

  /**
   * Takes a function and returns a new function that will wait to execute the original
   * function until it has received all of its arguments. Each time the function is called
   * without receiving all of its arguments it will return a new function waiting for the
   * remaining arguments.
   *
   * @name curryN
   * @memberof Frampton.Utils
   * @method
   * @param {Number} arity - Number of arguments for function
   * @param {Function} fn - Function to curry.
   * @returns {Function} A curried version of the function passed in.
   */

  function curry_n(arity, fn) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    _assert['default']('Argument passed to curry is not a function', _isFunction['default'](fn));

    function curried() {
      for (var _len2 = arguments.length, args2 = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args2[_key2] = arguments[_key2];
      }

      // an array of arguments for this instance of the curried function
      var locals = args.concat(args2);

      // If we have all the arguments, apply the function and return result
      if (locals.length >= arity) {
        return fn.apply(null, locals);

        // If we don't have all the arguments, return a new function that awaits remaining arguments
      } else {
          return curry_n.apply(null, [arity, fn].concat(locals));
        }
    }

    return args.length >= arity ? curried() : curried;
  }
});
define('frampton-utils/curry', ['exports', 'module', 'frampton-utils/curry_n'], function (exports, module, _framptonUtilsCurry_n) {
  'use strict';

  module.exports = curry;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curryN = _interopRequireDefault(_framptonUtilsCurry_n);

  /**
   * Takes a function and returns a new function that will wait to execute the original
   * function until it has received all of its arguments. Each time the function is called
   * without receiving all of its arguments it will return a new function waiting for the
   * remaining arguments.
   *
   * @name curry
   * @memberof Frampton.Utils
   * @method
   * @param {Function} curry - Function to curry.
   * @returns {Function} A curried version of the function passed in.
   */

  function curry(fn) {
    return _curryN['default'](fn.length, fn);
  }
});
define('frampton-utils/equal', ['exports', 'module', 'frampton-utils/is_object', 'frampton-utils/is_array'], function (exports, module, _framptonUtilsIs_object, _framptonUtilsIs_array) {
  'use strict';

  module.exports = deep_equal;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _isObject = _interopRequireDefault(_framptonUtilsIs_object);

  var _isArray = _interopRequireDefault(_framptonUtilsIs_array);

  /**
   * equal :: Object -> Object -> Boolean
   *
   * @name equal
   * @memberof Frampton.Utils
   * @method
   * @param {*} obj1
   * @param {*} obj2
   * @returns {Boolean}
   */

  function deep_equal(obj1, obj2) {

    var depth = 0;
    var original1 = obj1;
    var original2 = obj2;

    function _equal(obj1, obj2) {

      depth++;

      if (
      // If we're dealing with a circular reference, return reference equality.
      !(depth > 1 && original1 === obj1 && original2 === obj2) && (_isObject['default'](obj1) || _isArray['default'](obj1)) && (_isObject['default'](obj2) || _isArray['default'](obj2))) {

        for (var key in obj1) {
          if (!obj2 || !_equal(obj1[key], obj2[key])) {
            return false;
          }
        }

        return true;
      } else {
        return obj1 === obj2;
      }
    }

    return _equal(obj1, obj2);
  }
});
define('frampton-utils/error', ['exports', 'module', 'frampton/namespace', 'frampton-utils/is_something'], function (exports, module, _framptonNamespace, _framptonUtilsIs_something) {
  'use strict';

  module.exports = error;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _Frampton = _interopRequireDefault(_framptonNamespace);

  var _isSomething = _interopRequireDefault(_framptonUtilsIs_something);

  function error(msg, data) {

    if (_Frampton['default'].isDev()) {

      if (_isSomething['default'](console.error)) {
        if (_isSomething['default'](data)) {
          console.error(msg, data);
        } else {
          console.error(msg);
        }
      } else if (_isSomething['default'](console.log)) {
        if (_isSomething['default'](data)) {
          console.log('Error: ' + msg, data);
        } else {
          console.log('Error: ' + msg);
        }
      }
    }

    return msg;
  }
});
define('frampton-utils/extend', ['exports', 'module', 'frampton-list/foldl'], function (exports, module, _framptonListFoldl) {
  'use strict';

  module.exports = extend;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _foldl = _interopRequireDefault(_framptonListFoldl);

  /**
   * Extends one object with one or more other objects
   *
   * @name extend
   * @memberof Frampton.Utils
   * @method
   * @param {Object} base
   * @param {Object} args
   * @returns {Object}
   */

  function extend(base) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return _foldl['default'](function (acc, next) {
      for (var key in next) {
        if (next.hasOwnProperty(key)) {
          acc[key] = next[key];
        }
      }
      return acc;
    }, base, args);
  }
});
define('frampton-utils/filter', ['exports', 'module', 'frampton-utils/curry_n'], function (exports, module, _framptonUtilsCurry_n) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curryN = _interopRequireDefault(_framptonUtilsCurry_n);

  /**
   * @name filter
   * @memberof Frampton.Utils
   * @method
   * @param {Function} predicate
   * @param {Array} xs
   * @returns {*}
   */
  module.exports = _curryN['default'](2, function (predicate, xs) {
    return xs.filter(predicate);
  });
});
define('frampton-utils/get', ['exports', 'module', 'frampton-utils/curry', 'frampton-utils/is_nothing', 'frampton-utils/is_string', 'frampton-utils/is_primitive'], function (exports, module, _framptonUtilsCurry, _framptonUtilsIs_nothing, _framptonUtilsIs_string, _framptonUtilsIs_primitive) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  var _isNothing = _interopRequireDefault(_framptonUtilsIs_nothing);

  var _isString = _interopRequireDefault(_framptonUtilsIs_string);

  var _isPrimitive = _interopRequireDefault(_framptonUtilsIs_primitive);

  /**
   * get :: String -> Object -> Any
   *
   * @name get
   * @method
   * @memberof Frampton.Utils
   * @param {String} prop
   * @param {Object} obj
   * @returns {*}
   */
  module.exports = _curry['default'](function get(_x, _x2) {
    var _again = true;

    _function: while (_again) {
      var prop = _x,
          obj = _x2;
      _again = false;

      if (_isPrimitive['default'](obj) || _isNothing['default'](obj)) {
        return null;
      } else if (_isString['default'](prop)) {
        var parts = (prop || '').split('.').filter(function (val) {
          return val.trim() !== '';
        });

        if (parts.length > 1) {
          var head = parts[0];
          var tail = parts.slice(1);

          var sub = obj[head];
          if (!_isPrimitive['default'](sub)) {
            _x = tail.join('.');
            _x2 = sub;
            _again = true;
            parts = head = tail = sub = undefined;
            continue _function;
          } else {
            return null;
          }
        } else {
          return obj[parts[0]] || null;
        }
      } else {
        return obj[prop] || null;
      }
    }
  });
});
define('frampton-utils/guid', ['exports', 'module'], function (exports, module) {
  'use strict';

  module.exports = guid;
  var id = 0;

  function guid() {
    id += 1;
    return 'fr-id-' + id;
  }
});
define('frampton-utils/has_length', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  /**
   * hasLength :: Int -> [a] -> Boolean
   *
   * @name hasLength
   * @method
   * @memberof Frampton.Utils
   * @param {Number} len
   * @param {Object} obj
   * @returns {Boolean}
   */
  module.exports = _curry['default'](function has_length(len, obj) {
    return obj && obj.length && obj.length >= len ? true : false;
  });
});
define('frampton-utils/has_prop', ['exports', 'module', 'frampton-utils/curry', 'frampton-utils/get', 'frampton-utils/is_something'], function (exports, module, _framptonUtilsCurry, _framptonUtilsGet, _framptonUtilsIs_something) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  var _get = _interopRequireDefault(_framptonUtilsGet);

  var _isSomething = _interopRequireDefault(_framptonUtilsIs_something);

  /**
   * hasProp :: String -> Object -> Boolean
   *
   * @name hasProp
   * @method
   * @memberof Frampton.Utils
   * @param {String} prop
   * @param {Object} obj
   * @returns {Boolean}
   */
  module.exports = _curry['default'](function has_prop(prop, obj) {
    return _isSomething['default'](_get['default'](prop, obj));
  });
});
define("frampton-utils/identity", ["exports", "module"], function (exports, module) {
  /**
   * identity :: a -> a
   *
   * @name identity
   * @method
   * @memberof Frampton.Utils
   * @param {*} x
   * @returns {*}
   */
  "use strict";

  module.exports = identity;

  function identity(x) {
    return x;
  }
});
define("frampton-utils/immediate", ["exports", "module"], function (exports, module) {
  /**
   * immediate :: Function -> ()
   *
   * @name immediate
   * @method
   * @memberof Frampton.Utils
   * @param {Function} fn
   * @param {Object}   [context]
   */
  "use strict";

  module.exports = immediate;

  function immediate(fn, context) {
    setTimeout(fn.bind(context || null), 0);
  }
});
define("frampton-utils/is_array", ["exports", "module"], function (exports, module) {
  /**
   * Returns a boolean telling us if a given object is an array
   *
   * @name isArray
   * @method
   * @memberof Frampton.Utils
   * @param {Object} arr
   * @returns {Boolean}
   */
  "use strict";

  module.exports = is_array;

  function is_array(arr) {
    return Array.isArray ? Array.isArray(arr) : Object.prototype.toString.call(arr) === "[object Array]";
  }
});
define('frampton-utils/is_boolean', ['exports', 'module'], function (exports, module) {
  /**
   * Returns a boolean telling us if a given value is a boolean
   *
   * @name isBoolean
   * @method
   * @memberof Frampton.Utils
   * @param {*} obj
   * @returns {Boolean}
   */
  'use strict';

  module.exports = is_boolean;

  function is_boolean(obj) {
    return typeof obj === 'boolean';
  }
});
define('frampton-utils/is_defined', ['exports', 'module', 'frampton-utils/is_undefined'], function (exports, module, _framptonUtilsIs_undefined) {
  'use strict';

  module.exports = is_defined;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _isUndefined = _interopRequireDefault(_framptonUtilsIs_undefined);

  /**
   * Returns a boolean telling us if a given value is defined
   *
   * @name isDefined
   * @method
   * @memberof Frampton.Utils
   * @param {*} obj
   * @returns {Boolean}
   */

  function is_defined(obj) {
    return !_isUndefined['default'](obj);
  }
});
define('frampton-utils/is_empty', ['exports', 'module', 'frampton-utils/is_nothing'], function (exports, module, _framptonUtilsIs_nothing) {
  'use strict';

  module.exports = is_empty;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _isNothing = _interopRequireDefault(_framptonUtilsIs_nothing);

  /**
   * Returns a boolean telling us if a given value doesn't exist or has length 0
   *
   * @name isEmpty
   * @method
   * @memberof Frampton.Utils
   * @param {*} obj
   * @returns {Boolean}
   */

  function is_empty(obj) {
    return _isNothing['default'](obj) || !obj.length || 0 === obj.length;
  }
});
define('frampton-utils/is_equal', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curry = _interopRequireDefault(_framptonUtilsCurry);

  /**
   * (===) equality between two values
   *
   * @name isEqual
   * @method
   * @memberof Frampton.Utils
   * @param {*} a
   * @param {*} b
   * @returns {Boolean}
   */
  module.exports = _curry['default'](function is_equal(a, b) {
    return a === b;
  });
});
define("frampton-utils/is_false", ["exports", "module"], function (exports, module) {
  /**
   * isFalse :: a -> Boolean
   *
   * @name isFalse
   * @method
   * @memberof Frampton.Utils
   * @param {*} obj
   * @returns {Boolean}
   */
  "use strict";

  module.exports = is_false;

  function is_false(obj) {
    return obj === false;
  }
});
define('frampton-utils/is_function', ['exports', 'module'], function (exports, module) {
  /**
   * Returns true/false is the object a fucntion
   *
   * @name isFunction
   * @method
   * @memberof Frampton.Utils
   * @param {*} fn
   * @returns {Boolean}
   */
  'use strict';

  module.exports = is_function;

  function is_function(fn) {
    return typeof fn === 'function';
  }
});
define('frampton-utils/is_node', ['exports', 'module', 'frampton-utils/is_something', 'frampton-utils/is_object', 'frampton-utils/is_defined'], function (exports, module, _framptonUtilsIs_something, _framptonUtilsIs_object, _framptonUtilsIs_defined) {
  'use strict';

  module.exports = is_node;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _isSomething = _interopRequireDefault(_framptonUtilsIs_something);

  var _isObject = _interopRequireDefault(_framptonUtilsIs_object);

  var _isDefined = _interopRequireDefault(_framptonUtilsIs_defined);

  /**
   * Returns true/false is the object a DomNode
   *
   * @name isNode
   * @method
   * @memberof Frampton.Utils
   * @param {*} obj
   * @returns {Boolean}
   */

  function is_node(obj) {
    return _isSomething['default'](obj) && _isObject['default'](obj) && _isDefined['default'](obj.nodeType) && _isDefined['default'](obj.nodeName);
  }
});
define('frampton-utils/is_nothing', ['exports', 'module', 'frampton-utils/is_undefined', 'frampton-utils/is_null'], function (exports, module, _framptonUtilsIs_undefined, _framptonUtilsIs_null) {
  'use strict';

  module.exports = is_nothing;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _isUndefined = _interopRequireDefault(_framptonUtilsIs_undefined);

  var _isNull = _interopRequireDefault(_framptonUtilsIs_null);

  /**
   * Returns true/false is the object null or undefined
   *
   * @name isNothing
   * @method
   * @memberof Frampton.Utils
   * @param {*} obj
   * @returns {Boolean}
   */

  function is_nothing(obj) {
    return _isUndefined['default'](obj) || _isNull['default'](obj);
  }
});
define("frampton-utils/is_null", ["exports", "module"], function (exports, module) {
  /**
   * Returns true/false is the object null
   *
   * @name isNull
   * @method
   * @memberof Frampton.Utils
   * @param {*} obj
   * @returns {Boolean}
   */
  "use strict";

  module.exports = is_null;

  function is_null(obj) {
    return obj === null;
  }
});
define('frampton-utils/is_number', ['exports', 'module'], function (exports, module) {
  /**
   * Returns true/false is the object a number
   *
   * @name isNumber
   * @method
   * @memberof Frampton.Utils
   * @param {*} obj
   * @returns {Boolean}
   */
  'use strict';

  module.exports = is_number;

  function is_number(obj) {
    return typeof obj === 'number';
  }
});
define("frampton-utils/is_numeric", ["exports", "module"], function (exports, module) {
  "use strict";

  module.exports = is_numeric;

  function is_numeric(val) {
    return !isNaN(val);
  }
});
define('frampton-utils/is_object', ['exports', 'module', 'frampton-utils/is_something', 'frampton-utils/is_array'], function (exports, module, _framptonUtilsIs_something, _framptonUtilsIs_array) {
  'use strict';

  module.exports = isObject;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _isSomething = _interopRequireDefault(_framptonUtilsIs_something);

  var _isArray = _interopRequireDefault(_framptonUtilsIs_array);

  /**
   * Returns true/false is the object a regular Object
   *
   * @name isObject
   * @method
   * @memberof Frampton.Utils
   * @param {*} obj
   * @returns {Boolean}
   */

  function isObject(obj) {
    return _isSomething['default'](obj) && !_isArray['default'](obj) && typeof obj === 'object';
  }
});
define('frampton-utils/is_primitive', ['exports', 'module', 'frampton-utils/is_number', 'frampton-utils/is_boolean', 'frampton-utils/is_string'], function (exports, module, _framptonUtilsIs_number, _framptonUtilsIs_boolean, _framptonUtilsIs_string) {
  'use strict';

  module.exports = is_primitive;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _isNumber = _interopRequireDefault(_framptonUtilsIs_number);

  var _isBoolean = _interopRequireDefault(_framptonUtilsIs_boolean);

  var _isString = _interopRequireDefault(_framptonUtilsIs_string);

  /**
   * Returns true/false is the value a primitive value
   *
   * @name isPrimitive
   * @method
   * @memberof Frampton.Utils
   * @param {*} obj
   * @returns {Boolean}
   */

  function is_primitive(obj) {
    return _isNumber['default'](obj) || _isBoolean['default'](obj) || _isString['default'](obj);
  }
});
define('frampton-utils/is_promise', ['exports', 'module', 'frampton-utils/is_object', 'frampton-utils/is_function'], function (exports, module, _framptonUtilsIs_object, _framptonUtilsIs_function) {
  'use strict';

  module.exports = is_promise;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _isObject = _interopRequireDefault(_framptonUtilsIs_object);

  var _isFunction = _interopRequireDefault(_framptonUtilsIs_function);

  /**
   * Returns true/false indicating if object appears to be a Promise
   *
   * @name isPromise
   * @method
   * @memberof Frampton.Utils
   * @param {*} obj
   * @returns {Boolean}
   */

  function is_promise(obj) {
    return _isObject['default'](obj) && _isFunction['default'](obj.then);
  }
});
define('frampton-utils/is_something', ['exports', 'module', 'frampton-utils/is_nothing'], function (exports, module, _framptonUtilsIs_nothing) {
  'use strict';

  module.exports = is_something;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _isNothing = _interopRequireDefault(_framptonUtilsIs_nothing);

  /**
   * Returns true/false indicating if object is not null or undefined
   *
   * @name isSomething
   * @method
   * @memberof Frampton.Utils
   * @param {*} obj
   * @returns {Boolean}
   */

  function is_something(obj) {
    return !_isNothing['default'](obj);
  }
});
define('frampton-utils/is_string', ['exports', 'module'], function (exports, module) {
  /**
   * Returns true/false indicating if object is a String
   *
   * @name isString
   * @method
   * @memberof Frampton.Utils
   * @param {*} obj
   * @returns {Boolean}
   */
  'use strict';

  module.exports = is_string;

  function is_string(obj) {
    return typeof obj === 'string';
  }
});
define("frampton-utils/is_true", ["exports", "module"], function (exports, module) {
  /**
   * isTrue :: a -> Boolean
   *
   * @name isTrue
   * @method
   * @memberof Frampton.Utils
   * @param {*} obj
   * @returns {Boolean}
   */
  "use strict";

  module.exports = is_true;

  function is_true(obj) {
    return obj === true;
  }
});
define('frampton-utils/is_undefined', ['exports', 'module'], function (exports, module) {
  /**
   * Returns true/false indicating if object is undefined
   *
   * @name isUndefined
   * @method
   * @memberof Frampton.Utils
   * @param {*} obj
   * @returns {Boolean}
   */
  'use strict';

  module.exports = is_undefined;

  function is_undefined(obj) {
    return typeof obj === 'undefined';
  }
});
define("frampton-utils/is_value", ["exports", "module"], function (exports, module) {
  "use strict";

  module.exports = is_value;

  function is_value(test) {
    return function (val) {
      return val === test;
    };
  }
});
define('frampton-utils/lazy', ['exports', 'module', 'frampton-utils/curry_n'], function (exports, module, _framptonUtilsCurry_n) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curryN = _interopRequireDefault(_framptonUtilsCurry_n);

  /**
   * Takes a function and warps it to be called at a later time.
   *
   * @name lazy
   * @method
   * @memberof Frampton.Utils
   * @param {Function} fn The function to wrap.
   * @param {Array} args Array of arguments to pass to the function when called.
   */
  module.exports = _curryN['default'](2, function lazy(fn, args) {
    return function () {
      return fn.apply(null, args);
    };
  });
});
define('frampton-utils/log', ['exports', 'module', 'frampton/namespace', 'frampton-utils/is_something'], function (exports, module, _framptonNamespace, _framptonUtilsIs_something) {
  'use strict';

  module.exports = log;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _Frampton = _interopRequireDefault(_framptonNamespace);

  var _isSomething = _interopRequireDefault(_framptonUtilsIs_something);

  function log(msg, data) {

    if (_Frampton['default'].isDev() && _isSomething['default'](console.log)) {
      if (_isSomething['default'](data)) {
        console.log(msg, data);
      } else {
        console.log(msg);
      }
    }

    return msg;
  }
});
define('frampton-utils/map', ['exports', 'module', 'frampton-utils/curry_n'], function (exports, module, _framptonUtilsCurry_n) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curryN = _interopRequireDefault(_framptonUtilsCurry_n);

  /**
   * @name map
   * @method
   * @memberof Frampton.Utils
   * @param {Function} fn - The function to apply to the array
   * @param {Array} xs - The array to apply the mapping function to
   * @returns {Array} A new array transfomred by the mapping function
   */
  module.exports = _curryN['default'](2, function (fn, xs) {
    return xs.map(fn);
  });
});
define('frampton-utils/memoize', ['exports', 'module', 'frampton-utils/is_string', 'frampton-utils/is_number'], function (exports, module, _framptonUtilsIs_string, _framptonUtilsIs_number) {
  'use strict';

  module.exports = memoize;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _isString = _interopRequireDefault(_framptonUtilsIs_string);

  var _isNumber = _interopRequireDefault(_framptonUtilsIs_number);

  /**
   * @name memoize
   * @method
   * @memberof Frampton.Utils
   * @param {Function} fn
   * @returns {Function}
   */

  function memoize(fn) {

    var store = {};
    var len = fn.length;

    return function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var key = len === 1 && (_isString['default'](args[0]) || _isNumber['default'](args[0])) ? args[0] : JSON.stringify(args);

      if (key in store) {
        return store[key];
      } else {
        return store[key] = fn.apply(undefined, args);
      }
    };
  }
});
define("frampton-utils/noop", ["exports", "module"], function (exports, module) {
  /**
   * @name noop
   * @method
   * @memberof Frampton.Utils
   */
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
define('frampton-utils/not', ['exports', 'module', 'frampton-utils/curry_n', 'frampton-utils/to_boolean'], function (exports, module, _framptonUtilsCurry_n, _framptonUtilsTo_boolean) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _curryN = _interopRequireDefault(_framptonUtilsCurry_n);

  var _toBoolean = _interopRequireDefault(_framptonUtilsTo_boolean);

  /**
   * not :: Function -> a -> Boolean
   *
   * @name not
   * @method
   * @memberof Frampton.Utils
   * @param {Function} fn
   * @returns {Boolean}
   */
  module.exports = _curryN['default'](2, function (fn, arg) {
    return !_toBoolean['default'](fn(arg));
  });
});
define("frampton-utils/of_value", ["exports", "module"], function (exports, module) {
  /**
   * Creates a function that always returns the specified value.
   *
   * @name ofValue
   * @method
   * @memberof Frampton.Utils
   * @param {*} value
   * @returns {Function}
   */
  "use strict";

  module.exports = of_value;

  function of_value(value) {
    return function () {
      return value;
    };
  }
});
define('frampton-utils/once', ['exports', 'module', 'frampton-utils/warn'], function (exports, module, _framptonUtilsWarn) {
  'use strict';

  module.exports = once;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _warn = _interopRequireDefault(_framptonUtilsWarn);

  /**
   * Create a function that can only be called once.
   *
   * @name once
   * @method
   * @memberof Frampton.Utils
   * @param {Function} fn
   * @returns {Function}
   */

  function once(fn) {
    var called = false;
    return function () {
      if (called === false) {
        called = true;
        return fn.apply(undefined, arguments);
      } else {
        _warn['default']('Once function called multiple times');
      }
    };
  }
});
define("frampton-utils/to_boolean", ["exports", "module"], function (exports, module) {
  /**
   * Read value as true Boolean (true | false)
   *
   * @name toBoolean
   * @method
   * @memberof Frampton.Utils
   * @param {*} val
   * @returns {Boolean} true if val is truthy, false if falsy
   */
  "use strict";

  module.exports = function (val) {
    return !!val;
  };
});
define('frampton-utils/warn', ['exports', 'module', 'frampton/namespace', 'frampton-utils/is_something'], function (exports, module, _framptonNamespace, _framptonUtilsIs_something) {
  'use strict';

  module.exports = warn;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _Frampton = _interopRequireDefault(_framptonNamespace);

  var _isSomething = _interopRequireDefault(_framptonUtilsIs_something);

  function warn(msg, data) {

    if (_Frampton['default'].isDev()) {

      if (_isSomething['default'](console.warn)) {
        if (_isSomething['default'](data)) {
          console.warn(msg, data);
        } else {
          console.warn(msg);
        }
      } else if (_isSomething['default'](console.log)) {
        if (_isSomething['default'](data)) {
          console.log(msg, data);
        } else {
          console.log(msg);
        }
      }
    }

    return msg;
  }
});
define('frampton-window', ['exports', 'frampton/namespace', 'frampton-window/window'], function (exports, _framptonNamespace, _framptonWindowWindow) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _Frampton = _interopRequireDefault(_framptonNamespace);

  var _Window = _interopRequireDefault(_framptonWindowWindow);

  _Frampton['default'].Window = _Window['default'];
});
define('frampton-window/window', ['exports', 'module', 'frampton-signal/stepper', 'frampton-events/on_event', 'frampton-utils/get', 'frampton-utils/is_something'], function (exports, module, _framptonSignalStepper, _framptonEventsOn_event, _framptonUtilsGet, _framptonUtilsIs_something) {
  'use strict';

  module.exports = Window;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _stepper = _interopRequireDefault(_framptonSignalStepper);

  var _onEvent = _interopRequireDefault(_framptonEventsOn_event);

  var _get = _interopRequireDefault(_framptonUtilsGet);

  var _isSomething = _interopRequireDefault(_framptonUtilsIs_something);

  var element = null;
  var resize = _onEvent['default']('resize', window);
  var dimensions = _stepper['default']([getWidth(), getHeight()], resize.map(update));
  var width = _stepper['default'](getWidth(), dimensions.map(_get['default'](0)));
  var height = _stepper['default'](getHeight(), dimensions.map(_get['default'](1)));

  function getWidth() {
    return _isSomething['default'](element) ? element.clientWidth : window.innerWidth;
  }

  function getHeight() {
    return _isSomething['default'](element) ? element.clientHeight : window.innerHeight;
  }

  function update() {
    var w = getWidth();
    var h = getHeight();
    return [w, h];
  }

  /**
   * @typedef Window
   * @type Object
   * @property {Frampton.Signal} dimensions - A Signal of the window dimensions
   * @property {Frampton.Signal} width      - A Signal of with window width
   * @property {Frampton.Signal} height     - A Signal of the window height
   * @property {Frampton.Signal} resize     - A Signal of window resize events
   */

  /**
   * @name Window
   * @method
   * @namespace
   * @memberof Frampton
   * @param {Object} [element] - DomNode to act as applicaton window
   * @returns {Window}
   */

  function Window(element) {
    element = element;
    return {
      dimensions: dimensions,
      width: width,
      height: height,
      resize: resize
    };
  }
});
define('frampton', ['exports', 'module', 'frampton/namespace', 'frampton-utils', 'frampton-list', 'frampton-record', 'frampton-string', 'frampton-math', 'frampton-events', 'frampton-data', 'frampton-signal', 'frampton-mouse', 'frampton-keyboard', 'frampton-window', 'frampton-html', 'frampton-style'], function (exports, module, _framptonNamespace, _framptonUtils, _framptonList, _framptonRecord, _framptonString, _framptonMath, _framptonEvents, _framptonData, _framptonSignal, _framptonMouse, _framptonKeyboard, _framptonWindow, _framptonHtml, _framptonStyle) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _Frampton = _interopRequireDefault(_framptonNamespace);

  module.exports = _Frampton['default'];
});
define('frampton/namespace', ['exports', 'module'], function (exports, module) {
  /*globals Frampton:true */

  /**
   * The parent namespace for everything else in Frampton
   *
   * @name Frampton
   * @namespace
   */
  'use strict';

  Frampton.VERSION = '0.1.7';

  Frampton.TEST = 'test';

  Frampton.DEV = 'dev';

  Frampton.PROD = 'prod';

  if (typeof Frampton.ENV === 'undefined') {
    Frampton.ENV = {};
  }

  if (typeof Frampton.ENV.MODE === 'undefined') {
    Frampton.ENV.MODE = Frampton.PROD;
  }

  if (typeof Frampton.ENV.MOCK === 'undefined') {
    Frampton.ENV.MOCK = {};
  }

  Frampton.mock = function (key) {
    return Frampton.ENV.MOCK && Frampton.ENV.MOCK[key] ? Frampton.ENV.MOCK[key] : null;
  };

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
require("frampton");

})();