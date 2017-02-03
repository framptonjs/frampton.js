import createTask from 'frampton-data/task/create';
import noop from 'frampton-utils/noop';

QUnit.module('Frampton.Data.Task');

QUnit.test('Task.run method runs asyncronously', function(assert) {
  assert.expect(2);
  var test = 0;
  const done = assert.async();
  const task = createTask((sinks) => {
    test = 5;
    sinks.resolve(null);
  });

  task.run({
    reject : noop,
    resolve : (val) => {
      assert.equal(test, 5);
      done();
    },
    progress : noop
  });

  // Test should still be 0.
  assert.equal(test, 0);
});

QUnit.test('Task.join method flattens nested Tasks', function(assert) {
  assert.expect(1);
  const done = assert.async();
  const task = createTask((sinks) => {
    sinks.resolve(createTask((sinks) => {
      sinks.resolve(5);
    }));
  });

  task.join().run({
    reject : noop,
    resolve : (val) => {
      assert.equal(val, 5, 'correctly flattened Task');
      done();
    },
    progress : noop
  });
});

QUnit.test('Task.join method flattens many nested Tasks', function(assert) {
  assert.expect(1);
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
      assert.equal(val, 5, 'correctly flattened Task');
      done();
    },
    progress : noop
  });
});

QUnit.test('Task.chain method propertly maps and flattens', function(assert) {
  assert.expect(3);
  const done = assert.async();
  const task = createTask((sinks) => {
    sinks.resolve(5);
  });

  const mapping1 = (val) => {
    assert.equal(val, 5, 'incorrect first result');
    return createTask((sinks) => {
      sinks.resolve(val + 1);
    });
  };

  const mapping2 = (val) => {
    assert.equal(val, 6, 'incorrect second result');
    return createTask((sinks) => {
      sinks.resolve(val + 2);
    });
  };

  task.chain(mapping1).chain(mapping2).run({
    reject : noop,
    resolve : (val) => {
      assert.equal(val, 8, 'incorrect final result');
      done();
    },
    progress : noop
  });
});

QUnit.test('Task.map method propertly maps value of task to another value', function(assert) {
  assert.expect(1);
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
      assert.equal(val, 'butcher');
      done();
    },
    progress : noop
  });
});

QUnit.test('Task.filter method turns a resolve into a reject if prediate fails', function(assert) {
  assert.expect(1);
  const done = assert.async();
  const task = createTask((sinks) => {
    sinks.resolve(5);
  });

  const predicate = (val) => {
    return (val > 6);
  };

  task.filter(predicate).run({
    reject : (val) => {
      assert.equal(val, 5);
      done();
    },
    resolve : (val) => {
      assert.ok(false, 'incorrectly resolved');
      done();
    },
    progress : noop
  });
});

QUnit.test('Task.filter method does nothing if prediate succeeds', function(assert) {
  assert.expect(1);
  const done = assert.async();
  const task = createTask((sinks) => {
    sinks.resolve(5);
  });

  const predicate = (val) => {
    return (val < 6);
  };

  task.filter(predicate).run({
    reject : (val) => {
      assert.ok(false, 'incorrectly rejected');
      done();
    },
    resolve : (val) => {
      assert.equal(val, 5);
      done();
    },
    progress : noop
  });
});

QUnit.test('Task.recover method propertly maps reject value to resolved value', function(assert) {
  assert.expect(1);
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
      assert.equal(val, 'butcher');
      done();
    },
    progress : noop
  });
});

QUnit.test('Task.progress method propertly maps progress values', function(assert) {
  assert.expect(3);
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
      assert.ok(false, 'reject called');
      done();
    },
    resolve : (val) => {
      if (count === 0) {
        assert.equal(val, 2, 'incorrect first result');
      } else if (count === 1) {
        assert.equal(val, 3, 'incorrect second result');
      } else if (count === 2) {
        assert.equal(val, 10, 'incorrect final result');
        done();
      } else {
        assert.ok(false, 'match fall through');
        done();
      }
    },
    progress : (val) => {
      assert.ok(false, 'progress mapping failed');
      done();
    }
  });
});
