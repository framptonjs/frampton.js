import immediate from 'frampton-utils/immediate';
import isFunction from 'frampton-utils/is_function';
import noop from 'frampton-utils/noop';
import ofValue from 'frampton-utils/of_value';

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

Task.of = function(val) {
  return new Task((sinks) => {
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
Task.prototype.of = function(val) {
  return new Task((sinks) => {
    sinks.resolve(val);
  });
};

// Wraps the computation of the task to ensure all tasks are async.
Task.prototype.run = function(sinks) {
  immediate(() => {
    try {
      this.fn(sinks);
    } catch(e) {
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
Task.prototype.join = function() {
  const source = this;
  return new Task((sinks) => {
    source.run({
      reject : sinks.reject,
      resolve : (val) => {
        val.run(sinks);
      },
      progress : noop
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
Task.prototype.concat = function(task) {
  const source = this;
  return new Task((sinks) => {
    source.run({
      reject : sinks.reject,
      resolve : (val) => {
        task.run(sinks);
      },
      progress : noop
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
Task.prototype.chain = function(mapping) {
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
Task.prototype.ap = function(task) {
  return this.chain((fn) => {
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
Task.prototype.recover = function(mapping) {
  const source = this;
  return new Task((sinks) => {
    source.run({
      reject : (err) => {
        sinks.resolve(mapping(err));
      },
      resolve : sinks.resolve,
      progress : sinks.progress
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
Task.prototype.default = function(val) {
  return this.recover(() => val);
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
Task.prototype.progress = function(mapping) {
  const source = this;
  const mappingFn = isFunction(mapping) ? mapping : ofValue(mapping);
  return new Task((sinks) => {
    source.run({
      reject : sinks.reject,
      resolve : sinks.resolve,
      progress : (val) => {
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
Task.prototype.map = function(mapping) {
  const source = this;
  const mappingFn = isFunction(mapping) ? mapping : ofValue(mapping);
  return new Task((sinks) => {
    source.run({
      reject : sinks.reject,
      resolve : (val) => {
        sinks.resolve(mappingFn(val));
      },
      progress : sinks.progress
    });
  });
};

export default function create_task(computation) {
  return new Task(computation);
}
