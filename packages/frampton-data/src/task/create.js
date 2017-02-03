import immediate from 'frampton-utils/immediate';
import isFunction from 'frampton-utils/is_function';
import noop from 'frampton-utils/noop';
import ofValue from 'frampton-utils/of_value';
import isEqual from 'frampton-utils/is_equal';
import validSinks from 'frampton-data/task/valid_sinks';


export class Task {

  constructor(computation) {
    this.fn = computation;
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
  run(sinks) {
    immediate(() => {
      try {
        this.fn(validSinks(sinks));
      } catch(e) {
        sinks.reject(e);
      }
    });
  }

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
  of(val) {
    return new Task((sinks) => {
      sinks.resolve(val);
    });
  }

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
  join() {
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
  }

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
  concat(task) {
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
  }

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
  chain(mapping) {
    return this.map(mapping).join();
  }

  /**
   * ap(<*>) :: Task x (a -> b) -> Task x a -> Task x b
   *
   * @name ap
   * @method
   * @memberof Frampton.Data.Task#
   * @param {Frampton.Data.Task} task
   * @returns {Frampton.Data.Task}
   */
  ap(task) {
    return this.chain((fn) => {
      return task.map(fn);
    });
  }

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
  recover(mapping) {
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
  }

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
  default(val) {
    return this.recover(() => val);
  }

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
  progress(mapping) {
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
  }

  /**
   * map :: Task x a -> (a -> b) -> Task x b
   *
   * @name map
   * @method
   * @memberof Frampton.Data.Task#
   * @param {Function} mapping
   * @returns {Frampton.Data.Task}
   */
  map(mapping) {
    const source = this;
    const mappingFn = isFunction(mapping) ? mapping : ofValue(mapping);
    return new Task((sinks) => {
      source.run({
        reject: sinks.reject,
        resolve: (val) => {
          sinks.resolve(mappingFn(val));
        },
        progress: sinks.progress
      });
    });
  }

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
  success(mapping) {
    return this.map(mapping);
  }

  /**
   * filter :: Task x a -> (a -> b) -> Task x b
   *
   * @name filter
   * @method
   * @memberof Frampton.Data.Task#
   * @param {Function} predicate - The function to filter the resolve value.
   * @returns {Frampton.Data.Task}
   */
  filter(predicate) {
    const source = this;
    const filterFn = isFunction(predicate) ? predicate : isEqual(predicate);
    return new Task((sinks) => {
      source.run({
        reject : sinks.reject,
        resolve : (val) => {
          if (filterFn(val)) {
            sinks.resolve(val);
          } else {
            sinks.reject(val);
          }
        },
        progress : sinks.progress
      });
    });
  }

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
  validate(predicate) {
    return this.filter(predicate);
  }
}


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
export default function create_task(computation) {
  return new Task(computation);
}
