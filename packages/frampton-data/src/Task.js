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

// chain(>>=) :: Task x a -> (a -> Task x b) -> Task x b
Task.prototype.chain = function(fn) {
  var run = this.run;
  return new Task(function(reject, resolve) {
    return run(function(err) {
      return reject(err);
    }, function(val) {
      return fn(val).run(reject, resolve);
    });
  });
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

var runTask = function(task, reject, resolve) {
  task.run(reject, resolve);
};

var fork = function(tasks, values, errors) {
  return tasks.next((task) => {
    runTask(task, values.push, errors.push);
  });
};

var when = function(...tasks) {
  tasks.forEach((task) => {
    task.run();
  });
};

var sequence = function(...tasks) {
  return tasks.reduce((acc, next) => {
    acc.chain(next);
  });
};

export default Task;

export {
  runTask,
  fork,
  sequence,
  when
};