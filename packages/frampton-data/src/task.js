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
Task.prototype.of = function(val) {
  return new Task(function(_, resolve) {
    return resolve(val);
  });
};

// join :: Task x (Task x a) -> Task x a
Task.prototype.join = function() {
  var run = this.run;
  return new Task(function(reject, resolve) {
    return run(function(err) {
      return reject(err);
    }, function(val) {
      return val.run(reject, resolve);
    });
  });
};

// concat(>>) :: Task x a -> Task x b -> Task x b
Task.prototype.concat = function(task) {
  var run = this.run;
  return new Task(function(reject, resolve) {
    return run(function(err) {
      return reject(err);
    }, function(val) {
      return task.run(reject, resolve);
    });
  });
};

// chain(>>=) :: Task x a -> (a -> Task x b) -> Task x b
Task.prototype.chain = function(fn) {
  return this.map(fn).join();
};

// ap(<*>) :: Task x (a -> b) -> Task x a -> Task x b
Task.prototype.ap = function(task) {
  return this.chain(function(fn) {
    return task.map(fn);
  });
};

// recover :: Task x a -> (a -> Task x b) -> Task x b
Task.prototype.recover = function(fn) {
  var run = this.run;
  return new Task(function(reject, resolve) {
    return run(function(err) {
      return fn(err).run(reject, resolve);
    }, function(val) {
      return resolve(val);
    });
  });
};

// map :: Task x a -> (a -> b) -> Task x b
Task.prototype.map = function(fn) {
  var run = this.run;
  return new Task(function(reject, resolve) {
    return run(function(err) {
      return reject(err);
    }, function(val) {
      return resolve(fn(val));
    });
  });
};

export default Task;
