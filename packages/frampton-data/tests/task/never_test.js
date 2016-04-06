import never from 'frampton-data/task/never';

QUnit.module('Frampton.Data.Task.never');

QUnit.test('Should create a task that never resolves', function(assert) {

  const done = assert.async();
  const task = never();

  task.run((err) => {
    ok(false);
    done();
  }, (val) => {
    ok(false);
    done();
  });

  setTimeout(() => {
    ok(true);
    done();
  }, 1000);
});