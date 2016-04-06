import createTask from 'frampton-data/task/create';
import noop from 'frampton-utils/noop';

QUnit.module('Frampton.Data.Task.create');

QUnit.test('Task.join method should flatten nested Tasks', function(assert) {

  const done = assert.async();
  const task = createTask((_, resolve) => {
    resolve(createTask((_, resolve) => {
      resolve(5);
    }));
  });

  task.join().run(noop, (val) => {
    equal(val, 5, 'correctly flattened Task');
    done();
  });
});

QUnit.test('Task.chain method should propertly map and flatten', function(assert) {

  const done = assert.async();
  const task = createTask((_, resolve) => {
    resolve(5);
  });

  const mapping = (val) => {
    return createTask((_, resolve) => {
      resolve(val + 1);
    });
  };

  task.chain(mapping).run(noop, (val) => {
    equal(val, 6, 'correctly composed Tasks');
    done();
  });
});

QUnit.test('Task.map method should propertly map value of task to another value', function(assert) {

  const done = assert.async();
  const task = createTask((_, resolve) => {
    resolve(5);
  });

  const mapping = (val) => {
    return 'butcher';
  };

  task.map(mapping).run(noop, (val) => {
    equal(val, 'butcher');
    done();
  });
});