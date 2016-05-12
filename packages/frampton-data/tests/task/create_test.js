import createTask from 'frampton-data/task/create';
import noop from 'frampton-utils/noop';

QUnit.module('Frampton.Data.Task');

QUnit.test('Task.join method should flatten nested Tasks', function(assert) {

  const done = assert.async();
  const task = createTask((sinks) => {
    sinks.resolve(createTask((sinks) => {
      sinks.resolve(5);
    }));
  });

  task.join().run({
    reject : noop,
    resolve : (val) => {
      equal(val, 5, 'correctly flattened Task');
      done();
    },
    progress : noop
  });
});

QUnit.test('Task.join method should flatten many nested Tasks', function(assert) {

  const done = assert.async();
  const task = createTask((sinks) => {
    sinks.resolve(createTask((sinks) => {
      sinks.resolve(createTask((sinks) => {
        sinks.resolve(5);
      }));
    }));
  });

  task.join().join().run({
    reject : noop,
    resolve : (val) => {
      equal(val, 5, 'correctly flattened Task');
      done();
    },
    progress : noop
  });
});

QUnit.test('Task.chain method should propertly map and flatten', function(assert) {

  const done = assert.async();
  const task = createTask((sinks) => {
    sinks.resolve(5);
  });

  const mapping1 = (val) => {
    equal(val, 5, 'incorrect first result');
    return createTask((sinks) => {
      sinks.resolve(val + 1);
    });
  };

  const mapping2 = (val) => {
    equal(val, 6, 'incorrect second result');
    return createTask((sinks) => {
      sinks.resolve(val + 2);
    });
  };

  task.chain(mapping1).chain(mapping2).run({
    reject : noop,
    resolve : (val) => {
      equal(val, 8, 'incorrect final result');
      done();
    },
    progress : noop
  });
});

QUnit.test('Task.map method should propertly map value of task to another value', function(assert) {

  const done = assert.async();
  const task = createTask((sinks) => {
    sinks.resolve(5);
  });

  const mapping = (val) => {
    return 'butcher';
  };

  task.map(mapping).run({
    reject : noop,
    resolve : (val) => {
      equal(val, 'butcher');
      done();
    },
    progress : noop
  });
});

QUnit.test('Task.filter method should turn a resolve into a reject if prediate fails', function(assert) {

  const done = assert.async();
  const task = createTask((sinks) => {
    sinks.resolve(5);
  });

  const predicate = (val) => {
    return (val > 6);
  };

  task.filter(predicate).run({
    reject : (val) => {
      equal(val, 5);
      done();
    },
    resolve : (val) => {
      ok(false, 'incorrectly resolved');
      done();
    },
    progress : noop
  });
});

QUnit.test('Task.filter method should do nothing if prediate succeeds', function(assert) {

  const done = assert.async();
  const task = createTask((sinks) => {
    sinks.resolve(5);
  });

  const predicate = (val) => {
    return (val < 6);
  };

  task.filter(predicate).run({
    reject : (val) => {
      ok(false, 'incorrectly rejected');
      done();
    },
    resolve : (val) => {
      equal(val, 5);
      done();
    },
    progress : noop
  });
});

QUnit.test('Task.recover method should propertly map reject value to resolved value', function(assert) {

  const done = assert.async();
  const task = createTask((sinks) => {
    sinks.reject(5);
  });

  const mapping = (val) => {
    return 'butcher';
  };

  task.recover(mapping).run({
    reject : noop,
    resolve : (val) => {
      equal(val, 'butcher');
      done();
    },
    progress : noop
  });
});

QUnit.test('Task.progress method should propertly map progress values', function(assert) {

  var count = 0;
  const done = assert.async();
  const task = createTask((sinks) => {

    function updateProgress() {

      if (count < 2) {
        sinks.progress(count);
        setTimeout(updateProgress, 10);
      } else {
        sinks.resolve(10);
      }

      count += 1;
    }

    updateProgress();
  });

  const mapping = (val) => val + 2;

  task.progress(mapping).run({
    reject : (val) => {
      ok(false, 'reject called');
      done();
    },
    resolve : (val) => {
      if (count === 0) {
        equal(val, 2, 'incorrect first result');
      } else if (count === 1) {
        equal(val, 3, 'incorrect second result');
      } else if (count === 2) {
        equal(val, 10, 'incorrect final result');
        done();
      } else {
        ok(false, 'match fall through');
        done();
      }
    },
    progress : (val) => {
      ok(false, 'progress mapping failed');
      done();
    }
  });
});