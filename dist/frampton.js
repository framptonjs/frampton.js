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

    require = function(name) {
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
define('frampton-data', ['exports', 'frampton/namespace', 'frampton-data/task/create', 'frampton-data/task/fail', 'frampton-data/task/never', 'frampton-data/task/sequence', 'frampton-data/task/succeed', 'frampton-data/task/when', 'frampton-data/task/execute', 'frampton-data/union/create', 'frampton-data/state/create'], function (exports, _framptonNamespace, _framptonDataTaskCreate, _framptonDataTaskFail, _framptonDataTaskNever, _framptonDataTaskSequence, _framptonDataTaskSucceed, _framptonDataTaskWhen, _framptonDataTaskExecute, _framptonDataUnionCreate, _framptonDataStateCreate) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Frampton = _interopRequire(_framptonNamespace);

  var _createTask = _interopRequire(_framptonDataTaskCreate);

  var _fail = _interopRequire(_framptonDataTaskFail);

  var _never = _interopRequire(_framptonDataTaskNever);

  var _sequence = _interopRequire(_framptonDataTaskSequence);

  var _succeed = _interopRequire(_framptonDataTaskSucceed);

  var _when = _interopRequire(_framptonDataTaskWhen);

  var _execute = _interopRequire(_framptonDataTaskExecute);

  var _createUnion = _interopRequire(_framptonDataUnionCreate);

  var _createState = _interopRequire(_framptonDataStateCreate);

  /**
   * @name Data
   * @namespace
   * @memberof Frampton
   */
  _Frampton.Data = {};

  /**
   * @name Task
   * @memberof Frampton.Data
   * @namespace
   */
  _Frampton.Data.Task = {};
  _Frampton.Data.Task.create = _createTask;
  _Frampton.Data.Task.fail = _fail;
  _Frampton.Data.Task.succeed = _succeed;
  _Frampton.Data.Task.never = _never;
  _Frampton.Data.Task.sequence = _sequence;
  _Frampton.Data.Task.when = _when;
  _Frampton.Data.Task.execute = _execute;

  /**
   * @name Union
   * @memberof Frampton.Data
   * @namespace
   */
  _Frampton.Data.Union = {};
  _Frampton.Data.Union.create = _createUnion;

  /**
   * @name State
   * @memberof Frampton.Data
   * @namespace
   */
  _Frampton.Data.State = {};
  _Frampton.Data.State.create = _createState;
});
define('frampton-data/state/create', ['exports', 'module', 'frampton-utils/guid', 'frampton-utils/is_nothing', 'frampton-record/merge', 'frampton-record/keys'], function (exports, module, _framptonUtilsGuid, _framptonUtilsIs_nothing, _framptonRecordMerge, _framptonRecordKeys) {
  'use strict';

  module.exports = create_state;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _guid = _interopRequire(_framptonUtilsGuid);

  var _isNothing = _interopRequire(_framptonUtilsIs_nothing);

  var _merge = _interopRequire(_framptonRecordMerge);

  var _keys = _interopRequire(_framptonRecordKeys);

  function create_state(data, id, props) {

    var _id = id || (0, _guid)();
    var _props = props || (0, _keys)(data);

    var model = function model(update) {
      if ((0, _isNothing)(update)) {
        return Object.freeze(data);
      } else {
        return create_state((0, _merge)(data, update), _id, _props);
      }
    };

    // private
    model._id = _id;
    model._props = _props;

    // public
    for (var i = 0; i < _props.length; i++) {
      model[_props[i]] = data[_props[i]];
    }

    return Object.freeze(model);
  }
});
define('frampton-data/task/create', ['exports', 'module', 'frampton-utils/immediate', 'frampton-utils/is_function', 'frampton-utils/noop', 'frampton-utils/of_value'], function (exports, module, _framptonUtilsImmediate, _framptonUtilsIs_function, _framptonUtilsNoop, _framptonUtilsOf_value) {
  'use strict';

  module.exports = create_task;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _immediate = _interopRequire(_framptonUtilsImmediate);

  var _isFunction = _interopRequire(_framptonUtilsIs_function);

  var _noop = _interopRequire(_framptonUtilsNoop);

  var _ofValue = _interopRequire(_framptonUtilsOf_value);

  /**
   * Lazy, possibly async, error-throwing tasks
   *
   * @name Task
   * @memberof Frampton.Task
   * @class
   * @param {function} task The computation we need to run
   */
  function Task(task) {
    this.fn = task;
  }

  Task.of = function (val) {
    return new Task(function (sinks) {
      sinks.resolve(val);
    });
  };

  /**
   * of(return) :: a -> Success a
   *
   * @name of
   * @method
   * @private
   * @memberof Frampton.Data.Task#
   * @param {*} val Value to resolve task with
   * @returns {Frampton.Data.Task}
   */
  Task.prototype.of = function (val) {
    return new Task(function (sinks) {
      sinks.resolve(val);
    });
  };

  // Wraps the computation of the task to ensure all tasks are async.
  Task.prototype.run = function (sinks) {
    var _this = this;

    (0, _immediate)(function () {
      try {
        _this.fn(sinks);
      } catch (e) {
        sinks.reject(e);
      }
    });
  };

  /**
   * join :: Task x (Task x a) -> Task x a
   *
   * @name join
   * @method
   * @private
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
        progress: _noop
      });
    });
  };

  /**
   * concat(>>) :: Task x a -> Task x b -> Task x b
   *
   * @name concat
   * @method
   * @private
   * @memberof Frampton.Data.Task#
   * @param {Frampton.Data.Task} task Task to run after this task
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
        progress: _noop
      });
    });
  };

  /**
   * chain(>>=) :: Task x a -> (a -> Task x b) -> Task x b
   *
   * @name chain
   * @method
   * @private
   * @memberof Frampton.Data.Task#
   * @param {Function} mapping Task-returning function to run after this task
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
   * @private
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
   * @name recover
   * @method
   * @private
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
   * @name default
   * @method
   * @private
   * @memberof Frampton.Data.Task#
   * @param {*} val A value to map errors to
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
   * @private
   * @memberof Frampton.Data.Task#
   * @param {Function} mapping
   * @returns {Frampton.Data.Task}
   */
  Task.prototype.progress = function (mapping) {
    var source = this;
    var mappingFn = (0, _isFunction)(mapping) ? mapping : (0, _ofValue)(mapping);
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
   * @name recover
   * @method
   * @private
   * @memberof Frampton.Data.Task#
   * @param {Function} mapping
   * @returns {Frampton.Data.Task}
   */
  Task.prototype.map = function (mapping) {
    var source = this;
    var mappingFn = (0, _isFunction)(mapping) ? mapping : (0, _ofValue)(mapping);
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

  function create_task(computation) {
    return new Task(computation);
  }
});
define('frampton-data/task/execute', ['exports', 'module', 'frampton-utils/log', 'frampton-utils/warn'], function (exports, module, _framptonUtilsLog, _framptonUtilsWarn) {
  'use strict';

  /**
   * execute :: Signal Task x a -> Signal a -> ()
   *
   * When we get a task on the tasks signal, run it and push the value
   * onto the values signal. Tasks that are rejected in execute are
   * ignored. It is suggested to use task that handle their errors with
   * the recover method.
   *
   * @name execute
   * @memberof Frampton.Task
   * @static
   * @param {Frampton.Signals.Signal} tasks
   * @param {Frampton.Signal.Signal} value
   */
  module.exports = execute;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _log = _interopRequire(_framptonUtilsLog);

  var _warn = _interopRequire(_framptonUtilsWarn);

  function execute(tasks, value) {
    tasks.value(function (task) {
      task.run({
        reject: function reject(err) {
          (0, _warn)('Error running task: ', err);
        },
        resolve: function resolve(val) {
          value(val);
        },
        progress: function progress(val) {
          (0, _log)('Task progress: ', val);
        }
      });
    });
  }
});
define('frampton-data/task/fail', ['exports', 'module', 'frampton-data/task/create'], function (exports, module, _framptonDataTaskCreate) {
  'use strict';

  //+ fail :: x -> Task x a
  module.exports = fail;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _create = _interopRequire(_framptonDataTaskCreate);

  function fail(err) {
    return (0, _create)(function (sinks) {
      return sinks.reject(err);
    });
  }
});
define('frampton-data/task/never', ['exports', 'module', 'frampton-data/task/create'], function (exports, module, _framptonDataTaskCreate) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _create = _interopRequire(_framptonDataTaskCreate);

  module.exports = function () {
    return (0, _create)(function () {});
  };
});
define("frampton-data/task/sequence", ["exports", "module"], function (exports, module) {
  //+ sequence :: [Task x a] -> Task x a
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

  //+ succeed :: a -> Task x a
  module.exports = succeed;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _create = _interopRequire(_framptonDataTaskCreate);

  function succeed(val) {
    return (0, _create)(function (sinks) {
      return sinks.resolve(val);
    });
  }
});
define('frampton-data/task/when', ['exports', 'module', 'frampton-data/task/create'], function (exports, module, _framptonDataTaskCreate) {
  'use strict';

  //+ when :: [Task x a] -> Task x [a]
  module.exports = when;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _create = _interopRequire(_framptonDataTaskCreate);

  function when() {
    for (var _len = arguments.length, tasks = Array(_len), _key = 0; _key < _len; _key++) {
      tasks[_key] = arguments[_key];
    }

    return (0, _create)(function (sinks) {

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
define('frampton-data/union/create', ['exports', 'module', 'frampton-utils/curry_n', 'frampton-utils/is_nothing', 'frampton-utils/is_something', 'frampton-utils/is_array', 'frampton-record/keys', 'frampton-data/union/validator', 'frampton-data/union/validate_args', 'frampton-data/union/validate_options', 'frampton-data/union/wildcard', 'frampton-data/union/validate_case'], function (exports, module, _framptonUtilsCurry_n, _framptonUtilsIs_nothing, _framptonUtilsIs_something, _framptonUtilsIs_array, _framptonRecordKeys, _framptonDataUnionValidator, _framptonDataUnionValidate_args, _framptonDataUnionValidate_options, _framptonDataUnionWildcard, _framptonDataUnionValidate_case) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curryN = _interopRequire(_framptonUtilsCurry_n);

  var _isNothing = _interopRequire(_framptonUtilsIs_nothing);

  var _isSomething = _interopRequire(_framptonUtilsIs_something);

  var _isArray = _interopRequire(_framptonUtilsIs_array);

  var _getKeys = _interopRequire(_framptonRecordKeys);

  var _validator = _interopRequire(_framptonDataUnionValidator);

  var _validateArgs = _interopRequire(_framptonDataUnionValidate_args);

  var _validateOptions = _interopRequire(_framptonDataUnionValidate_options);

  var _wildcard = _interopRequire(_framptonDataUnionWildcard);

  var _validateCase = _interopRequire(_framptonDataUnionValidate_case);

  var caseOf = function caseOf(parent, cases, val) {

    (0, _validateCase)(parent, val);
    (0, _validateOptions)(parent, cases);
    var match = (0, _isSomething)(cases[val.ctor]) ? cases[val.ctor] : cases[_wildcard];

    if ((0, _isNothing)(match)) {
      throw new Error('No match for value with name: ' + val.ctor);
    }

    // Destructure arguments for passing to callback
    return match.apply(null, val.values);
  };

  var createType = function createType(parent, name, fields) {

    var len = fields.length;
    var validators = fields.map(function (field) {
      return (0, _validator)(parent, field);
    });

    if (!(0, _isArray)(fields)) {
      throw new TypeError('Union must receive an array of fields for each type');
    }

    var constructor = function constructor() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var child = {};
      child.constructor = parent;
      if (!(0, _validateArgs)(validators, args)) {
        throw new TypeError('Union type ' + name + ' recieved an unknown argument');
      }
      child.ctor = name;
      child.values = args;
      return Object.freeze(child);
    };

    return len > 0 ? (0, _curryN)(len, constructor) : constructor;
  };

  // Creates constructors for each type described in config

  module.exports = function (config) {
    var obj = {};
    var keys = (0, _getKeys)(config);
    obj.prototype = {};
    obj.ctor = 'Union';
    obj.keys = keys;
    obj.match = (0, _curryN)(3, caseOf, obj);
    for (var key in config) {
      obj[key] = createType(obj, key, config[key]);
    }
    return Object.freeze(obj);
  };
});
define('frampton-data/union/object_validator', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  module.exports = (0, _curry)(function object_validator(parent, child) {
    return child.constructor === parent;
  });
});
define('frampton-data/union/validate_args', ['exports', 'module', 'frampton-utils/is_undefined'], function (exports, module, _framptonUtilsIs_undefined) {
  'use strict';

  module.exports = validate_args;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isUndefined = _interopRequire(_framptonUtilsIs_undefined);

  function validate_args(validators, args) {
    for (var i = 0; i < validators.length; i++) {
      if ((0, _isUndefined)(args[i]) || !validators[i](args[i])) {
        return false;
      }
    }
    return true;
  }
});
define('frampton-data/union/validate_case', ['exports', 'module', 'frampton-utils/curry', 'frampton-utils/is_object', 'frampton-data/union/object_validator'], function (exports, module, _framptonUtilsCurry, _framptonUtilsIs_object, _framptonDataUnionObject_validator) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _isObject = _interopRequire(_framptonUtilsIs_object);

  var _objectValidator = _interopRequire(_framptonDataUnionObject_validator);

  module.exports = (0, _curry)(function validate_case(parent, child) {
    if (!(0, _objectValidator)(parent, child)) {
      if ((0, _isObject)(child) && child.ctor) {
        throw new TypeError('Match received unrecognized type: ' + child.ctor);
      } else {
        throw new TypeError('Match received unrecognized type');
      }
    }
  });
});
define('frampton-data/union/validate_options', ['exports', 'module', 'frampton-utils/warn', 'frampton-data/union/wildcard'], function (exports, module, _framptonUtilsWarn, _framptonDataUnionWildcard) {
  'use strict';

  module.exports = validate_options;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _warn = _interopRequire(_framptonUtilsWarn);

  var _wildcard = _interopRequire(_framptonDataUnionWildcard);

  function validate_options(obj, cases) {
    for (var i = 0; i < obj.keys.length; i++) {
      if (!cases.hasOwnProperty(_wildcard) && !cases.hasOwnProperty(obj.keys[i])) {
        (0, _warn)('Non-exhaustive pattern match for case: ', obj.keys[i]);
      }
    }
  }
});
define('frampton-data/union/validator', ['exports', 'module', 'frampton-utils/is_boolean', 'frampton-utils/is_array', 'frampton-utils/is_number', 'frampton-utils/is_string', 'frampton-utils/is_function', 'frampton-utils/is_node', 'frampton-data/union/object_validator'], function (exports, module, _framptonUtilsIs_boolean, _framptonUtilsIs_array, _framptonUtilsIs_number, _framptonUtilsIs_string, _framptonUtilsIs_function, _framptonUtilsIs_node, _framptonDataUnionObject_validator) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isBoolean = _interopRequire(_framptonUtilsIs_boolean);

  var _isArray = _interopRequire(_framptonUtilsIs_array);

  var _isNumber = _interopRequire(_framptonUtilsIs_number);

  var _isString = _interopRequire(_framptonUtilsIs_string);

  var _isFunction = _interopRequire(_framptonUtilsIs_function);

  var _isNode = _interopRequire(_framptonUtilsIs_node);

  var _objectValidator = _interopRequire(_framptonDataUnionObject_validator);

  module.exports = function (parent, type) {

    switch (type) {
      case String:
        return _isString;

      case Number:
        return _isNumber;

      case Function:
        return _isFunction;

      case Boolean:
        return _isBoolean;

      case Array:
        return _isArray;

      case Element:
        return _isNode;

      case Node:
        return _isNode;

      case undefined:
        return (0, _objectValidator)(parent);

      default:
        return (0, _objectValidator)(type);
    }

    return false;
  };
});
define('frampton-data/union/wildcard', ['exports', 'module'], function (exports, module) {
  'use strict';

  module.exports = '_';
});
define('frampton-events', ['exports', 'frampton/namespace', 'frampton-events/on_event', 'frampton-events/on_selector', 'frampton-events/contains', 'frampton-events/event_target', 'frampton-events/event_value', 'frampton-events/get_position', 'frampton-events/get_position_relative', 'frampton-events/has_selector', 'frampton-events/contains_selector', 'frampton-events/selector_contains', 'frampton-events/closest_to_event', 'frampton-events/prevent_default'], function (exports, _framptonNamespace, _framptonEventsOn_event, _framptonEventsOn_selector, _framptonEventsContains, _framptonEventsEvent_target, _framptonEventsEvent_value, _framptonEventsGet_position, _framptonEventsGet_position_relative, _framptonEventsHas_selector, _framptonEventsContains_selector, _framptonEventsSelector_contains, _framptonEventsClosest_to_event, _framptonEventsPrevent_default) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Frampton = _interopRequire(_framptonNamespace);

  var _onEvent = _interopRequire(_framptonEventsOn_event);

  var _onSelector = _interopRequire(_framptonEventsOn_selector);

  var _contains = _interopRequire(_framptonEventsContains);

  var _eventTarget = _interopRequire(_framptonEventsEvent_target);

  var _eventValue = _interopRequire(_framptonEventsEvent_value);

  var _getPosition = _interopRequire(_framptonEventsGet_position);

  var _getPositionRelative = _interopRequire(_framptonEventsGet_position_relative);

  var _hasSelector = _interopRequire(_framptonEventsHas_selector);

  var _containsSelector = _interopRequire(_framptonEventsContains_selector);

  var _selectorContains = _interopRequire(_framptonEventsSelector_contains);

  var _closestToEvent = _interopRequire(_framptonEventsClosest_to_event);

  var _preventDefault = _interopRequire(_framptonEventsPrevent_default);

  /**
   * @name Events
   * @namespace
   * @memberof Frampton
   */
  _Frampton.Events = {};
  _Frampton.Events.onEvent = _onEvent;
  _Frampton.Events.onSelector = _onSelector;
  _Frampton.Events.contains = _contains;
  _Frampton.Events.eventTarget = _eventTarget;
  _Frampton.Events.eventValue = _eventValue;
  _Frampton.Events.hasSelector = _hasSelector;
  _Frampton.Events.containsSelector = _containsSelector;
  _Frampton.Events.selectorContains = _selectorContains;
  _Frampton.Events.getPosition = _getPosition;
  _Frampton.Events.getPositionRelative = _getPositionRelative;
  _Frampton.Events.closestToEvent = _closestToEvent;
  _Frampton.Events.preventDefault = _preventDefault;
});
define('frampton-events/closest_to_event', ['exports', 'module', 'frampton-utils/curry', 'frampton-utils/compose', 'frampton-style/closest', 'frampton-events/event_target'], function (exports, module, _framptonUtilsCurry, _framptonUtilsCompose, _framptonStyleClosest, _framptonEventsEvent_target) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _compose = _interopRequire(_framptonUtilsCompose);

  var _closest = _interopRequire(_framptonStyleClosest);

  var _eventTarget = _interopRequire(_framptonEventsEvent_target);

  /**
   * closestToEvent :: String -> DomEvent -> DomNode
   *
   * @name closestToEvent
   * @memberof Frampton.Events
   * @static
   * @param {String} selector
   * @param {Object} evt
   * @returns {Object} A DomNode matching the given selector
   */
  module.exports = (0, _curry)(function closest_to_event(selector, evt) {
    return (0, _compose)((0, _closest)(selector), _eventTarget)(evt);
  });
});
define('frampton-events/contains', ['exports', 'module', 'frampton-utils/curry', 'frampton-utils/compose', 'frampton-html/contains', 'frampton-events/event_target'], function (exports, module, _framptonUtilsCurry, _framptonUtilsCompose, _framptonHtmlContains, _framptonEventsEvent_target) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _compose = _interopRequire(_framptonUtilsCompose);

  var _contains = _interopRequire(_framptonHtmlContains);

  var _eventTarget = _interopRequire(_framptonEventsEvent_target);

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
  module.exports = (0, _curry)(function curried_contains(element, evt) {
    return (0, _compose)((0, _contains)(element), _eventTarget)(evt);
  });
});
define('frampton-events/contains_selector', ['exports', 'module', 'frampton-utils/curry', 'frampton-utils/compose', 'frampton-style/contains', 'frampton-events/event_target'], function (exports, module, _framptonUtilsCurry, _framptonUtilsCompose, _framptonStyleContains, _framptonEventsEvent_target) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _compose = _interopRequire(_framptonUtilsCompose);

  var _contains = _interopRequire(_framptonStyleContains);

  var _eventTarget = _interopRequire(_framptonEventsEvent_target);

  /**
   * containsSelector :: String -> DomEvent -> Boolean
   *
   * @name containsSelector
   * @static
   * @memberof Frampton.Events
   * @param {String} selector A selector to test
   * @param {Object} evt      An event object whose target will be tested against
   * @returns {Boolean}       Does the event target, or one of its children, have the given selector
   */
  module.exports = (0, _curry)(function contains_selector(selector, evt) {
    return (0, _compose)((0, _contains)(selector), _eventTarget)(evt);
  });
});
define('frampton-events/document_cache', ['exports', 'module', 'frampton-events/simple_cache'], function (exports, module, _framptonEventsSimple_cache) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _simpleCahce = _interopRequire(_framptonEventsSimple_cache);

  module.exports = (0, _simpleCahce)();
});
define('frampton-events/event_dispatcher', ['exports', 'frampton-utils/assert', 'frampton-utils/is_function', 'frampton-utils/is_defined', 'frampton-utils/lazy', 'frampton-events/event_map'], function (exports, _framptonUtilsAssert, _framptonUtilsIs_function, _framptonUtilsIs_defined, _framptonUtilsLazy, _framptonEventsEvent_map) {
  'use strict';

  exports.__esModule = true;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _assert = _interopRequire(_framptonUtilsAssert);

  var _isFunction = _interopRequire(_framptonUtilsIs_function);

  var _isDefined = _interopRequire(_framptonUtilsIs_defined);

  var _lazy = _interopRequire(_framptonUtilsLazy);

  var _EVENT_MAP = _interopRequire(_framptonEventsEvent_map);

  // get dom event -> filter -> return stream
  function addDomEvent(name, node, callback) {
    node.addEventListener(name, callback, !_EVENT_MAP[name].bubbles);
  }

  function addCustomEvent(name, target, callback) {
    var listen = (0, _isFunction)(target.addEventListener) ? target.addEventListener : (0, _isFunction)(target.on) ? target.on : null;

    (0, _assert)('addListener received an unknown type as target', (0, _isFunction)(listen));

    listen.call(target, name, callback);
  }

  function removeDomEvent(name, node, callback) {
    node.removeEventListener(name, callback, !_EVENT_MAP[name].bubbles);
  }

  function removeCustomEvent(name, target, callback) {
    var remove = (0, _isFunction)(target.removeEventListener) ? target.removeEventListener : (0, _isFunction)(target.off) ? target.off : null;

    (0, _assert)('removeListener received an unknown type as target', (0, _isFunction)(remove));

    remove.call(target, name, callback);
  }

  function addListener(eventName, target, callback) {

    if ((0, _isDefined)(_EVENT_MAP[eventName]) && (0, _isFunction)(target.addEventListener)) {
      addDomEvent(eventName, target, callback);
    } else {
      addCustomEvent(eventName, target, callback);
    }

    return (0, _lazy)(removeListener, [eventName, target, callback]);
  }

  function removeListener(eventName, target, callback) {
    if ((0, _isDefined)(_EVENT_MAP[eventName]) && (0, _isFunction)(target.removeEventListener)) {
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
      stream: null
    },

    blur: {
      bubbles: false,
      stream: null
    },

    change: {
      bubbles: true,
      stream: null
    },

    click: {
      bubbles: true,
      stream: null
    },

    error: {
      bubbles: true,
      stream: null
    },

    focus: {
      bubbles: false,
      stream: null
    },

    focusin: {
      bubbles: true,
      stream: null
    },

    focusout: {
      bubbles: true,
      stream: null
    },

    input: {
      bubbles: true,
      stream: null
    },

    keyup: {
      bubbles: true,
      stream: null
    },

    keydown: {
      bubbles: true,
      stream: null
    },

    keypress: {
      bubbles: true,
      stream: null
    },

    load: {
      bubbles: true,
      stream: null
    },

    mousedown: {
      bubbles: true,
      stream: null
    },

    mouseup: {
      bubbles: true,
      stream: null
    },

    mousemove: {
      bubbles: true,
      stream: null
    },

    mouseenter: {
      bubbles: false,
      stream: null
    },

    mouseleave: {
      bubbles: false,
      stream: null
    },

    mouseover: {
      bubbles: true,
      stream: null
    },

    mouseout: {
      bubbles: true,
      stream: null
    },

    touchstart: {
      bubbles: true,
      stream: null
    },

    touchend: {
      bubbles: true,
      stream: null
    },

    touchcancel: {
      bubbles: true,
      stream: null
    },

    touchleave: {
      bubbles: true,
      stream: null
    },

    touchmove: {
      bubbles: true,
      stream: null
    },

    submit: {
      bubbles: true,
      stream: null
    },

    animationstart: {
      bubbles: true,
      stream: null
    },

    animationend: {
      bubbles: true,
      stream: null
    },

    animationiteration: {
      bubbles: true,
      stream: null
    },

    transitionend: {
      bubbles: true,
      stream: null
    },

    drag: {
      bubbles: true,
      stream: null
    },

    drop: {
      bubbles: true,
      stream: null
    },

    dragstart: {
      bubbles: true,
      stream: null
    },

    dragend: {
      bubbles: true,
      stream: null
    },

    dragenter: {
      bubbles: true,
      stream: null
    },

    dragleave: {
      bubbles: true,
      stream: null
    },

    dragover: {
      bubbles: true,
      stream: null
    },

    wheel: {
      bubbles: true,
      stream: null
    }
  };
});
define('frampton-events/event_supported', ['exports', 'module', 'frampton-utils/is_function', 'frampton-utils/memoize'], function (exports, module, _framptonUtilsIs_function, _framptonUtilsMemoize) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isFunction = _interopRequire(_framptonUtilsIs_function);

  var _memoize = _interopRequire(_framptonUtilsMemoize);

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
   * @memberof Frampton.Events
   * @param {String} eventName The name of the event to test
   * @returns {Boolean} Is the event supported
   */
  module.exports = (0, _memoize)(function event_supported(eventName) {
    var el = document.createElement(TAGNAMES[eventName] || 'div');
    eventName = 'on' + eventName;
    var isSupported = (eventName in el);
    if (!isSupported) {
      el.setAttribute(eventName, 'return;');
      isSupported = (0, _isFunction)(el[eventName]);
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

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _compose = _interopRequire(_framptonUtilsCompose);

  var _elementValue = _interopRequire(_framptonHtmlElement_value);

  var _eventTarget = _interopRequire(_framptonEventsEvent_target);

  /**
   * eventValue :: DomEvent -> String
   *
   * @name eventValue
   * @memberof Frampton.Events
   * @static
   * @param {Object} evt
   * @returns {String} The value property of the event target
   */
  module.exports = (0, _compose)(_elementValue, _eventTarget);
});
define('frampton-events/get_document_signal', ['exports', 'module', 'frampton-events/document_cache', 'frampton-events/get_event_signal'], function (exports, module, _framptonEventsDocument_cache, _framptonEventsGet_event_signal) {
  'use strict';

  module.exports = get_document_signal;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _documentCache = _interopRequire(_framptonEventsDocument_cache);

  var _getEventSignal = _interopRequire(_framptonEventsGet_event_signal);

  function get_document_signal(name) {
    return (0, _documentCache)(name, function () {
      return (0, _getEventSignal)(name, document);
    });
  }
});
define('frampton-events/get_event_signal', ['exports', 'module', 'frampton-utils/is_empty', 'frampton-signal/create', 'frampton-events/event_dispatcher'], function (exports, module, _framptonUtilsIs_empty, _framptonSignalCreate, _framptonEventsEvent_dispatcher) {
  'use strict';

  module.exports = get_event_signal;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isEmpty = _interopRequire(_framptonUtilsIs_empty);

  var _createSignal = _interopRequire(_framptonSignalCreate);

  function get_event_signal(name, target) {
    var parts = name.split(' ').filter(function (val) {
      return !(0, _isEmpty)(val);
    });
    var len = parts.length;
    var sigs = [];
    var temp;
    for (var i = 0; i < len; i++) {
      temp = (0, _createSignal)();
      (0, _framptonEventsEvent_dispatcher.addListener)(parts[i], target, temp);
      sigs.push(temp);
    }
    return (0, _framptonSignalCreate.mergeMany)(sigs);
  }
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
define('frampton-events/get_position_relative', ['exports', 'module', 'frampton-utils/curry', 'frampton-events/get_position'], function (exports, module, _framptonUtilsCurry, _framptonEventsGet_position) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _getPosition = _interopRequire(_framptonEventsGet_position);

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
define('frampton-events/has_selector', ['exports', 'module', 'frampton-utils/curry', 'frampton-utils/compose', 'frampton-style/matches', 'frampton-events/event_target'], function (exports, module, _framptonUtilsCurry, _framptonUtilsCompose, _framptonStyleMatches, _framptonEventsEvent_target) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _compose = _interopRequire(_framptonUtilsCompose);

  var _matches = _interopRequire(_framptonStyleMatches);

  var _eventTarget = _interopRequire(_framptonEventsEvent_target);

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
  module.exports = (0, _curry)(function has_selector(selector, evt) {
    return (0, _compose)((0, _matches)(selector), _eventTarget)(evt);
  });
});
define('frampton-events/on_event', ['exports', 'module', 'frampton-utils/is_function', 'frampton-utils/is_nothing', 'frampton-events/contains', 'frampton-events/event_map', 'frampton-events/get_document_signal', 'frampton-events/get_event_signal'], function (exports, module, _framptonUtilsIs_function, _framptonUtilsIs_nothing, _framptonEventsContains, _framptonEventsEvent_map, _framptonEventsGet_document_signal, _framptonEventsGet_event_signal) {
  'use strict';

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
  module.exports = on_event;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isFunction = _interopRequire(_framptonUtilsIs_function);

  var _isNothing = _interopRequire(_framptonUtilsIs_nothing);

  var _contains = _interopRequire(_framptonEventsContains);

  var _EVENT_MAP = _interopRequire(_framptonEventsEvent_map);

  var _getDocumentSignal = _interopRequire(_framptonEventsGet_document_signal);

  var _getEventSignal = _interopRequire(_framptonEventsGet_event_signal);

  function on_event(eventName, target) {
    if (_EVENT_MAP[eventName] && ((0, _isNothing)(target) || (0, _isFunction)(target.addEventListener))) {
      if ((0, _isNothing)(target)) {
        return (0, _getDocumentSignal)(eventName);
      } else {
        return (0, _getDocumentSignal)(eventName).filter((0, _contains)(target));
      }
    } else {
      return (0, _getEventSignal)(eventName, target);
    }
  }
});
define('frampton-events/on_selector', ['exports', 'module', 'frampton-utils/is_something', 'frampton-utils/is_string', 'frampton-utils/is_empty', 'frampton-events/closest_to_event', 'frampton-events/selector_contains', 'frampton-events/event_map', 'frampton-events/get_document_signal', 'frampton-events/selector_cache'], function (exports, module, _framptonUtilsIs_something, _framptonUtilsIs_string, _framptonUtilsIs_empty, _framptonEventsClosest_to_event, _framptonEventsSelector_contains, _framptonEventsEvent_map, _framptonEventsGet_document_signal, _framptonEventsSelector_cache) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isSomething = _interopRequire(_framptonUtilsIs_something);

  var _isString = _interopRequire(_framptonUtilsIs_string);

  var _isEmpty = _interopRequire(_framptonUtilsIs_empty);

  var _closestToEvent = _interopRequire(_framptonEventsClosest_to_event);

  var _selectorContains = _interopRequire(_framptonEventsSelector_contains);

  var _EVENT_MAP = _interopRequire(_framptonEventsEvent_map);

  var _getDocumentSignal = _interopRequire(_framptonEventsGet_document_signal);

  var _selectorCache = _interopRequire(_framptonEventsSelector_cache);

  function validateEventName(name) {
    var parts = name.split(' ').filter(function (val) {
      return !(0, _isEmpty)(val);
    });
    var len = parts.length;
    for (var i = 0; i < len; i++) {
      if (!(0, _isSomething)(_EVENT_MAP[parts[i]])) {
        return false;
      }
    }
    return true;
  }

  function mouseEnterSelector(selector) {
    var previousElement = null;
    return (0, _getDocumentSignal)('mouseover').filter(function (evt) {
      var current = (0, _closestToEvent)(selector, evt);
      if ((0, _isSomething)(current) && current !== previousElement) {
        previousElement = current;
        return true;
      } else {
        return false;
      }
    });
  }

  function mouseLeaveSelector(selector) {
    var previousElement = null;
    return (0, _getDocumentSignal)('mouseleave').filter(function (evt) {
      var current = (0, _closestToEvent)(selector, evt);
      if ((0, _isSomething)(current) && current !== previousElement) {
        previousElement = current;
        return true;
      } else if ((0, _isSomething)(current)) {
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
    if (validateEventName(eventName) && (0, _isString)(selector)) {
      return (0, _selectorCache)(eventName + ' | ' + selector, function () {
        if (eventName === 'mouseenter') {
          return mouseEnterSelector(selector);
        } else if (eventName === 'mouseleave') {
          return mouseLeaveSelector(selector);
        } else {
          return (0, _getDocumentSignal)(eventName).filter(function (evt) {
            return (0, _selectorContains)(selector, evt);
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
    return (0, _framptonEventsListen.listen)(eventName, target).take(1);
  }
});
define('frampton-events/prevent_default', ['exports', 'module', 'frampton-utils/is_function', 'frampton-utils/is_object'], function (exports, module, _framptonUtilsIs_function, _framptonUtilsIs_object) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isFunction = _interopRequire(_framptonUtilsIs_function);

  var _isObject = _interopRequire(_framptonUtilsIs_object);

  module.exports = function (evt) {
    if ((0, _isObject)(evt) && (0, _isFunction)(evt.preventDefault) && (0, _isFunction)(evt.stopPropagation)) {
      evt.preventDefault();
      evt.stopPropagation();
    }
    return evt;
  };
});
define('frampton-events/selector_cache', ['exports', 'module', 'frampton-events/simple_cache'], function (exports, module, _framptonEventsSimple_cache) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _simpleCahce = _interopRequire(_framptonEventsSimple_cache);

  module.exports = (0, _simpleCahce)();
});
define('frampton-events/selector_contains', ['exports', 'module', 'frampton-utils/curry', 'frampton-utils/is_something', 'frampton-events/closest_to_event'], function (exports, module, _framptonUtilsCurry, _framptonUtilsIs_something, _framptonEventsClosest_to_event) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _isSomething = _interopRequire(_framptonUtilsIs_something);

  var _closestToEvent = _interopRequire(_framptonEventsClosest_to_event);

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
  module.exports = (0, _curry)(function selector_contains(selector, evt) {
    return (0, _isSomething)((0, _closestToEvent)(selector, evt));
  });
});
define('frampton-events/simple_cache', ['exports', 'module', 'frampton-utils/is_nothing'], function (exports, module, _framptonUtilsIs_nothing) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isNothing = _interopRequire(_framptonUtilsIs_nothing);

  module.exports = function () {

    var store = {};

    return function (name, fn) {
      if ((0, _isNothing)(store[name])) {
        store[name] = fn();
      }
      return store[name];
    };
  };
});
define('frampton-html', ['exports', 'frampton/namespace', 'frampton-html/attribute', 'frampton-html/contains', 'frampton-html/element_value', 'frampton-html/data', 'frampton-html/set_html'], function (exports, _framptonNamespace, _framptonHtmlAttribute, _framptonHtmlContains, _framptonHtmlElement_value, _framptonHtmlData, _framptonHtmlSet_html) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Frampton = _interopRequire(_framptonNamespace);

  var _attribute = _interopRequire(_framptonHtmlAttribute);

  var _contains = _interopRequire(_framptonHtmlContains);

  var _elementValue = _interopRequire(_framptonHtmlElement_value);

  var _data = _interopRequire(_framptonHtmlData);

  var _set = _interopRequire(_framptonHtmlSet_html);

  /**
   * @name Html
   * @namespace
   * @memberof Frampton
   */
  _Frampton.Html = {};
  _Frampton.Html.attribute = _attribute;
  _Frampton.Html.contains = _contains;
  _Frampton.Html.elementValue = _elementValue;
  _Frampton.Html.data = _data;
  _Frampton.Html.set = _set;
});
define('frampton-html/attribute', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  // attribute :: String -> Dom -> String
  module.exports = (0, _curry)(function (name, dom) {
    return dom.getAttribute(name);
  });
});
define('frampton-html/contains', ['exports', 'module', 'frampton-utils/curry', 'frampton-utils/is_function'], function (exports, module, _framptonUtilsCurry, _framptonUtilsIs_function) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _isFunction = _interopRequire(_framptonUtilsIs_function);

  // contains :: Dom -> Dom -> Boolean
  module.exports = (0, _curry)(function (parent, child) {
    if (parent === child) {
      return true;
    } else if ((0, _isFunction)(parent.contains)) {
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

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _attribute = _interopRequire(_framptonHtmlAttribute);

  // data :: String -> Dom -> String
  module.exports = (0, _curry)(function (name, dom) {
    return (0, _attribute)('data-' + name, dom);
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

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  module.exports = (0, _curry)(function (element, html) {
    element.innerHTML = html;
  });
});
define('frampton-keyboard', ['exports', 'frampton/namespace', 'frampton-keyboard/keyboard', 'frampton-keyboard/key_code', 'frampton-keyboard/is_key', 'frampton-keyboard/is_enter', 'frampton-keyboard/is_esc', 'frampton-keyboard/is_up', 'frampton-keyboard/is_down', 'frampton-keyboard/is_left', 'frampton-keyboard/is_right', 'frampton-keyboard/is_space', 'frampton-keyboard/is_ctrl', 'frampton-keyboard/is_shift'], function (exports, _framptonNamespace, _framptonKeyboardKeyboard, _framptonKeyboardKey_code, _framptonKeyboardIs_key, _framptonKeyboardIs_enter, _framptonKeyboardIs_esc, _framptonKeyboardIs_up, _framptonKeyboardIs_down, _framptonKeyboardIs_left, _framptonKeyboardIs_right, _framptonKeyboardIs_space, _framptonKeyboardIs_ctrl, _framptonKeyboardIs_shift) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Frampton = _interopRequire(_framptonNamespace);

  var _Keyboard = _interopRequire(_framptonKeyboardKeyboard);

  var _keyCode = _interopRequire(_framptonKeyboardKey_code);

  var _isKey = _interopRequire(_framptonKeyboardIs_key);

  var _isEnter = _interopRequire(_framptonKeyboardIs_enter);

  var _isEsc = _interopRequire(_framptonKeyboardIs_esc);

  var _isUp = _interopRequire(_framptonKeyboardIs_up);

  var _isDown = _interopRequire(_framptonKeyboardIs_down);

  var _isLeft = _interopRequire(_framptonKeyboardIs_left);

  var _isRight = _interopRequire(_framptonKeyboardIs_right);

  var _isSpace = _interopRequire(_framptonKeyboardIs_space);

  var _isCtrl = _interopRequire(_framptonKeyboardIs_ctrl);

  var _isShift = _interopRequire(_framptonKeyboardIs_shift);

  /**
   * @name Keyboard
   * @namespace
   * @memberof Frampton
   */
  _Frampton.Keyboard = _Keyboard;
  _Frampton.Keyboard.keyCode = _keyCode;
  _Frampton.Keyboard.isKey = _isKey;
  _Frampton.Keyboard.isEnter = _isEnter;
  _Frampton.Keyboard.isEsc = _isEsc;
  _Frampton.Keyboard.isUp = _isUp;
  _Frampton.Keyboard.isDown = _isDown;
  _Frampton.Keyboard.isLeft = _isLeft;
  _Frampton.Keyboard.isRight = _isRight;
  _Frampton.Keyboard.isShift = _isShift;
  _Frampton.Keyboard.isSpace = _isSpace;
  _Frampton.Keyboard.isCtrl = _isCtrl;
});
define('frampton-keyboard/is_ctrl', ['exports', 'module', 'frampton-keyboard/is_key', 'frampton-keyboard/key_map'], function (exports, module, _framptonKeyboardIs_key, _framptonKeyboardKey_map) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isKey = _interopRequire(_framptonKeyboardIs_key);

  var _KEY_MAP = _interopRequire(_framptonKeyboardKey_map);

  // is_ctrl :: KeyCode -> Boolean
  module.exports = (0, _isKey)(_KEY_MAP.CTRL);
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
define('frampton-keyboard/is_shift', ['exports', 'module', 'frampton-keyboard/is_key', 'frampton-keyboard/key_map'], function (exports, module, _framptonKeyboardIs_key, _framptonKeyboardKey_map) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isKey = _interopRequire(_framptonKeyboardIs_key);

  var _KEY_MAP = _interopRequire(_framptonKeyboardKey_map);

  // is_shift :: KeyCode -> Boolean
  module.exports = (0, _isKey)(_KEY_MAP.SHIFT);
});
define('frampton-keyboard/is_space', ['exports', 'module', 'frampton-keyboard/is_key', 'frampton-keyboard/key_map'], function (exports, module, _framptonKeyboardIs_key, _framptonKeyboardKey_map) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isKey = _interopRequire(_framptonKeyboardIs_key);

  var _KEY_MAP = _interopRequire(_framptonKeyboardKey_map);

  // is_space :: KeyCode -> Boolean
  module.exports = (0, _isKey)(_KEY_MAP.SPACE);
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
    CTRL: 17,
    SHIFT: 16,
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39
  };
});
define('frampton-keyboard/keyboard', ['exports', 'module', 'frampton-utils/curry', 'frampton-list/contains', 'frampton-list/append', 'frampton-list/remove', 'frampton-events/on_event', 'frampton-signal/stepper', 'frampton-keyboard/key_map', 'frampton-keyboard/key_code'], function (exports, module, _framptonUtilsCurry, _framptonListContains, _framptonListAppend, _framptonListRemove, _framptonEventsOn_event, _framptonSignalStepper, _framptonKeyboardKey_map, _framptonKeyboardKey_code) {
  'use strict';

  module.exports = Keyboard;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _contains = _interopRequire(_framptonListContains);

  var _append = _interopRequire(_framptonListAppend);

  var _remove = _interopRequire(_framptonListRemove);

  var _onEvent = _interopRequire(_framptonEventsOn_event);

  var _stepper = _interopRequire(_framptonSignalStepper);

  var _KEY_MAP = _interopRequire(_framptonKeyboardKey_map);

  var _keyCode = _interopRequire(_framptonKeyboardKey_code);

  //+ keyUp :: Signal DomEvent
  var keyUp = (0, _onEvent)('keyup');

  //+ keyDown :: Signal DomEvent
  var keyDown = (0, _onEvent)('keydown');

  //+ keyPress :: Signal DomEvent
  var keyPress = (0, _onEvent)('keypress');

  //+ keyUpCodes :: Signal KeyCode
  var keyUpCodes = keyUp.map(_keyCode);

  //+ keyDownCodes :: Signal KeyCode
  var keyDownCodes = keyDown.map(_keyCode);

  var addKey = function addKey(keyCode) {
    return function (arr) {
      if (!(0, _contains)(arr, keyCode)) {
        return (0, _append)(arr, keyCode);
      }
      return arr;
    };
  };

  var removeKey = function removeKey(keyCode) {
    return function (arr) {
      return (0, _remove)(keyCode, arr);
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
      return (0, _contains)(arr, keyCode);
    });
  };

  //+ direction :: KeyCode -> [KeyCode] -> Boolean
  var direction = (0, _curry)(function (keyCode, arr) {
    return (0, _contains)(arr, keyCode) ? 1 : 0;
  });

  //+ isUp :: [KeyCode] -> Boolean
  var isUp = direction(_KEY_MAP.UP);

  //+ isDown :: [KeyCode] -> Boolean
  var isDown = direction(_KEY_MAP.DOWN);

  //+ isRight :: [KeyCode] -> Boolean
  var isRight = direction(_KEY_MAP.RIGHT);

  //+ isLeft :: [KeyCode] -> Boolean
  var isLeft = direction(_KEY_MAP.LEFT);

  //+ arrows :: Signal [horizontal, vertical]
  var arrows = keysDown.map(function (arr) {
    return [isRight(arr) - isLeft(arr), isUp(arr) - isDown(arr)];
  });

  var defaultKeyboard = {
    downs: keyDown,
    ups: keyUp,
    presses: keyPress,
    codes: keyUpCodes,
    arrows: (0, _stepper)([0, 0], arrows),
    shift: (0, _stepper)(false, keyIsDown(_KEY_MAP.SHIFT)),
    ctrl: (0, _stepper)(false, keyIsDown(_KEY_MAP.CTRL)),
    escape: (0, _stepper)(false, keyIsDown(_KEY_MAP.ESC)),
    enter: (0, _stepper)(false, keyIsDown(_KEY_MAP.ENTER)),
    space: (0, _stepper)(false, keyIsDown(_KEY_MAP.SPACE))
  };

  function Keyboard() {
    return defaultKeyboard;
  }
});
define('frampton-list', ['exports', 'frampton/namespace', 'frampton-list/add', 'frampton-list/append', 'frampton-list/contains', 'frampton-list/copy', 'frampton-list/diff', 'frampton-list/drop', 'frampton-list/each', 'frampton-list/filter', 'frampton-list/find', 'frampton-list/foldl', 'frampton-list/foldr', 'frampton-list/first', 'frampton-list/second', 'frampton-list/third', 'frampton-list/init', 'frampton-list/last', 'frampton-list/length', 'frampton-list/maximum', 'frampton-list/minimum', 'frampton-list/prepend', 'frampton-list/product', 'frampton-list/remove', 'frampton-list/remove_index', 'frampton-list/replace', 'frampton-list/replace_index', 'frampton-list/reverse', 'frampton-list/split', 'frampton-list/sum', 'frampton-list/tail', 'frampton-list/zip'], function (exports, _framptonNamespace, _framptonListAdd, _framptonListAppend, _framptonListContains, _framptonListCopy, _framptonListDiff, _framptonListDrop, _framptonListEach, _framptonListFilter, _framptonListFind, _framptonListFoldl, _framptonListFoldr, _framptonListFirst, _framptonListSecond, _framptonListThird, _framptonListInit, _framptonListLast, _framptonListLength, _framptonListMaximum, _framptonListMinimum, _framptonListPrepend, _framptonListProduct, _framptonListRemove, _framptonListRemove_index, _framptonListReplace, _framptonListReplace_index, _framptonListReverse, _framptonListSplit, _framptonListSum, _framptonListTail, _framptonListZip) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Frampton = _interopRequire(_framptonNamespace);

  var _add = _interopRequire(_framptonListAdd);

  var _append = _interopRequire(_framptonListAppend);

  var _contains = _interopRequire(_framptonListContains);

  var _copy = _interopRequire(_framptonListCopy);

  var _diff = _interopRequire(_framptonListDiff);

  var _drop = _interopRequire(_framptonListDrop);

  var _each = _interopRequire(_framptonListEach);

  var _filter = _interopRequire(_framptonListFilter);

  var _find = _interopRequire(_framptonListFind);

  var _foldl = _interopRequire(_framptonListFoldl);

  var _foldr = _interopRequire(_framptonListFoldr);

  var _first = _interopRequire(_framptonListFirst);

  var _second = _interopRequire(_framptonListSecond);

  var _third = _interopRequire(_framptonListThird);

  var _init = _interopRequire(_framptonListInit);

  var _last = _interopRequire(_framptonListLast);

  var _length = _interopRequire(_framptonListLength);

  var _maximum = _interopRequire(_framptonListMaximum);

  var _minimum = _interopRequire(_framptonListMinimum);

  var _prepend = _interopRequire(_framptonListPrepend);

  var _product = _interopRequire(_framptonListProduct);

  var _remove = _interopRequire(_framptonListRemove);

  var _removeAt = _interopRequire(_framptonListRemove_index);

  var _replace = _interopRequire(_framptonListReplace);

  var _replaceAt = _interopRequire(_framptonListReplace_index);

  var _reverse = _interopRequire(_framptonListReverse);

  var _split = _interopRequire(_framptonListSplit);

  var _sum = _interopRequire(_framptonListSum);

  var _tail = _interopRequire(_framptonListTail);

  var _zip = _interopRequire(_framptonListZip);

  /**
   * @name List
   * @namespace
   * @memberof Frampton
   */
  _Frampton.List = {};
  _Frampton.List.add = _add;
  _Frampton.List.append = _append;
  _Frampton.List.contains = _contains;
  _Frampton.List.copy = _copy;
  _Frampton.List.diff = _diff;
  _Frampton.List.drop = _drop;
  _Frampton.List.each = _each;
  _Frampton.List.filter = _filter;
  _Frampton.List.find = _find;
  _Frampton.List.foldl = _foldl;
  _Frampton.List.foldr = _foldr;
  _Frampton.List.first = _first;
  _Frampton.List.second = _second;
  _Frampton.List.third = _third;
  _Frampton.List.init = _init;
  _Frampton.List.last = _last;
  _Frampton.List.length = _length;
  _Frampton.List.maximum = _maximum;
  _Frampton.List.minimum = _minimum;
  _Frampton.List.prepend = _prepend;
  _Frampton.List.product = _product;
  _Frampton.List.remove = _remove;
  _Frampton.List.removeAt = _removeAt;
  _Frampton.List.replace = _replace;
  _Frampton.List.replaceAt = _replaceAt;
  _Frampton.List.reverse = _reverse;
  _Frampton.List.split = _split;
  _Frampton.List.sum = _sum;
  _Frampton.List.tail = _tail;
  _Frampton.List.zip = _zip;
});
define('frampton-list/add', ['exports', 'module', 'frampton-utils/curry', 'frampton-list/contains', 'frampton-list/append', 'frampton-list/copy'], function (exports, module, _framptonUtilsCurry, _framptonListContains, _framptonListAppend, _framptonListCopy) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _contains = _interopRequire(_framptonListContains);

  var _append = _interopRequire(_framptonListAppend);

  var _copy = _interopRequire(_framptonListCopy);

  /**
   * @name addToList
   * @method
   * @memberof Frampton.List
   * @param {Array} xs  Array to add object to
   * @param {*}   obj Object to add to array
   * @returns {Array} A new array with the object added
   */
  module.exports = (0, _curry)(function add_to_list(xs, obj) {
    return !(0, _contains)(xs, obj) ? (0, _append)(xs, obj) : (0, _copy)(xs);
  });
});
define('frampton-list/append', ['exports', 'module', 'frampton-utils/curry', 'frampton-utils/is_something', 'frampton-list/length'], function (exports, module, _framptonUtilsCurry, _framptonUtilsIs_something, _framptonListLength) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _isSomething = _interopRequire(_framptonUtilsIs_something);

  var _length = _interopRequire(_framptonListLength);

  /**
   * @name append
   * @method
   * @memberof Frampton.List
   * @param {Array} xs
   * @param {*} obj
   * @returns {Array}
   */
  module.exports = (0, _curry)(function (xs, obj) {
    if ((0, _isSomething)(obj)) {
      var len = (0, _length)(xs);
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

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _assert = _interopRequire(_framptonUtilsAssert);

  var _isDefined = _interopRequire(_framptonUtilsIs_defined);

  var _isArray = _interopRequire(_framptonUtilsIs_array);

  /**
   * @name at
   * @method
   * @memberof Frampton.List
   */
  module.exports = (0, _curry)(function at(index, xs) {
    (0, _assert)('Frampton.at recieved a non-array', (0, _isArray)(xs));
    return (0, _isDefined)(xs[index]) ? xs[index] : null;
  });
});
define('frampton-list/contains', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  /**
   * @name contains
   * @method
   * @memberof Frampton.List
   * @param {Array} xs
   * @param {*}   obj
   * @retruns {Boolean}
   */
  module.exports = (0, _curry)(function (xs, obj) {
    return xs.indexOf(obj) > -1;
  });
});
define('frampton-list/copy', ['exports', 'module', 'frampton-list/length'], function (exports, module, _framptonListLength) {
  'use strict';

  /**
   * @name copy
   * @method
   * @memberof Frampton.List
   */
  module.exports = copy;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _length = _interopRequire(_framptonListLength);

  function copy(xs, begin, end) {

    var argLen = (0, _length)(xs),
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
define('frampton-list/diff', ['exports', 'module', 'frampton-utils/curry', 'frampton-list/contains'], function (exports, module, _framptonUtilsCurry, _framptonListContains) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _contains = _interopRequire(_framptonListContains);

  /**
   * @name diff
   * @method
   * @memberof Frampton.List
   * @returns {Array}
   */
  module.exports = (0, _curry)(function curried_diff(xs, ys) {

    var diff = [];

    xs.forEach(function (item) {
      if (!(0, _contains)(ys, item)) {
        diff.push(item);
      }
    });

    return Object.freeze(diff);
  });
});
define('frampton-list/drop', ['exports', 'module', 'frampton-utils/assert', 'frampton-utils/curry', 'frampton-utils/is_array', 'frampton-list/filter'], function (exports, module, _framptonUtilsAssert, _framptonUtilsCurry, _framptonUtilsIs_array, _framptonListFilter) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _assert = _interopRequire(_framptonUtilsAssert);

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _isArray = _interopRequire(_framptonUtilsIs_array);

  var _filter = _interopRequire(_framptonListFilter);

  /**
   * @name drop
   * @method
   * @memberof Frampton.List
   */
  module.exports = (0, _curry)(function curried_drop(n, xs) {
    (0, _assert)('Frampton.drop recieved a non-array', (0, _isArray)(xs));
    return (0, _filter)(function (next) {
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

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  /**
   * @name each
   * @method
   * @memberof Frampton.List
   */
  module.exports = (0, _curry)(function curried_each(fn, xs) {
    xs.forEach(fn);
  });
});
define('frampton-list/filter', ['exports', 'module', 'frampton-utils/curry', 'frampton-list/length'], function (exports, module, _framptonUtilsCurry, _framptonListLength) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _length = _interopRequire(_framptonListLength);

  /**
   * @name filter
   * @method
   * @memberof Frampton.List
   * @param {Function} predicate
   * @param {Array} xs
   * @returns {Array} A new array
   */
  module.exports = (0, _curry)(function filter(predicate, xs) {

    var len = (0, _length)(xs);
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

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  module.exports = (0, _curry)(function (obj, xs) {
    return xs.indexOf(obj);
  });
});
define('frampton-list/first', ['exports', 'module', 'frampton-list/at'], function (exports, module, _framptonListAt) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _at = _interopRequire(_framptonListAt);

  /**
   * @name first
   * @method
   * @memberof Frampton.List
   */
  module.exports = (0, _at)(0);
});
define('frampton-list/foldl', ['exports', 'module', 'frampton-utils/assert', 'frampton-utils/curry', 'frampton-utils/is_array'], function (exports, module, _framptonUtilsAssert, _framptonUtilsCurry, _framptonUtilsIs_array) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _assert = _interopRequire(_framptonUtilsAssert);

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _isArray = _interopRequire(_framptonUtilsIs_array);

  /**
   * @name foldl
   * @method
   * @memberof Frampton.List
   */
  module.exports = (0, _curry)(function curried_foldl(fn, acc, xs) {
    (0, _assert)('Frampton.foldl recieved a non-array', (0, _isArray)(xs));
    var len = xs.length;
    for (var i = 0; i < len; i++) {
      acc = fn(acc, xs[i]);
    }
    return acc;
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
   * @method
   * @memberof Frampton.List
   */
  module.exports = (0, _curry)(function curried_foldr(fn, acc, xs) {
    (0, _assert)('Frampton.foldr recieved a non-array', (0, _isArray)(xs));
    var len = xs.length;
    while (len--) {
      acc = fn(acc, xs[len]);
    }
    return acc;
  });
});
define('frampton-list/init', ['exports', 'module', 'frampton-utils/assert', 'frampton-utils/is_array'], function (exports, module, _framptonUtilsAssert, _framptonUtilsIs_array) {
  'use strict';

  /**
   * @name init
   * @method
   * @memberof Frampton.List
   */
  module.exports = init;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _assert = _interopRequire(_framptonUtilsAssert);

  var _isArray = _interopRequire(_framptonUtilsIs_array);

  function init(xs) {
    (0, _assert)('Frampton.init recieved a non-array', (0, _isArray)(xs));
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

  /**
   * @name last
   * @method
   * @memberof Frampton.List
   */
  module.exports = last;

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
define('frampton-list/length', ['exports', 'module', 'frampton-utils/is_something', 'frampton-utils/is_defined'], function (exports, module, _framptonUtilsIs_something, _framptonUtilsIs_defined) {
  'use strict';

  /**
   * @name length
   * @method
   * @memberof Frampton.List
   */
  module.exports = length;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isSomething = _interopRequire(_framptonUtilsIs_something);

  var _isDefined = _interopRequire(_framptonUtilsIs_defined);

  function length(xs) {
    return (0, _isSomething)(xs) && (0, _isDefined)(xs.length) ? xs.length : 0;
  }
});
define('frampton-list/maximum', ['exports', 'module', 'frampton-list/foldl', 'frampton-utils/is_nothing'], function (exports, module, _framptonListFoldl, _framptonUtilsIs_nothing) {
  'use strict';

  /**
   * @name maximum
   * @method
   * @memberof Frampton.List
   * @param {Array} xs
   */
  module.exports = maximum;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _foldl = _interopRequire(_framptonListFoldl);

  var _isNothing = _interopRequire(_framptonUtilsIs_nothing);

  function maximum(xs) {
    return (0, _foldl)(function (acc, next) {
      if ((0, _isNothing)(acc) || next > acc) {
        acc = next;
      }
      return acc;
    }, null, xs);
  }
});
define('frampton-list/minimum', ['exports', 'module', 'frampton-list/foldl', 'frampton-utils/is_nothing'], function (exports, module, _framptonListFoldl, _framptonUtilsIs_nothing) {
  'use strict';

  /**
   * @name minimum
   * @method
   * @memberof Frampton.List
   * @param {Array} xs
   */
  module.exports = minimum;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _foldl = _interopRequire(_framptonListFoldl);

  var _isNothing = _interopRequire(_framptonUtilsIs_nothing);

  function minimum(xs) {
    return (0, _foldl)(function (acc, next) {
      if ((0, _isNothing)(acc) || next < acc) {
        acc = next;
      }
      return acc;
    }, null, xs);
  }
});
define('frampton-list/prepend', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  /**
   * @name prepend
   * @method
   * @memberof Frampton.List
   * @param {Array} xs
   * @param {*} obj
   */
  module.exports = (0, _curry)(function (xs, obj) {
    return Object.freeze([].concat(obj).concat(xs));
  });
});
define('frampton-list/product', ['exports', 'module', 'frampton-list/foldl'], function (exports, module, _framptonListFoldl) {
  'use strict';

  /**
   * @name product
   * @method
   * @memberof Frampton.List
   * @param {Array} xs
   */
  module.exports = product;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _foldl = _interopRequire(_framptonListFoldl);

  function product(xs) {
    return (0, _foldl)(function (acc, next) {
      return acc * next;
    }, 1, xs);
  }
});
define('frampton-list/remove', ['exports', 'module', 'frampton-utils/curry', 'frampton-list/filter'], function (exports, module, _framptonUtilsCurry, _framptonListFilter) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _filter = _interopRequire(_framptonListFilter);

  /**
   * remove :: List a -> Any a -> List a
   *
   * @name remove
   * @method
   * @memberof Frampton.List
   * @param {Array} xs
   * @param {Object} obj
   */
  module.exports = (0, _curry)(function curried_remove(obj, xs) {
    return (0, _filter)(function (next) {
      return next !== obj;
    }, xs);
  });
});
define('frampton-list/remove_index', ['exports', 'module', 'frampton-list/length'], function (exports, module, _framptonListLength) {
  'use strict';

  /**
   * @name removeIndex
   * @method
   * @memberof Frampton.List
   * @param {Number} index
   * @param {Array} xs
   * @returns {Array} A new array
   */
  module.exports = remove_index;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _length = _interopRequire(_framptonListLength);

  function remove_index(index, xs) {

    var len = (0, _length)(xs);
    var newList = [];

    for (var i = 0; i < len; i++) {
      if (i !== index) {
        newList.push(xs[i]);
      }
    }

    return Object.freeze(newList);
  }
});
define('frampton-list/replace', ['exports', 'module', 'frampton-utils/curry', 'frampton-list/find', 'frampton-list/replace_index'], function (exports, module, _framptonUtilsCurry, _framptonListFind, _framptonListReplace_index) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _find = _interopRequire(_framptonListFind);

  var _replaceIndex = _interopRequire(_framptonListReplace_index);

  module.exports = (0, _curry)(function replace(oldObj, newObj, xs) {
    var index = (0, _find)(oldObj, xs);
    if (index > -1) {
      return (0, _replaceIndex)(index, newObj, xs);
    } else {
      return xs;
    }
  });
});
define('frampton-list/replace_index', ['exports', 'module', 'frampton-utils/curry', 'frampton-list/length'], function (exports, module, _framptonUtilsCurry, _framptonListLength) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _length = _interopRequire(_framptonListLength);

  module.exports = (0, _curry)(function replace_index(index, obj, xs) {
    var len = (0, _length)(xs);
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
define('frampton-list/reverse', ['exports', 'module', 'frampton-list/foldr'], function (exports, module, _framptonListFoldr) {
  'use strict';

  /**
   * reverse :: List a -> List a
   *
   * @name reverse
   * @method
   * @memberof Frampton.List
   */
  module.exports = reverse;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _foldr = _interopRequire(_framptonListFoldr);

  function reverse(xs) {
    return Object.freeze((0, _foldr)(function (acc, next) {
      acc.push(next);
      return acc;
    }, [], xs));
  }
});
define('frampton-list/second', ['exports', 'module', 'frampton-list/at'], function (exports, module, _framptonListAt) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _at = _interopRequire(_framptonListAt);

  /**
   * @name second
   * @method
   * @memberof Frampton.List
   */
  module.exports = (0, _at)(1);
});
define('frampton-list/split', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  /**
   * split :: Number -> List a -> (List a, List a)
   *
   * @name split
   * @method
   * @memberof Frampton.List
   */
  module.exports = (0, _curry)(function split(n, xs) {
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

  /**
   * + sum :: Number a => List a -> a
   *
   * @name sum
   * @method
   * @memberof Frampton.List
   * @param {Array} xs
   */
  module.exports = sum;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _foldl = _interopRequire(_framptonListFoldl);

  function sum(xs) {
    return (0, _foldl)(function (acc, next) {
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

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _assert = _interopRequire(_framptonUtilsAssert);

  var _isArray = _interopRequire(_framptonUtilsIs_array);

  function tail(xs) {
    (0, _assert)('Frampton.tail recieved a non-array', (0, _isArray)(xs));
    switch (xs.length) {
      case 0:
        return Object.freeze([]);
      default:
        return Object.freeze(xs.slice(1));
    }
  }
});
define('frampton-list/third', ['exports', 'module', 'frampton-list/at'], function (exports, module, _framptonListAt) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _at = _interopRequire(_framptonListAt);

  /**
   * @name third
   * @method
   * @memberof Frampton.List
   */
  module.exports = (0, _at)(2);
});
define('frampton-list/zip', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  /**
   * zip :: List a -> List b - List (a, b)
   *
   * @name zip
   * @method
   * @memberof Frampton.List
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

    return Object.freeze(zs);
  });
});
define('frampton-math', ['exports', 'frampton/namespace', 'frampton-math/add', 'frampton-math/subtract', 'frampton-math/multiply', 'frampton-math/divide', 'frampton-math/modulo', 'frampton-math/max', 'frampton-math/min'], function (exports, _framptonNamespace, _framptonMathAdd, _framptonMathSubtract, _framptonMathMultiply, _framptonMathDivide, _framptonMathModulo, _framptonMathMax, _framptonMathMin) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Frampton = _interopRequire(_framptonNamespace);

  var _add = _interopRequire(_framptonMathAdd);

  var _subtract = _interopRequire(_framptonMathSubtract);

  var _multiply = _interopRequire(_framptonMathMultiply);

  var _divide = _interopRequire(_framptonMathDivide);

  var _modulo = _interopRequire(_framptonMathModulo);

  var _max = _interopRequire(_framptonMathMax);

  var _min = _interopRequire(_framptonMathMin);

  /**
   * @name Math
   * @namespace
   * @memberof Frampton
   */
  _Frampton.Math = {};
  _Frampton.Math.add = _add;
  _Frampton.Math.subtract = _subtract;
  _Frampton.Math.multiply = _multiply;
  _Frampton.Math.divide = _divide;
  _Frampton.Math.modulo = _modulo;
  _Frampton.Math.max = _max;
  _Frampton.Math.min = _min;
});
define('frampton-math/add', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  // add :: Number -> Number -> Number
  module.exports = (0, _curry)(function (a, b) {
    return a + b;
  });
});
define('frampton-math/divide', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  // divide :: Number -> Number -> Number
  module.exports = (0, _curry)(function (a, b) {
    return a / b;
  });
});
define('frampton-math/max', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  module.exports = (0, _curry)(function (l, r) {
    return l > r ? l : r;
  });
});
define('frampton-math/min', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  module.exports = (0, _curry)(function (l, r) {
    return l < r ? l : r;
  });
});
define('frampton-math/modulo', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  // modulo :: Number -> Number -> Number
  module.exports = (0, _curry)(function (a, b) {
    return a % b;
  });
});
define('frampton-math/multiply', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  // multiply :: Number -> Number -> Number
  module.exports = (0, _curry)(function (a, b) {
    return a * b;
  });
});
define('frampton-math/subtract', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  // subtract :: Number -> Number -> Number
  module.exports = (0, _curry)(function (a, b) {
    return a - b;
  });
});
define('frampton-mouse', ['exports', 'frampton/namespace', 'frampton-mouse/mouse'], function (exports, _framptonNamespace, _framptonMouseMouse) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Frampton = _interopRequire(_framptonNamespace);

  var _Mouse = _interopRequire(_framptonMouseMouse);

  _Frampton.Mouse = _Mouse;
});
define('frampton-mouse/mouse', ['exports', 'module', 'frampton-signal/stepper', 'frampton-events/on_event', 'frampton-events/contains', 'frampton-events/get_position', 'frampton-events/get_position_relative'], function (exports, module, _framptonSignalStepper, _framptonEventsOn_event, _framptonEventsContains, _framptonEventsGet_position, _framptonEventsGet_position_relative) {
  'use strict';

  /**
   * @name Mouse
   * @memberof Frampton
   * @class
   */
  module.exports = Mouse;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _stepper = _interopRequire(_framptonSignalStepper);

  var _onEvent = _interopRequire(_framptonEventsOn_event);

  var _contains = _interopRequire(_framptonEventsContains);

  var _getPosition = _interopRequire(_framptonEventsGet_position);

  var _getPositionRelative = _interopRequire(_framptonEventsGet_position_relative);

  var clicks = (0, _onEvent)('click');
  var downs = (0, _onEvent)('mousedown');
  var ups = (0, _onEvent)('mouseup');
  var moves = (0, _onEvent)('mousemove');
  var isDown = (0, _stepper)(false, downs.map(true).merge(ups.map(false)));

  var defaultMouse = {
    clicks: clicks,
    downs: downs,
    ups: ups,
    position: (0, _stepper)([0, 0], moves.map(_getPosition)),
    isDown: isDown
  };
  function Mouse(element) {
    if (!element) {
      return defaultMouse;
    } else {
      return {
        clicks: clicks.filter((0, _contains)(element)),
        downs: downs.filter((0, _contains)(element)),
        ups: ups.filter((0, _contains)(element)),
        position: (0, _stepper)([0, 0], moves.filter((0, _contains)(element)).map((0, _getPositionRelative)(element))),
        isDown: isDown
      };
    }
  }
});
define('frampton-record', ['exports', 'frampton/namespace', 'frampton-record/filter', 'frampton-record/reduce', 'frampton-record/map', 'frampton-record/merge', 'frampton-record/for_each', 'frampton-record/as_list', 'frampton-record/copy', 'frampton-record/update'], function (exports, _framptonNamespace, _framptonRecordFilter, _framptonRecordReduce, _framptonRecordMap, _framptonRecordMerge, _framptonRecordFor_each, _framptonRecordAs_list, _framptonRecordCopy, _framptonRecordUpdate) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Frampton = _interopRequire(_framptonNamespace);

  var _filter = _interopRequire(_framptonRecordFilter);

  var _reduce = _interopRequire(_framptonRecordReduce);

  var _map = _interopRequire(_framptonRecordMap);

  var _merge = _interopRequire(_framptonRecordMerge);

  var _forEach = _interopRequire(_framptonRecordFor_each);

  var _asList = _interopRequire(_framptonRecordAs_list);

  var _copy = _interopRequire(_framptonRecordCopy);

  var _update = _interopRequire(_framptonRecordUpdate);

  /**
   * @name Record
   * @namespace
   * @memberof Frampton
   */
  _Frampton.Record = {};
  _Frampton.Record.copy = _copy;
  _Frampton.Record.update = _update;
  _Frampton.Record.filter = _filter;
  _Frampton.Record.reduce = _reduce;
  _Frampton.Record.map = _map;
  _Frampton.Record.each = _forEach;
  _Frampton.Record.asList = _asList;
  _Frampton.Record.merge = _merge;
});
define('frampton-record/as_list', ['exports', 'module', 'frampton-record/reduce'], function (exports, module, _framptonRecordReduce) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _reduce = _interopRequire(_framptonRecordReduce);

  // as_list :: Object -> Array [String, *]

  module.exports = function (map) {
    return Object.freeze((0, _reduce)(function (acc, nextValue, nextKey) {
      acc.push([nextKey, nextValue]);
      return acc;
    }, [], map));
  };
});
define('frampton-record/copy', ['exports', 'module', 'frampton-record/for_each'], function (exports, module, _framptonRecordFor_each) {
  'use strict';

  /**
   * copy :: Object -> Object
   *
   * @name copy
   * @method
   * @memberof Frampton.Object
   * @param {Object} obj object to copy
   * @returns {Object}
   */
  module.exports = copy_object;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _forEach = _interopRequire(_framptonRecordFor_each);

  function copy_object(obj) {

    var newObj = {};

    (0, _forEach)(function (value, key) {
      newObj[key] = value;
    }, obj);

    return Object.freeze(newObj);
  }
});
define('frampton-record/filter', ['exports', 'module', 'frampton-utils/curry', 'frampton-record/for_each'], function (exports, module, _framptonUtilsCurry, _framptonRecordFor_each) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _forEach = _interopRequire(_framptonRecordFor_each);

  module.exports = (0, _curry)(function curried_filter(fn, obj) {

    var newObj = {};

    (0, _forEach)(function (value, key) {
      if (fn(value, key)) {
        newObj[key] = value;
      }
    }, obj);

    return Object.freeze(newObj);
  });
});
define('frampton-record/for_each', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  module.exports = (0, _curry)(function curried_for_each(fn, obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        fn(obj[key], key);
      }
    }
  });
});
define('frampton-record/keys', ['exports', 'module', 'frampton-utils/is_function'], function (exports, module, _framptonUtilsIs_function) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isFunction = _interopRequire(_framptonUtilsIs_function);

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

  module.exports = function (obj) {
    if ((0, _isFunction)(Object.keys)) {
      return Object.keys(obj).filter(function (key) {
        return hasOwnProp.call(obj, key);
      });
    } else {
      return getKeys(obj);
    }
  };
});
define('frampton-record/map', ['exports', 'module', 'frampton-utils/curry', 'frampton-record/for_each'], function (exports, module, _framptonUtilsCurry, _framptonRecordFor_each) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _forEach = _interopRequire(_framptonRecordFor_each);

  module.exports = (0, _curry)(function curried_map(fn, obj) {

    var newObj = {};

    (0, _forEach)(function (value, key) {
      newObj[key] = fn(value, key);
    }, obj);

    return Object.freeze(newObj);
  });
});
define('frampton-record/merge', ['exports', 'module', 'frampton-utils/curry', 'frampton-utils/extend'], function (exports, module, _framptonUtilsCurry, _framptonUtilsExtend) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _extend = _interopRequire(_framptonUtilsExtend);

  module.exports = (0, _curry)(function (obj1, obj2) {
    return Object.freeze((0, _extend)({}, obj1, obj2));
  });
});
define('frampton-record/of', ['exports', 'module', 'frampton-record/copy'], function (exports, module, _framptonRecordCopy) {
  'use strict';

  /**
   * of :: Object -> Object
   *
   * @name of
   * @method
   * @memberof Frampton.Record
   * @param {Object} obj object to copy
   * @returns {Object}
   */
  module.exports = of_record;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _copy = _interopRequire(_framptonRecordCopy);

  function of_record(obj) {
    return (0, _copy)(obj);
  }
});
define('frampton-record/reduce', ['exports', 'module', 'frampton-utils/curry', 'frampton-record/for_each'], function (exports, module, _framptonUtilsCurry, _framptonRecordFor_each) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _forEach = _interopRequire(_framptonRecordFor_each);

  module.exports = (0, _curry)(function curried_reduce(fn, acc, obj) {

    (0, _forEach)(function (value, key) {
      acc = fn(acc, value, key);
    }, obj);

    return acc;
  });
});
define('frampton-record/update', ['exports', 'module', 'frampton-record/for_each'], function (exports, module, _framptonRecordFor_each) {
  'use strict';

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
  module.exports = update_object;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _forEach = _interopRequire(_framptonRecordFor_each);

  function update_object(base, update) {

    var newObj = {};

    (0, _forEach)(function (value, key) {
      if (update[key]) {
        newObj[key] = update[key];
      } else {
        newObj[key] = value;
      }
    }, base);

    return Object.freeze(newObj);
  }
});
define('frampton-signal', ['exports', 'frampton/namespace', 'frampton-signal/create', 'frampton-signal/stepper', 'frampton-signal/combine', 'frampton-signal/swap', 'frampton-signal/toggle', 'frampton-signal/is_signal'], function (exports, _framptonNamespace, _framptonSignalCreate, _framptonSignalStepper, _framptonSignalCombine, _framptonSignalSwap, _framptonSignalToggle, _framptonSignalIs_signal) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Frampton = _interopRequire(_framptonNamespace);

  var _create = _interopRequire(_framptonSignalCreate);

  var _stepper = _interopRequire(_framptonSignalStepper);

  var _combine = _interopRequire(_framptonSignalCombine);

  var _swap = _interopRequire(_framptonSignalSwap);

  var _toggle = _interopRequire(_framptonSignalToggle);

  var _isSignal = _interopRequire(_framptonSignalIs_signal);

  /**
   * @name Signal
   * @namespace
   * @memberof Frampton
   */
  _Frampton.Signal = {};
  _Frampton.Signal.create = _create;
  _Frampton.Signal.stepper = _stepper;
  _Frampton.Signal.combine = _combine;
  _Frampton.Signal.merge = _framptonSignalCreate.mergeMany;
  _Frampton.Signal.swap = _swap;
  _Frampton.Signal.toggle = _toggle;
  _Frampton.Signal.isSignal = _isSignal;
});
define('frampton-signal/combine', ['exports', 'module', 'frampton-signal/create'], function (exports, module, _framptonSignalCreate) {
  'use strict';

  module.exports = combine;

  function combine(mapping, parents) {
    return (0, _framptonSignalCreate.createSignal)(function (self) {
      self(mapping.apply(null, parents.map(function (parent) {
        return parent._value;
      })));
    }, parents);
  }
});
define('frampton-signal/create', ['exports', 'frampton-utils/guid', 'frampton-utils/is_defined', 'frampton-utils/is_promise', 'frampton-utils/is_function', 'frampton-utils/is_equal', 'frampton-utils/of_value', 'frampton-utils/noop', 'frampton-utils/log'], function (exports, _framptonUtilsGuid, _framptonUtilsIs_defined, _framptonUtilsIs_promise, _framptonUtilsIs_function, _framptonUtilsIs_equal, _framptonUtilsOf_value, _framptonUtilsNoop, _framptonUtilsLog) {
  'use strict';

  exports.__esModule = true;

  /**
   * @name createSignal
   * @memberof Frampton.Signal
   * @method
   * @private
   * @param {function}                 update  Function to call when this signal updates
   * @param {Frampton.Signal.Signal[]} parents List of signals this signal depends on
   * @param {*}                        initial Initial value for this signal
   * @returns {Frampton.Signal.Signal}
   */
  exports.createSignal = createSignal;

  /**
   * @name mergeMany
   * @memberof Frampton.Signal
   * @method
   * @param {Frampton.Signal.Signal[]} parents
   */
  exports.mergeMany = mergeMany;

  /**
   * @name Signal
   * @memberof Frampton.Signal
   * @class
   * @param {*} initial Initial value for this signal
   */
  exports['default'] = create;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _guid = _interopRequire(_framptonUtilsGuid);

  var _isDefined = _interopRequire(_framptonUtilsIs_defined);

  var _isPromise = _interopRequire(_framptonUtilsIs_promise);

  var _isFunction = _interopRequire(_framptonUtilsIs_function);

  var _isEqual = _interopRequire(_framptonUtilsIs_equal);

  var _ofValue = _interopRequire(_framptonUtilsOf_value);

  var _noop = _interopRequire(_framptonUtilsNoop);

  var _log = _interopRequire(_framptonUtilsLog);

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
    if ((0, _isPromise)(val)) {
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
      self(parent._value(arg._value));
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
      self(tag._value);
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
        self(parent._value);
      }
    }, [parent]);
  }

  /**
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
      self(fn(self._value, parent._value));
    }, [parent], initial);
  }

  /**
   * @name filter
   * @method
   * @private
   * @memberof Frampton.Signal.Signal#
   * @param {Any} predicate
   * @returns {Frampton.Signal.Signal}
   */
  function filter(predicate) {
    var parent = this;
    var filterFn = (0, _isFunction)(predicate) ? predicate : (0, _isEqual)(predicate);
    var initial = parent._hasValue && filterFn(parent._value) ? parent._value : undefined;
    return createSignal(function (self) {
      if (filterFn(parent._value)) {
        self(parent._value);
      }
    }, [parent], initial);
  }

  /**
   * @name filterPrevious
   * @method
   * @private
   * @memberof Frampton.Signal.Signal#
   * @param {Function} predicate
   * @returns {Frampton.Signal.Signal}
   */
  function filterPrevious(predicate) {
    var parent = this;
    var initial = parent._hasValue ? parent._value : undefined;
    return createSignal(function (self) {
      if (predicate(self._value, parent._value)) {
        self(parent._value);
      }
    }, [parent], initial);
  }

  /**
   * @name and
   * @method
   * @private
   * @memberof Frampton.Signal.Signal#
   * @param {Frampton.Signal.Signal} predicate
   * @returns {Frampton.Signal.Signal}
   */
  function and(predicate) {
    var parent = this;
    var initial = parent._hasValue && predicate._value ? parent._value : undefined;
    return createSignal(function (self) {
      if (predicate._value) {
        self(parent._value);
      }
    }, [parent], initial);
  }

  /**
   * @name not
   * @method
   * @private
   * @memberof Frampton.Signal.Signal#
   * @param {Frampton.Signal.Signal} predicate
   * @returns {Frampton.Signal.Signal}
   */
  function not(predicate) {
    var parent = this;
    var initial = parent._hasValue && !predicate._value ? parent._value : undefined;
    return createSignal(function (self) {
      if (!predicate._value) {
        self(parent.value);
      }
    }, [parent], initial);
  }

  /**
   * @name map
   * @method
   * @private
   * @memberof Frampton.Signal.Signal#
   * @param {Any} mapping A function or value to map the signal with. If a function, the value
   *                      on the parent signal will be passed to the function and the signal will
   *                      be mapped to the return value of the function. If a value, the value of
   *                      the parent signal will be replaced with the value.
   * @returns {Frampton.Signal.Signal} A new signal with mapped values
   */
  function map(mapping) {
    var parent = this;
    var mappingFn = (0, _isFunction)(mapping) ? mapping : (0, _ofValue)(mapping);
    var initial = parent._hasValue ? mappingFn(parent._value) : undefined;
    return createSignal(function (self) {
      self(mappingFn(parent._value));
    }, [parent], initial);
  }

  /**
   * @name debounce
   * @method
   * @private
   * @memberof Frampton.Signal.Signal#
   * @param {Number} delay Milliseconds to debounce the signal
   * @returns {Frampton.Signal.Signal}
   */
  function debounce(delay) {
    var parent = this;
    var timer = null;
    return createSignal(function (self) {
      if (!timer) {
        timer = setTimeout(function () {
          self(parent._value);
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
   * @param {Number} time
   * @returns {Frampton.Signal.Signal}
   */
  function delay(time) {
    var parent = this;
    return createSignal(function (self) {
      (function (saved) {
        setTimeout(function () {
          self(saved);
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
   * Calls the given function when this signal updates
   *
   * @name next
   * @method
   * @memberof Frampton.Signal.Signal#
   * @param {Function} fn The function to call
   * @returns {Frampton.Signal.Signal}
   */
  function next(fn) {
    var parent = this;
    return createSignal(function (self) {
      fn(parent._value);
    }, [parent]);
  }

  /**
   * Calls the given function when this signal has a value. The function
   * is called immediately if this function already has a value, then is
   * called again each time this signal updates.
   *
   * @name value
   * @method
   * @memberof Frampton.Signal.Signal#
   * @param {Function} fn The function to call
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
   * @name changes
   * @method
   * @memberof Frampton.Signal.Signal#
   * @param {Function} fn The function to call
   * @returns {Frampton.Signal.Signal}
   */
  function changes(fn) {
    return this.dropRepeats().value(fn);
  }

  /**
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
        (0, _log)(msg);
      } else {
        (0, _log)(parent._value);
      }
      self(parent._value);
    }, [parent], parent._value);
  }
  function createSignal(update, parents, initial) {

    var signal = function signal(val) {
      return (0, _isDefined)(val) ? (updateValue(signal, val), signal) : signal._value;
    };

    // Constructor
    signal.ctor = 'Signal';

    // Private
    signal._id = (0, _guid)();
    signal._value = initial;
    signal._hasValue = (0, _isDefined)(initial);
    signal._queued = false;
    signal._updater = null;
    signal._parents = parents || [];
    signal._children = [];
    signal._update = update || _noop;

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

  function mergeMany(parents) {
    var initial = parents.length > 0 ? parents[0]._value : undefined;
    return createSignal(function (self) {
      self(self._updater._value);
    }, parents, initial);
  }

  function create(initial) {
    return createSignal(null, null, initial);
  }
});
define('frampton-signal/is_signal', ['exports', 'module', 'frampton-utils/is_function', 'frampton-utils/is_string'], function (exports, module, _framptonUtilsIs_function, _framptonUtilsIs_string) {
  'use strict';

  module.exports = is_signal;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isFunction = _interopRequire(_framptonUtilsIs_function);

  var _isString = _interopRequire(_framptonUtilsIs_string);

  function is_signal(obj) {
    return (0, _isFunction)(obj) && (0, _isString)(obj.ctor) && obj.ctor === 'Signal';
  }
});
define('frampton-signal/stepper', ['exports', 'module', 'frampton-utils/curry', 'frampton-signal/create'], function (exports, module, _framptonUtilsCurry, _framptonSignalCreate) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _createSignal = _interopRequire(_framptonSignalCreate);

  // stepper :: a -> Signal a -> Signal a
  module.exports = (0, _curry)(function (initial, updater) {
    var sig = (0, _createSignal)(initial);
    return sig.merge(updater.dropRepeats());
  });
});
define('frampton-signal/swap', ['exports', 'module', 'frampton-utils/curry', 'frampton-signal/stepper'], function (exports, module, _framptonUtilsCurry, _framptonSignalStepper) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _stepper = _interopRequire(_framptonSignalStepper);

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
  module.exports = (0, _curry)(function toggle(sig1, sig2) {
    return (0, _stepper)(false, sig1.map(true).merge(sig2.map(false)));
  });
});
define('frampton-signal/toggle', ['exports', 'module', 'frampton-utils/assert', 'frampton-utils/curry', 'frampton-utils/is_boolean', 'frampton-signal/create'], function (exports, module, _framptonUtilsAssert, _framptonUtilsCurry, _framptonUtilsIs_boolean, _framptonSignalCreate) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _assert = _interopRequire(_framptonUtilsAssert);

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _isBoolean = _interopRequire(_framptonUtilsIs_boolean);

  var _createSignal = _interopRequire(_framptonSignalCreate);

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
  module.exports = (0, _curry)(function (initial, updater) {
    (0, _assert)('Signal.toggle must be initialized with a Boolean', (0, _isBoolean)(initial));
    var sig = (0, _createSignal)(initial);
    var current = initial;
    return sig.merge(updater.map(function () {
      current = !current;
      return current;
    }));
  });
});
define('frampton-string', ['exports', 'frampton/namespace', 'frampton-string/replace', 'frampton-string/trim', 'frampton-string/join', 'frampton-string/split', 'frampton-string/lines', 'frampton-string/words', 'frampton-string/starts_with', 'frampton-string/ends_with', 'frampton-string/contains', 'frampton-string/capitalize', 'frampton-string/dash_to_camel', 'frampton-string/length', 'frampton-string/normalize_newline'], function (exports, _framptonNamespace, _framptonStringReplace, _framptonStringTrim, _framptonStringJoin, _framptonStringSplit, _framptonStringLines, _framptonStringWords, _framptonStringStarts_with, _framptonStringEnds_with, _framptonStringContains, _framptonStringCapitalize, _framptonStringDash_to_camel, _framptonStringLength, _framptonStringNormalize_newline) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Frampton = _interopRequire(_framptonNamespace);

  var _replace = _interopRequire(_framptonStringReplace);

  var _trim = _interopRequire(_framptonStringTrim);

  var _join = _interopRequire(_framptonStringJoin);

  var _split = _interopRequire(_framptonStringSplit);

  var _lines = _interopRequire(_framptonStringLines);

  var _words = _interopRequire(_framptonStringWords);

  var _startsWith = _interopRequire(_framptonStringStarts_with);

  var _endsWith = _interopRequire(_framptonStringEnds_with);

  var _contains = _interopRequire(_framptonStringContains);

  var _capitalize = _interopRequire(_framptonStringCapitalize);

  var _dashToCamel = _interopRequire(_framptonStringDash_to_camel);

  var _length = _interopRequire(_framptonStringLength);

  var _normalizeNewline = _interopRequire(_framptonStringNormalize_newline);

  /**
   * @name String
   * @namespace
   * @memberof Frampton
   */
  _Frampton.String = {};
  _Frampton.String.replace = _replace;
  _Frampton.String.trim = _trim;
  _Frampton.String.join = _join;
  _Frampton.String.split = _split;
  _Frampton.String.lines = _lines;
  _Frampton.String.words = _words;
  _Frampton.String.startsWith = _startsWith;
  _Frampton.String.endsWith = _endsWith;
  _Frampton.String.contains = _contains;
  _Frampton.String.capitalize = _capitalize;
  _Frampton.String.dashToCamel = _dashToCamel;
  _Frampton.String.length = _length;
  _Frampton.String.normalizeNewline = _normalizeNewline;
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

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  // contains :: String -> String -> Boolean
  module.exports = (0, _curry)(function contains(sub, str) {
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

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  // ends_with :: String -> String -> Boolean
  module.exports = (0, _curry)(function ends_with(sub, str) {
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

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  /**
   * join :: String -> Array String -> String
   * @name join
   * @method
   * @memberof Frampton.String
   * @param {String} sep
   * @param {Array} strs
   * @returns {String}
   */
  module.exports = (0, _curry)(function join(sep, strs) {
    return strs.join(sep);
  });
});
define('frampton-string/length', ['exports', 'module', 'frampton-utils/is_something', 'frampton-utils/is_defined', 'frampton-string/normalize_newline'], function (exports, module, _framptonUtilsIs_something, _framptonUtilsIs_defined, _framptonStringNormalize_newline) {
  'use strict';

  /**
   * @name length
   * @memberof Frampton.String
   * @static
   * @param {String}
   * @returns {Number}
   */
  module.exports = length;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isSomething = _interopRequire(_framptonUtilsIs_something);

  var _isDefined = _interopRequire(_framptonUtilsIs_defined);

  var _normalizeNewline = _interopRequire(_framptonStringNormalize_newline);

  function length(str) {
    return (0, _isSomething)(str) && (0, _isDefined)(str.length) ? (0, _normalizeNewline)(str).length : 0;
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

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

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
  module.exports = (0, _curry)(function replace(newSubStr, oldSubStr, str) {
    return str.replace(oldSubStr, newSubStr);
  });
});
define('frampton-string/split', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  // split :: String -> String -> Array String
  module.exports = (0, _curry)(function join(sep, str) {
    return str.split(sep);
  });
});
define('frampton-string/starts_with', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  // starts_with :: String -> String -> Boolean
  module.exports = (0, _curry)(function starts_with(sub, str) {
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

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Frampton = _interopRequire(_framptonNamespace);

  var _addClass = _interopRequire(_framptonStyleAdd_class);

  var _removeClass = _interopRequire(_framptonStyleRemove_class);

  var _hasClass = _interopRequire(_framptonStyleHas_class);

  var _matches = _interopRequire(_framptonStyleMatches);

  var _current = _interopRequire(_framptonStyleCurrent_value);

  var _setStyle = _interopRequire(_framptonStyleSet_style);

  var _removeStyle = _interopRequire(_framptonStyleRemove_style);

  var _applyStyles = _interopRequire(_framptonStyleApply_styles);

  var _removeStyles = _interopRequire(_framptonStyleRemove_styles);

  var _closest = _interopRequire(_framptonStyleClosest);

  var _contains = _interopRequire(_framptonStyleContains);

  var _selectorContains = _interopRequire(_framptonStyleSelector_contains);

  var _supported = _interopRequire(_framptonStyleSupported);

  var _supportedProps = _interopRequire(_framptonStyleSupported_props);

  /**
   * @name Style
   * @namespace
   * @memberof Frampton
   */
  _Frampton.Style = {};
  _Frampton.Style.addClass = _addClass;
  _Frampton.Style.closest = _closest;
  _Frampton.Style.removeClass = _removeClass;
  _Frampton.Style.hasClass = _hasClass;
  _Frampton.Style.matches = _matches;
  _Frampton.Style.current = _current;
  _Frampton.Style.setStyle = _setStyle;
  _Frampton.Style.removeStyle = _removeStyle;
  _Frampton.Style.applyStyles = _applyStyles;
  _Frampton.Style.removeStyles = _removeStyles;
  _Frampton.Style.contains = _contains;
  _Frampton.Style.selectorContains = _selectorContains;
  _Frampton.Style.supported = _supported;
  _Frampton.Style.supportedProps = _supportedProps;
});
define('frampton-style/add_class', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  /**
   * @name addClass
   * @method
   * @memberof Frampton.Style
   * @param {Object} element
   * @param {String} name
   */
  module.exports = (0, _curry)(function add_class(element, name) {
    element.classList.add(name);
  });
});
define('frampton-style/apply_styles', ['exports', 'module', 'frampton-utils/curry', 'frampton-utils/is_something', 'frampton-style/remove_style', 'frampton-style/set_style'], function (exports, module, _framptonUtilsCurry, _framptonUtilsIs_something, _framptonStyleRemove_style, _framptonStyleSet_style) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _isSomething = _interopRequire(_framptonUtilsIs_something);

  var _removeStyle = _interopRequire(_framptonStyleRemove_style);

  var _setStyle = _interopRequire(_framptonStyleSet_style);

  /**
   * @name applyStyles
   * @method
   * @memberof Frampton.Style
   * @param {Object} element DomNode to add styles to
   * @param {Object} props   Has of props to add
   */
  module.exports = (0, _curry)(function apply_styles(element, props) {
    for (var key in props) {
      var value = props[key];
      if ((0, _isSomething)(value)) {
        (0, _setStyle)(element, key, value);
      } else {
        (0, _removeStyle)(element, key, value);
      }
    }
  });
});
define('frampton-style/closest', ['exports', 'module', 'frampton-utils/curry', 'frampton-style/matches'], function (exports, module, _framptonUtilsCurry, _framptonStyleMatches) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _matches = _interopRequire(_framptonStyleMatches);

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
  module.exports = (0, _curry)(function closest(selector, element) {

    while (element) {
      if ((0, _matches)(selector, element)) {
        break;
      }
      element = element.parentElement;
    }

    return element || null;
  });
});
define('frampton-style/contains', ['exports', 'module', 'frampton-utils/curry', 'frampton-style/matches'], function (exports, module, _framptonUtilsCurry, _framptonStyleMatches) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _matches = _interopRequire(_framptonStyleMatches);

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
  module.exports = (0, _curry)(function contains(selector, element) {
    return (0, _matches)(selector, element) || element.querySelectorAll(selector).length > 0;
  });
});
define('frampton-style/current_value', ['exports', 'module', 'frampton-utils/curry', 'frampton-style/supported'], function (exports, module, _framptonUtilsCurry, _framptonStyleSupported) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _supported = _interopRequire(_framptonStyleSupported);

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
  module.exports = (0, _curry)(function current(element, prop) {
    return style(element).getPropertyValue((0, _supported)(prop));
  });
});
define('frampton-style/has_class', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

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
  module.exports = (0, _curry)(function has_class(name, element) {
    return element.classList.contains(name);
  });
});
define('frampton-style/matches', ['exports', 'module', 'frampton-utils/curry', 'frampton-utils/is_function'], function (exports, module, _framptonUtilsCurry, _framptonUtilsIs_function) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _isFunction = _interopRequire(_framptonUtilsIs_function);

  /**
   * @name matches
   * @method
   * @memberof Frampton.Style
   * @param {String} selector
   * @param {Object} element
   * @returns {Boolean}
   */
  module.exports = (0, _curry)(function matches(selector, element) {

    if ((0, _isFunction)(element.matches)) {
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

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  /**
   * @name removeClass
   * @method
   * @memberof Frampton.Style
   * @param {Object} element
   * @param {String} name
   */
  module.exports = (0, _curry)(function remove_class(element, name) {
    element.classList.remove(name);
  });
});
define('frampton-style/remove_style', ['exports', 'module', 'frampton-utils/curry', 'frampton-style/supported'], function (exports, module, _framptonUtilsCurry, _framptonStyleSupported) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _supported = _interopRequire(_framptonStyleSupported);

  /**
   * @name removeStyle
   * @method
   * @memberof Frampton.Style
   * @param {Object} element
   * @param {String} key
   */
  module.exports = (0, _curry)(function remove_style(element, key) {
    element.style.removeProperty((0, _supported)(key));
  });
});
define('frampton-style/remove_styles', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  /**
   * removeStyles :: DomNode -> Object -> ()
   *
   * @name removeStyles
   * @method
   * @memberof Frampton.Style
   * @param {Object} element A dom node to remove styles from
   * @param {Object} props   A hash of properties to remove
   */
  module.exports = (0, _curry)(function remove_styles(element, props) {
    for (var key in props) {
      element.style.removeProperty(key);
    }
  });
});
define('frampton-style/selector_contains', ['exports', 'module', 'frampton-utils/curry', 'frampton-html/contains'], function (exports, module, _framptonUtilsCurry, _framptonHtmlContains) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _contains = _interopRequire(_framptonHtmlContains);

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
  module.exports = (0, _curry)(function selector_contains(selector, element) {

    var elementList = document.querySelectorAll(selector);
    var i = 0;

    while (elementList[i] && !(0, _contains)(elementList[i], element)) {
      i++;
    }

    return elementList[i] ? true : false;
  });
});
define('frampton-style/set_style', ['exports', 'module', 'frampton-utils/curry', 'frampton-style/supported'], function (exports, module, _framptonUtilsCurry, _framptonStyleSupported) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _supported = _interopRequire(_framptonStyleSupported);

  /**
   * @name setStyle
   * @method
   * @memberof Frampton.Style
   * @param {Object} element
   * @param {String} key
   * @param {String} value
   */
  module.exports = (0, _curry)(function set_style(element, key, value) {
    element.style.setProperty((0, _supported)(key), value, '');
  });
});
define('frampton-style/supported', ['exports', 'module', 'frampton-utils/memoize', 'frampton-style/supported_by_element'], function (exports, module, _framptonUtilsMemoize, _framptonStyleSupported_by_element) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _memoize = _interopRequire(_framptonUtilsMemoize);

  var _supportedByElement = _interopRequire(_framptonStyleSupported_by_element);

  /**
   * supported :: String -> String
   *
   * @name supported
   * @method
   * @memberof Frampton.Style
   * @param {String} prop A standard CSS property name
   * @returns {String} The property name with any vendor prefixes required by the browser, or null if the property is not supported
   */
  module.exports = (0, _memoize)((0, _supportedByElement)(document.createElement('div')));
});
define('frampton-style/supported_by_element', ['exports', 'module', 'frampton-utils/curry', 'frampton-utils/is_something', 'frampton-string/capitalize', 'frampton-string/dash_to_camel'], function (exports, module, _framptonUtilsCurry, _framptonUtilsIs_something, _framptonStringCapitalize, _framptonStringDash_to_camel) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _isSomething = _interopRequire(_framptonUtilsIs_something);

  var _capitalize = _interopRequire(_framptonStringCapitalize);

  var _dashToCamel = _interopRequire(_framptonStringDash_to_camel);

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
  module.exports = (0, _curry)(function supported_by_element(element, prop) {

    var camelProp = (0, _dashToCamel)(prop);

    if ((0, _isSomething)(element.style[camelProp])) {
      return prop;
    }

    for (var key in vendors) {
      var propToCheck = key + (0, _capitalize)(camelProp);
      if ((0, _isSomething)(element.style[propToCheck])) {
        return ('-' + vendors[key] + '-' + prop).toLowerCase();
      }
    }

    return null;
  });
});
define('frampton-style/supported_props', ['exports', 'module', 'frampton-utils/warn', 'frampton-style/supported'], function (exports, module, _framptonUtilsWarn, _framptonStyleSupported) {
  'use strict';

  /**
   * @name supportedProps
   * @method
   * @memberof Frampton.Style
   * @param {Object} props
   * @returns {Object}
   */
  module.exports = supported_props;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _warn = _interopRequire(_framptonUtilsWarn);

  var _supported = _interopRequire(_framptonStyleSupported);

  function supported_props(props) {
    var obj = {};
    var temp;
    for (var key in props) {
      temp = (0, _supported)(key);
      if (temp) {
        obj[(0, _supported)(key)] = props[key];
      } else {
        (0, _warn)('style prop ' + key + ' is not supported by this browser');
      }
    }
    return obj;
  }
});
define('frampton-utils', ['exports', 'frampton/namespace', 'frampton-utils/apply', 'frampton-utils/assert', 'frampton-utils/compose', 'frampton-utils/curry', 'frampton-utils/curry_n', 'frampton-utils/equal', 'frampton-utils/error', 'frampton-utils/extend', 'frampton-utils/get', 'frampton-utils/has_length', 'frampton-utils/has_prop', 'frampton-utils/identity', 'frampton-utils/immediate', 'frampton-utils/is_array', 'frampton-utils/is_boolean', 'frampton-utils/is_defined', 'frampton-utils/is_empty', 'frampton-utils/is_equal', 'frampton-utils/is_false', 'frampton-utils/is_function', 'frampton-utils/is_node', 'frampton-utils/is_nothing', 'frampton-utils/is_null', 'frampton-utils/is_number', 'frampton-utils/is_object', 'frampton-utils/is_primitive', 'frampton-utils/is_promise', 'frampton-utils/is_something', 'frampton-utils/is_string', 'frampton-utils/is_true', 'frampton-utils/is_undefined', 'frampton-utils/log', 'frampton-utils/lazy', 'frampton-utils/memoize', 'frampton-utils/noop', 'frampton-utils/not', 'frampton-utils/of_value', 'frampton-utils/warn'], function (exports, _framptonNamespace, _framptonUtilsApply, _framptonUtilsAssert, _framptonUtilsCompose, _framptonUtilsCurry, _framptonUtilsCurry_n, _framptonUtilsEqual, _framptonUtilsError, _framptonUtilsExtend, _framptonUtilsGet, _framptonUtilsHas_length, _framptonUtilsHas_prop, _framptonUtilsIdentity, _framptonUtilsImmediate, _framptonUtilsIs_array, _framptonUtilsIs_boolean, _framptonUtilsIs_defined, _framptonUtilsIs_empty, _framptonUtilsIs_equal, _framptonUtilsIs_false, _framptonUtilsIs_function, _framptonUtilsIs_node, _framptonUtilsIs_nothing, _framptonUtilsIs_null, _framptonUtilsIs_number, _framptonUtilsIs_object, _framptonUtilsIs_primitive, _framptonUtilsIs_promise, _framptonUtilsIs_something, _framptonUtilsIs_string, _framptonUtilsIs_true, _framptonUtilsIs_undefined, _framptonUtilsLog, _framptonUtilsLazy, _framptonUtilsMemoize, _framptonUtilsNoop, _framptonUtilsNot, _framptonUtilsOf_value, _framptonUtilsWarn) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Frampton = _interopRequire(_framptonNamespace);

  var _apply = _interopRequire(_framptonUtilsApply);

  var _assert = _interopRequire(_framptonUtilsAssert);

  var _compose = _interopRequire(_framptonUtilsCompose);

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _curryN = _interopRequire(_framptonUtilsCurry_n);

  var _equal = _interopRequire(_framptonUtilsEqual);

  var _error = _interopRequire(_framptonUtilsError);

  var _extend = _interopRequire(_framptonUtilsExtend);

  var _get = _interopRequire(_framptonUtilsGet);

  var _hasLength = _interopRequire(_framptonUtilsHas_length);

  var _hasProp = _interopRequire(_framptonUtilsHas_prop);

  var _identity = _interopRequire(_framptonUtilsIdentity);

  var _immediate = _interopRequire(_framptonUtilsImmediate);

  var _isArray = _interopRequire(_framptonUtilsIs_array);

  var _isBoolean = _interopRequire(_framptonUtilsIs_boolean);

  var _isDefined = _interopRequire(_framptonUtilsIs_defined);

  var _isEmpty = _interopRequire(_framptonUtilsIs_empty);

  var _isEqual = _interopRequire(_framptonUtilsIs_equal);

  var _isFalse = _interopRequire(_framptonUtilsIs_false);

  var _isFunction = _interopRequire(_framptonUtilsIs_function);

  var _isNode = _interopRequire(_framptonUtilsIs_node);

  var _isNothing = _interopRequire(_framptonUtilsIs_nothing);

  var _isNull = _interopRequire(_framptonUtilsIs_null);

  var _isNumber = _interopRequire(_framptonUtilsIs_number);

  var _isObject = _interopRequire(_framptonUtilsIs_object);

  var _isPrimitive = _interopRequire(_framptonUtilsIs_primitive);

  var _isPromise = _interopRequire(_framptonUtilsIs_promise);

  var _isSomething = _interopRequire(_framptonUtilsIs_something);

  var _isString = _interopRequire(_framptonUtilsIs_string);

  var _isTrue = _interopRequire(_framptonUtilsIs_true);

  var _isUndefined = _interopRequire(_framptonUtilsIs_undefined);

  var _log = _interopRequire(_framptonUtilsLog);

  var _lazy = _interopRequire(_framptonUtilsLazy);

  var _memoize = _interopRequire(_framptonUtilsMemoize);

  var _noop = _interopRequire(_framptonUtilsNoop);

  var _not = _interopRequire(_framptonUtilsNot);

  var _ofValue = _interopRequire(_framptonUtilsOf_value);

  var _warn = _interopRequire(_framptonUtilsWarn);

  /**
   * @name Utils
   * @namespace
   * @memberof Frampton
   */
  _Frampton.Utils = {};
  _Frampton.Utils.apply = _apply;
  _Frampton.Utils.assert = _assert;
  _Frampton.Utils.compose = _compose;
  _Frampton.Utils.curry = _curry;
  _Frampton.Utils.curryN = _curryN;
  _Frampton.Utils.equal = _equal;
  _Frampton.Utils.error = _error;
  _Frampton.Utils.extend = _extend;
  _Frampton.Utils.get = _get;
  _Frampton.Utils.hasLength = _hasLength;
  _Frampton.Utils.hasProp = _hasProp;
  _Frampton.Utils.identity = _identity;
  _Frampton.Utils.immediate = _immediate;
  _Frampton.Utils.isArray = _isArray;
  _Frampton.Utils.isBoolean = _isBoolean;
  _Frampton.Utils.isDefined = _isDefined;
  _Frampton.Utils.isEmpty = _isEmpty;
  _Frampton.Utils.isEqual = _isEqual;
  _Frampton.Utils.isFalse = _isFalse;
  _Frampton.Utils.isFunction = _isFunction;
  _Frampton.Utils.isNode = _isNode;
  _Frampton.Utils.isNothing = _isNothing;
  _Frampton.Utils.isNull = _isNull;
  _Frampton.Utils.isNumber = _isNumber;
  _Frampton.Utils.isObject = _isObject;
  _Frampton.Utils.isPrimitive = _isPrimitive;
  _Frampton.Utils.isPromise = _isPromise;
  _Frampton.Utils.isSomething = _isSomething;
  _Frampton.Utils.isString = _isString;
  _Frampton.Utils.isTrue = _isTrue;
  _Frampton.Utils.isUndefined = _isUndefined;
  _Frampton.Utils.log = _log;
  _Frampton.Utils.lazy = _lazy;
  _Frampton.Utils.memoize = _memoize;
  _Frampton.Utils.noop = _noop;
  _Frampton.Utils.not = _not;
  _Frampton.Utils.ofValue = _ofValue;
  _Frampton.Utils.warn = _warn;
});
define("frampton-utils/apply", ["exports", "module"], function (exports, module) {
  /**
   * Takes a function and warps it to be called at a later time.
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
  module.exports = compose;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _assert = _interopRequire(_framptonUtilsAssert);

  var _foldr = _interopRequire(_framptonListFoldr);

  var _first = _interopRequire(_framptonListFirst);

  function compose() {
    for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
      fns[_key] = arguments[_key];
    }

    (0, _assert)('Compose did not receive any arguments. You can\'t compose nothing. Stoopid.', fns.length > 0);
    return function composition() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return (0, _first)((0, _foldr)(function (args, fn) {
        return [fn.apply(this, args)];
      }, args, fns));
    };
  }
});
define('frampton-utils/curry', ['exports', 'module', 'frampton-utils/curry_n'], function (exports, module, _framptonUtilsCurry_n) {
  'use strict';

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
  module.exports = curry;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curryN = _interopRequire(_framptonUtilsCurry_n);

  function curry(fn) {
    return (0, _curryN)(fn.length, fn);
  }
});
define('frampton-utils/curry_n', ['exports', 'module', 'frampton-utils/assert', 'frampton-utils/is_function'], function (exports, module, _framptonUtilsAssert, _framptonUtilsIs_function) {
  'use strict';

  /**
   * Takes a function and returns a new function that will wait to execute the original
   * function until it has received all of its arguments. Each time the function is called
   * without receiving all of its arguments it will return a new function waiting for the
   * remaining arguments.
   *
   * @name curryN
   * @memberof Frampton.Utils
   * @method
   * @param {Number}   arity Number of arguments for function
   * @param {Function} curry Function to curry.
   * @returns {Function} A curried version of the function passed in.
   */
  module.exports = curry_n;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _assert = _interopRequire(_framptonUtilsAssert);

  var _isFunction = _interopRequire(_framptonUtilsIs_function);

  function curry_n(arity, fn) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    (0, _assert)('Argument passed to curry is not a function', (0, _isFunction)(fn));

    function curried() {
      for (var _len2 = arguments.length, args2 = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args2[_key2] = arguments[_key2];
      }

      // an array of arguments for this instance of the curried function
      var locals = args.concat(args2);

      if (locals.length >= arity) {
        return fn.apply(null, locals);
      } else {
        return curry_n.apply(null, [arity, fn].concat(locals));
      }
    }

    return args.length >= arity ? curried() : curried;
  }
});
define('frampton-utils/equal', ['exports', 'module', 'frampton-utils/is_object', 'frampton-utils/is_array'], function (exports, module, _framptonUtilsIs_object, _framptonUtilsIs_array) {
  'use strict';

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
  module.exports = deep_equal;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isObject = _interopRequire(_framptonUtilsIs_object);

  var _isArray = _interopRequire(_framptonUtilsIs_array);

  function deep_equal(obj1, obj2) {

    var depth = 0;
    var original1 = obj1;
    var original2 = obj2;

    function _equal(obj1, obj2) {

      depth++;

      if (
      // If we're dealing with a circular reference, return reference equality.
      !(depth > 1 && original1 === obj1 && original2 === obj2) && ((0, _isObject)(obj1) || (0, _isArray)(obj1)) && ((0, _isObject)(obj2) || (0, _isArray)(obj2))) {

        var key = null;

        for (key in obj1) {
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

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Frampton = _interopRequire(_framptonNamespace);

  var _isSomething = _interopRequire(_framptonUtilsIs_something);

  function error(msg, data) {

    if (_Frampton.isDev()) {

      if ((0, _isSomething)(console.error)) {
        if ((0, _isSomething)(data)) {
          console.error(msg, data);
        } else {
          console.error(msg);
        }
      } else if ((0, _isSomething)(console.log)) {
        if ((0, _isSomething)(data)) {
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
define('frampton-utils/get', ['exports', 'module', 'frampton-utils/curry', 'frampton-utils/is_nothing', 'frampton-utils/is_string', 'frampton-utils/is_primitive'], function (exports, module, _framptonUtilsCurry, _framptonUtilsIs_nothing, _framptonUtilsIs_string, _framptonUtilsIs_primitive) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _isNothing = _interopRequire(_framptonUtilsIs_nothing);

  var _isString = _interopRequire(_framptonUtilsIs_string);

  var _isPrimitive = _interopRequire(_framptonUtilsIs_primitive);

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
  module.exports = (0, _curry)(function get(_x, _x2) {
    var _again = true;

    _function: while (_again) {
      var prop = _x,
          obj = _x2;
      parts = head = tail = sub = undefined;
      _again = false;

      if ((0, _isPrimitive)(obj) || (0, _isNothing)(obj)) {
        return null;
      } else if ((0, _isString)(prop)) {
        var parts = (prop || '').split('.').filter(function (val) {
          return val.trim() !== '';
        });

        if (parts.length > 1) {
          var head = parts[0];
          var tail = parts.slice(1);

          var sub = obj[head];
          if (!(0, _isPrimitive)(sub)) {
            _x = tail.join('.');
            _x2 = sub;
            _again = true;
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
define("frampton-utils/guid", ["exports", "module"], function (exports, module) {
  "use strict";

  module.exports = guid;
  var id = 0;

  function guid() {
    return id++;
  }
});
define('frampton-utils/has_length', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

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
  module.exports = (0, _curry)(function has_length(len, obj) {
    return obj && obj.length && obj.length >= len ? true : false;
  });
});
define('frampton-utils/has_prop', ['exports', 'module', 'frampton-utils/curry', 'frampton-utils/get', 'frampton-utils/is_something'], function (exports, module, _framptonUtilsCurry, _framptonUtilsGet, _framptonUtilsIs_something) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _get = _interopRequire(_framptonUtilsGet);

  var _isSomething = _interopRequire(_framptonUtilsIs_something);

  module.exports = (0, _curry)(function (prop, obj) {
    return (0, _isSomething)((0, _get)(prop, obj));
  });
});
define("frampton-utils/identity", ["exports", "module"], function (exports, module) {
  "use strict";

  module.exports = identity;

  function identity(x) {
    return x;
  }
});
define("frampton-utils/immediate", ["exports", "module"], function (exports, module) {
  /**
   * immediate :: Function -> ()
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

  /**
   * Returns a boolean telling us if a given value is defined
   *
   * @name isDefined
   * @method
   * @memberof Frampton.Utils
   * @param {*} obj
   * @returns {Boolean}
   */
  module.exports = is_defined;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isUndefined = _interopRequire(_framptonUtilsIs_undefined);

  function is_defined(obj) {
    return !(0, _isUndefined)(obj);
  }
});
define('frampton-utils/is_empty', ['exports', 'module', 'frampton-utils/is_nothing'], function (exports, module, _framptonUtilsIs_nothing) {
  'use strict';

  /**
   * Returns a boolean telling us if a given value doesn't exist or has length 0
   *
   * @name isEmpty
   * @method
   * @memberof Frampton.Utils
   * @param {*} obj
   * @returns {Boolean}
   */
  module.exports = is_empty;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isNothing = _interopRequire(_framptonUtilsIs_nothing);

  function is_empty(obj) {
    return (0, _isNothing)(obj) || !obj.length || 0 === obj.length;
  }
});
define('frampton-utils/is_equal', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

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
  module.exports = (0, _curry)(function is_equal(a, b) {
    return a === b;
  });
});
define("frampton-utils/is_false", ["exports", "module"], function (exports, module) {
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

  /**
   * Returns true/false is the object a DomNode
   *
   * @name isNode
   * @method
   * @memberof Frampton.Utils
   * @param {*} obj
   * @returns {Boolean}
   */
  module.exports = is_node;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isSomething = _interopRequire(_framptonUtilsIs_something);

  var _isObject = _interopRequire(_framptonUtilsIs_object);

  var _isDefined = _interopRequire(_framptonUtilsIs_defined);

  function is_node(obj) {
    return (0, _isSomething)(obj) && (0, _isObject)(obj) && (0, _isDefined)(obj.nodeType) && (0, _isDefined)(obj.nodeName);
  }
});
define('frampton-utils/is_nothing', ['exports', 'module', 'frampton-utils/is_undefined', 'frampton-utils/is_null'], function (exports, module, _framptonUtilsIs_undefined, _framptonUtilsIs_null) {
  'use strict';

  /**
   * Returns true/false is the object null or undefined
   *
   * @name isNothing
   * @method
   * @memberof Frampton.Utils
   * @param {*} obj
   * @returns {Boolean}
   */
  module.exports = is_nothing;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isUndefined = _interopRequire(_framptonUtilsIs_undefined);

  var _isNull = _interopRequire(_framptonUtilsIs_null);

  function is_nothing(obj) {
    return (0, _isUndefined)(obj) || (0, _isNull)(obj);
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
define('frampton-utils/is_object', ['exports', 'module', 'frampton-utils/is_something', 'frampton-utils/is_array'], function (exports, module, _framptonUtilsIs_something, _framptonUtilsIs_array) {
  'use strict';

  /**
   * Returns true/false is the object a regular Object
   *
   * @name isObject
   * @method
   * @memberof Frampton.Utils
   * @param {*} obj
   * @returns {Boolean}
   */
  module.exports = isObject;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isSomething = _interopRequire(_framptonUtilsIs_something);

  var _isArray = _interopRequire(_framptonUtilsIs_array);

  function isObject(obj) {
    return (0, _isSomething)(obj) && !(0, _isArray)(obj) && typeof obj === 'object';
  }
});
define('frampton-utils/is_primitive', ['exports', 'module', 'frampton-utils/is_number', 'frampton-utils/is_boolean', 'frampton-utils/is_string'], function (exports, module, _framptonUtilsIs_number, _framptonUtilsIs_boolean, _framptonUtilsIs_string) {
  'use strict';

  /**
   * Returns true/false is the value a primitive value
   *
   * @name isPrimitive
   * @method
   * @memberof Frampton.Utils
   * @param {*} obj
   * @returns {Boolean}
   */
  module.exports = is_primitive;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isNumber = _interopRequire(_framptonUtilsIs_number);

  var _isBoolean = _interopRequire(_framptonUtilsIs_boolean);

  var _isString = _interopRequire(_framptonUtilsIs_string);

  function is_primitive(obj) {
    return (0, _isNumber)(obj) || (0, _isBoolean)(obj) || (0, _isString)(obj);
  }
});
define('frampton-utils/is_promise', ['exports', 'module', 'frampton-utils/is_object', 'frampton-utils/is_function'], function (exports, module, _framptonUtilsIs_object, _framptonUtilsIs_function) {
  'use strict';

  /**
   * Returns true/false indicating if object appears to be a Promise
   *
   * @name isPromise
   * @method
   * @memberof Frampton.Utils
   * @param {*} obj
   * @returns {Boolean}
   */
  module.exports = is_promise;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isObject = _interopRequire(_framptonUtilsIs_object);

  var _isFunction = _interopRequire(_framptonUtilsIs_function);

  function is_promise(obj) {
    return (0, _isObject)(obj) && (0, _isFunction)(obj.then);
  }
});
define('frampton-utils/is_something', ['exports', 'module', 'frampton-utils/is_nothing'], function (exports, module, _framptonUtilsIs_nothing) {
  'use strict';

  /**
   * Returns true/false indicating if object is not null or undefined
   *
   * @name isSomething
   * @method
   * @memberof Frampton.Utils
   * @param {*} obj
   * @returns {Boolean}
   */
  module.exports = is_something;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isNothing = _interopRequire(_framptonUtilsIs_nothing);

  function is_something(obj) {
    return !(0, _isNothing)(obj);
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
define('frampton-utils/lazy', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  /**
   * Takes a function and warps it to be called at a later time.
   * @name lazy
   * @memberof Frampton
   * @method
   * @method
   * @static
   * @param {Function} fn The function to wrap.
   * @param {Array} args Array of arguments to pass to the function when called.
   */
  module.exports = (0, _curry)(function lazy(fn, args) {
    return function () {
      return fn.apply(null, args);
    };
  });
});
define('frampton-utils/log', ['exports', 'module', 'frampton/namespace', 'frampton-utils/is_something'], function (exports, module, _framptonNamespace, _framptonUtilsIs_something) {
  'use strict';

  module.exports = log;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Frampton = _interopRequire(_framptonNamespace);

  var _isSomething = _interopRequire(_framptonUtilsIs_something);

  function log(msg, data) {

    if (_Frampton.isDev() && (0, _isSomething)(console.log)) {
      if ((0, _isSomething)(data)) {
        console.log(msg, data);
      } else {
        console.log(msg);
      }
    }

    return msg;
  }
});
define('frampton-utils/memoize', ['exports', 'module', 'frampton-utils/is_string', 'frampton-utils/is_number'], function (exports, module, _framptonUtilsIs_string, _framptonUtilsIs_number) {
  'use strict';

  /**
   * @name memoize
   * @method
   * @memberof Frampton.Utils
   * @param {Function} fn
   * @param {Object}   [context]
   * @returns {Function}
   */
  module.exports = memoize;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isString = _interopRequire(_framptonUtilsIs_string);

  var _isNumber = _interopRequire(_framptonUtilsIs_number);

  function memoize(fn, context) {

    var store = {};
    var len = fn.length;

    return function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var key = len === 1 && ((0, _isString)(args[0]) || (0, _isNumber)(args[0])) ? args[0] : JSON.stringify(args);

      if (key in store) {
        return store[key];
      } else {
        return store[key] = fn.apply(context || null, args);
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
define("frampton-utils/not", ["exports", "module"], function (exports, module) {
  /**
   * not :: Function -> a -> Boolean
   * @name not
   * @method
   * @memberof Frampton.Utils
   * @param {Function} fn
   * @returns {Boolean}
   */
  "use strict";

  module.exports = not;

  function not(fn) {
    return function (arg) {
      return !fn(arg);
    };
  }
});
define('frampton-utils/not_implemented', ['exports', 'module'], function (exports, module) {
  'use strict';

  module.exports = function () {
    throw new Error('This method has not been implemented');
  };
});
define("frampton-utils/of_value", ["exports", "module"], function (exports, module) {
  /**
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
define('frampton-utils/warn', ['exports', 'module', 'frampton/namespace', 'frampton-utils/is_something'], function (exports, module, _framptonNamespace, _framptonUtilsIs_something) {
  'use strict';

  module.exports = warn;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Frampton = _interopRequire(_framptonNamespace);

  var _isSomething = _interopRequire(_framptonUtilsIs_something);

  function warn(msg, data) {

    if (_Frampton.isDev()) {

      if ((0, _isSomething)(console.warn)) {
        if ((0, _isSomething)(data)) {
          console.warn(msg, data);
        } else {
          console.warn(msg);
        }
      } else if ((0, _isSomething)(console.log)) {
        if ((0, _isSomething)(data)) {
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

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Frampton = _interopRequire(_framptonNamespace);

  var _Window = _interopRequire(_framptonWindowWindow);

  _Frampton.Window = _Window;
});
define('frampton-window/window', ['exports', 'module', 'frampton-signal/stepper', 'frampton-events/on_event', 'frampton-utils/get', 'frampton-utils/is_something'], function (exports, module, _framptonSignalStepper, _framptonEventsOn_event, _framptonUtilsGet, _framptonUtilsIs_something) {
  'use strict';

  /**
   * @name Window
   * @method
   * @memberof Frampton
   * @param {Object} [element] DomNode to act as applicaton window
   * @returns {Object}
   */
  module.exports = Window;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _stepper = _interopRequire(_framptonSignalStepper);

  var _onEvent = _interopRequire(_framptonEventsOn_event);

  var _get = _interopRequire(_framptonUtilsGet);

  var _isSomething = _interopRequire(_framptonUtilsIs_something);

  var element = null;
  var resize = (0, _onEvent)('resize', window);
  var dimensions = (0, _stepper)([getWidth(), getHeight()], resize.map(update));
  var width = (0, _stepper)(getWidth(), dimensions.map((0, _get)(0)));
  var height = (0, _stepper)(getHeight(), dimensions.map((0, _get)(1)));

  function getWidth() {
    return (0, _isSomething)(element) ? element.clientWidth : window.innerWidth;
  }

  function getHeight() {
    return (0, _isSomething)(element) ? element.clientHeight : window.innerHeight;
  }

  function update() {
    var w = getWidth();
    var h = getHeight();
    return [w, h];
  }
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

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Frampton = _interopRequire(_framptonNamespace);

  module.exports = _Frampton;
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

  Frampton.VERSION = '0.1.4';

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

}());