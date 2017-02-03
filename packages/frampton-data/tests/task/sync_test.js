import createTask from 'frampton-data/task/sync';
import noop from 'frampton-utils/noop';

QUnit.module('Frampton.Data.SyncTask');

QUnit.test('SyncTask.run method runs syncronously', function(assert) {
  assert.expect(1);
  var test = 0;
  const task = createTask((sinks) => {
    test = 5;
    sinks.resolve(null);
  });

  task.run({
    reject: noop,
    resolve: noop,
    progress: noop
  });

  assert.equal(test, 5);
});

QUnit.test('SyncTask.map method propertly maps value of task to another value', function(assert) {
  assert.expect(1);
  const done = assert.async();
  const task = createTask((sinks) => {
    sinks.resolve(5);
  });

  const mapping = (val) => {
    return 'butcher';
  };

  task.map(mapping).run({
    reject: noop,
    resolve: (val) => {
      assert.equal(val, 'butcher');
      done();
    },
    progress: noop
  });
});