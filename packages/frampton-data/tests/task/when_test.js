import when from 'frampton-data/task/when';
import create from 'frampton-data/task/create';

QUnit.module('Frampton.Data.Task.when');

QUnit.test('Should create a task that runs a list of tasks in sequence', function(assert) {

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
    reject : (err) => {
      assert.ok(false, 'when failed');
      done();
    },
    resolve : (val) => {
      assert.equal(counter, 3, 'count wrong');
      assert.deepEqual(val, [1,2,3], 'value wrong');
      done();
    }
  });
});
