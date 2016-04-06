import immediate from 'frampton-utils/immediate';

/**
 * Lazy, possibly async, error-throwing tasks
 * Stream of tasks, executed and return a new signal
 *
 * @name Task
 * @memberof Frampton.Task
 * @class
 * @param {function} task The computation we need to run
 */
function Task(task) {
  this.fn = task;
}

// of(return) :: a -> Success a
Task.prototype.of = function(val) {
  return new Task((_, resolve) => {
    return resolve(val);
  });
};

// Wraps the computation of the task to ensure all tasks are async.
Task.prototype.run = function(reject, resolve) {
  immediate(() => {
    try {
      this.fn(reject, resolve);
    } catch(e) {
      reject(e);
    }
  });
};

// join :: Task x (Task x a) -> Task x a
Task.prototype.join = function() {
  var fn = this.fn;
  return new Task(function(reject, resolve) {
    return fn(function(err) {
      return reject(err);
    }, function(val) {
      return val.run(reject, resolve);
    });
  });
};

// concat(>>) :: Task x a -> Task x b -> Task x b
Task.prototype.concat = function(task) {
  var fn = this.fn;
  return new Task(function(reject, resolve) {
    return fn(function(err) {
      return reject(err);
    }, function(val) {
      return task.run(reject, resolve);
    });
  });
};

// chain(>>=) :: Task x a -> (a -> Task x b) -> Task x b
Task.prototype.chain = function(mapping) {
  return this.map(mapping).join();
};

// ap(<*>) :: Task x (a -> b) -> Task x a -> Task x b
Task.prototype.ap = function(task) {
  return this.chain(function(fn) {
    return task.map(fn);
  });
};

// recover :: Task x a -> (a -> Task x b) -> Task x b
Task.prototype.recover = function(mapping) {
  var fn = this.fn;
  return new Task(function(reject, resolve) {
    return fn(function(err) {
      return mapping(err).run(reject, resolve);
    }, function(val) {
      return resolve(val);
    });
  });
};

// map :: Task x a -> (a -> b) -> Task x b
Task.prototype.map = function(mapping) {
  var fn = this.fn;
  return new Task(function(reject, resolve) {
    return fn(function(err) {
      return reject(err);
    }, function(val) {
      return resolve(mapping(val));
    });
  });
};

export default function create_task(computation) {
  return new Task(computation);
}
