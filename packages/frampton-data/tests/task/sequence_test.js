import sequence from 'frampton-data/task/sequence';
import create from 'frampton-data/task/create';

QUnit.module('Frampton.Data.Task.sequence');

QUnit.test('Should create a task that runs a list of tasks in sequence', function(assert) {

  const done = assert.async();
  var counter = 0;
  const task = sequence(
    create(function(_, resolve) {
      equal(counter, 0);
      counter += 1;
      resolve(1);
    }),
    create(function(_, resolve) {
      equal(counter, 1);
      counter += 1;
      resolve(2);
    }),
    create(function(_, resolve) {
      equal(counter, 2);
      counter += 1;
      resolve(3);
    })
  );

  task.run((err) => {
    ok(false, 'sequence failed');
    done();
  }, (val) => {
    equal(counter, 3, 'count wrong');
    equal(val, 3, 'value wrong');
    done();
  });
});