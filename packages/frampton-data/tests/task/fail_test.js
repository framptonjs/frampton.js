import fail from 'frampton-data/task/fail';

QUnit.module('Frampton.Data.Task.fail');

QUnit.test('Should create a task that always fails', function(assert) {

  const done = assert.async();
  const task = fail('test error');

  task.run({
    reject : (err) => {
      assert.equal(err, 'test error');
      done();
    },
    resolve : (val) => {
      assert.ok(false, 'should always fail');
      done();
    }
  });
});