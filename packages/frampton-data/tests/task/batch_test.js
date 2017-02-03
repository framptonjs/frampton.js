import batch from 'frampton-data/task/batch';
import create from 'frampton-data/task/create';

QUnit.module('Frampton.Data.Task.batch');

QUnit.test('creates a task that runs a list of tasks in sequence', function(assert) {
  assert.expect(3);
  const done = assert.async();
  var counter = 0;
  const task = batch(
    create((sinks) => {
      setTimeout(() => {
        sinks.resolve(1);
      }, 200);
    }),
    create((sinks) => {
      setTimeout(() => {
        sinks.resolve(2);
      }, 50);
    }),
    create((sinks) => {
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
      counter += 1;
      switch (counter) {
        case 1:
          assert.equal(2, val);
          break;
        case 2:
          assert.equal(3, val);
          break;
        case 3:
          assert.equal(1, val);
          done();
          break;
        default:
          assert.ok(false, 'default called');
          done();
      }
    }
  });
});

QUnit.test('creates a task that maps all child tasks', function(assert) {
  assert.expect(3);
  const done = assert.async();
  var counter = 0;
  const task = batch(
    create((sinks) => {
      setTimeout(() => {
        sinks.resolve(1);
      }, 200);
    }),
    create((sinks) => {
      setTimeout(() => {
        sinks.resolve(2);
      }, 50);
    }),
    create((sinks) => {
      setTimeout(() => {
        sinks.resolve(3);
      }, 100);
    })
  );

  task
    .map((next) => next + 2)
    .run({
      reject(err) {
        assert.ok(false, 'reject called');
        done();
      },
      resolve(val) {
        counter += 1;
        switch (counter) {
          case 1:
            assert.equal(4, val);
            break;
          case 2:
            assert.equal(5, val);
            break;
          case 3:
            assert.equal(3, val);
            done();
            break;
          default:
            assert.ok(false, 'default called');
            done();
        }
      }
    });
});
