import Task from 'frampton-data/task';
import noop from 'frampton-utils/noop';

QUnit.module('Frampton.Data.Task');

QUnit.test('join method should flatten nested Tasks', function() {

  var task = new Task((_, resolve) => {
    resolve(new Task((_, resolve) => {
      resolve(5);
    }));
  });

  task.join().run(noop, (val) => {
    equal(val, 5, 'correctly flattened Task');
  });
});

QUnit.test('chain method should propertly map and flatten', function() {

  var task = new Task((_, resolve) => {
    resolve(5);
  });

  var mapping = function(val) {
    return new Task((_, resolve) => {
      resolve(val + 1);
    });
  };

  task.chain(mapping).run(noop, (val) => {
    equal(val, 6, 'correctly composed Tasks');
  });
});