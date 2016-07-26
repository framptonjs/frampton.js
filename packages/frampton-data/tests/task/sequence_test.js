import sequence from 'frampton-data/task/sequence';
import create from 'frampton-data/task/create';

QUnit.module('Frampton.Data.Task.sequence');

QUnit.test('Should create a task that runs a list of tasks in sequence', function(assert) {

  const done = assert.async();
  var counter = 0;
  const task = sequence(
    create((sinks) => {
      assert.equal(counter, 0);
      counter += 1;
      sinks.resolve(1);
    }),
    create((sinks) => {
      assert.equal(counter, 1);
      counter += 1;
      sinks.resolve(2);
    }),
    create((sinks) => {
      assert.equal(counter, 2);
      counter += 1;
      sinks.resolve(3);
    })
  );

  task.run({
    reject : (err) => {
      assert.ok(false, 'sequence failed');
      done();
    },
    resolve : (val) => {
      assert.equal(counter, 3, 'count wrong');
      assert.equal(val, 3, 'value wrong');
      done();
    }
  });
});