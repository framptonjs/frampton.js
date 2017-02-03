import when from 'frampton-data/task/when';
import create from 'frampton-data/task/create';

QUnit.module('Frampton.Data.Task.when');

QUnit.test('creates a task that runs a list of tasks in sequence', function(assert) {
  assert.expect(5);
  const done = assert.async();
  var counter = 0;
  const task = when(
    create((sinks) => {
      assert.equal(counter, 0);
      counter += 1;
      setTimeout(() => {
        sinks.resolve(1);
      }, 200);
    }),
    create((sinks) => {
      assert.equal(counter, 1);
      counter += 1;
      setTimeout(() => {
        sinks.resolve(2);
      }, 50);
    }),
    create((sinks) => {
      assert.equal(counter, 2);
      counter += 1;
      setTimeout(() => {
        sinks.resolve(3);
      }, 100);
    })
  );

  task.run({
    reject(err) {
      assert.ok(false, 'reject called');
      done();
    },
    resolve(val) {
      assert.equal(counter, 3);
      assert.deepEqual(val, [1,2,3]);
      done();
    }
  });
});
