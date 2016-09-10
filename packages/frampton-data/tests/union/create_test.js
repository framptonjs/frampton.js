import Union from 'frampton-data/union/create';

QUnit.module('Frampton.Data.Union.create');

QUnit.test('Should create an object with specified keys', function(assert) {

  assert.expect(2);

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

QUnit.test('Should have a toString method', function(assert) {
  const Person = Union({
    Employee : ['name', 'age'],
    Manager : ['name', 'age']
  });

  const bob = Person.Employee('Bob', 45);
  const actual = bob.toString();
  const expected = 'Union.Employee(Bob,45)';

  assert.equal(actual, expected);
});

QUnit.test('Should create types with accessor properties', function(assert) {

  assert.expect(2);

  const Person = Union({
    Employee : ['name', 'age'],
    Manager : ['name', 'age']
  });

  const bob = Person.Employee('Bob', 45);
  const larry = Person.Manager('Larry', 53);

  assert.equal(bob.name, 'Bob');
  assert.equal(larry.age, 53);
});

QUnit.test('Should properly destructure arguments to match', function(assert) {

  assert.expect(4);

  const Person = Union({
    Employee : ['name', 'age'],
    Manager : ['name', 'age']
  });

  const match = Person.match({
    Employee : (name, age) => {
      assert.equal(name, 'Bob');
      assert.equal(age, 45);
    },
    Manager : (name, age) => {
      assert.equal(name, 'Larry');
      assert.equal(age, 53);
    }
  });

  const bob = Person.Employee('Bob', 45);
  const larry = Person.Manager('Larry', 53);

  match(bob);
  match(larry);
});
