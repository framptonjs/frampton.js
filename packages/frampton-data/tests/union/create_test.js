import { validator } from 'frampton-data/union/create';

QUnit.module('Frampton.Data.Union.create');

QUnit.test('validator should return a validator for the given type', function() {
  const numValidator = validator(null, Number);
  const stringValidator = validator(null, String);
  const booleanValidator = validator(null, Boolean);
  const arrayValidator = validator(null, Array);

  // Should correctly pass validation
  ok(numValidator(5));
  ok(stringValidator('hello'));
  ok(booleanValidator(true));
  ok(arrayValidator([1,2,3]));

  // Should correctly fail validation
  notOk(numValidator('hello'));
  notOk(stringValidator(9));
  notOk(booleanValidator([1,2,3]));
  notOk(arrayValidator(true));
});

QUnit.test('validator should return a validator to handle objects', function() {
  const dateValidator = validator(null, Date);
  const objectValidator = validator(null, Object);
  const date = new Date();

  // Should correctly pass validation
  ok(dateValidator(date));

  // Should correctly fail validation
  notOk(objectValidator(date));
});