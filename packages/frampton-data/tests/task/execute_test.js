import createSignal from 'frampton-signal/create';
import execute from 'frampton-data/task/execute';
import succeed from 'frampton-data/task/succeed';

QUnit.module('Frampton.Data.Task.execute');

QUnit.test('runs tasks on stream and push results to given function', function(assert) {

  const done = assert.async();
  const tasks = createSignal();
  const toRun = succeed(5);
  const responses = createSignal();
  const expected = 5;

  responses.next((val) => {
    assert.equal(val, expected);
    done();
  });

  execute(tasks, responses.push);

  tasks.push(toRun);
});
