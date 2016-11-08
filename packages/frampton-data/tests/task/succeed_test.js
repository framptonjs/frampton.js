import succeed from 'frampton-data/task/succeed';

QUnit.module('Frampton.Data.Task.succeed');

QUnit.test('creates a task that always succeeds', function(assert) {

  const done = assert.async();
  const task = succeed('test value');

  task.run({
    reject : (err) => {
      assert.ok(false, 'reject called');
      done();
    },
    resolve : (val) => {
      assert.equal(val, 'test value');
      done();
    }
  });
});
