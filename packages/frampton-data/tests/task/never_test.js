import never from 'frampton-data/task/never';

QUnit.module('Frampton.Data.Task.never');

QUnit.test('Should create a task that never resolves', function(assert) {

  const done = assert.async();
  const task = never();

  task.run({
    reject : (err) => {
      assert.ok(false);
      done();
    },
    resolve : (val) => {
      assert.ok(false);
      done();
    },
    progress : (val) => {
      assert.ok(false);
      done();
    }
  });

  setTimeout(() => {
    assert.ok(true);
    done();
  }, 1000);
});