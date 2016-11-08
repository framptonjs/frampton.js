import delay from 'frampton-data/task/delay';

QUnit.module('Frampton.Data.Task.delay');

QUnit.test('creates a signal of a delayed value', function(assert) {
  assert.expect(1);
  const done = assert.async();
  const task = delay('test value', 1000);

  task.run({
    reject: (err) => {
      assert.ok(false);
      done();
    },
    resolve: (val) => {
      assert.equal(val, 'test value');
      done();
    }
  });
});
