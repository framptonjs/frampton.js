import Union from 'frampton-data/union/create';

QUnit.module('Frampton.Data.Union.create');

QUnit.test('Should create an object with specified keys', function(assert) {
  const Person = Union({
    Employee : [],
    Manager : []
  });
  assert.ok(typeof Person.Employee === 'function');
  assert.ok(typeof Person.Manager === 'function');
});

QUnit.test('Should create an object with a match method', function(assert) {
  const Person = Union({
    Employee : [],
    Manager : []
  });
  assert.ok(typeof Person.match === 'function');
});

QUnit.test('Match method should correctly match instances', function(assert) {
  const Person = Union({
    Employee : [],
    Manager : []
  });

  const test = Person.Employee();
  const match = Person.match({
    Employee : () => {
      assert.ok(true);
    },
    Manager : () => {
      assert.ok(false);
    }
  });

  match(test);
});

QUnit.test('Should have a match method that validates types', function(assert) {
  const Person = Union({
    Employee : [String],
    Manager : [String]
  });

  assert.ok(typeof Person.Employee('Fred') === 'object', 'Did not return object');
  assert.throws(() => { Person.Employee(29); }, 'Did not throw');
});
