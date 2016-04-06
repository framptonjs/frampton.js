import when from 'frampton-data/task/when';
import create from 'frampton-data/task/create';

QUnit.module('Frampton.Data.Task.when');

QUnit.test('Should create a task that runs a list of tasks in sequence', function(assert) {

  const done = assert.async();
  var counter = 0;
  const task = when(
    create(function(_, resolve) {
      equal(counter, 0);
      counter += 1;
      setTimeout(() => {
        resolve(1);
      }, 200);
    }),
    create(function(_, resolve) {
      equal(counter, 1);
      counter += 1;
      setTimeout(() => {
        resolve(2);
      }, 50);
    }),
    create(function(_, resolve) {
      equal(counter, 2);
      counter += 1;
      setTimeout(() => {
        resolve(3);
      }, 100);
    })
  );

  task.run((err) => {
    ok(false, 'when failed');
    done();
  }, (val) => {
    equal(counter, 3, 'count wrong');
    deepEqual(val, [1,2,3], 'value wrong');
    done();
  });
});