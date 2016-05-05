import Union from 'frampton-data/union/create';

QUnit.module('Frampton.Data.Union.create');

QUnit.test('Should create an object with specified keys', function() {
  const Person = Union({
    Employee : [],
    Manager : []
  });
  ok(typeof Person.Employee === 'function');
  ok(typeof Person.Manager === 'function');
});

QUnit.test('Should have a match method to test instances', function() {
  const Person = Union({
    Employee : [],
    Manager : []
  });

  const test = Person.Employee();
  const match = Person.match({
    Employee : () => {
      ok(true);
    },
    Manager : () => {
      ok(false);
    }
  });

  match(test);
});

QUnit.test('Should have a match method that validates types', function() {
  const Person = Union({
    Employee : [String],
    Manager : [String]
  });

  ok(Person.Employee('Fred'));
  throws(function() {
    Person.Employee(29);
  });
});