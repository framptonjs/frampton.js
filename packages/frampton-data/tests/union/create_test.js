import { validator } from 'frampton-data/union/create';

QUnit.module('Frampton.Data.Union.create');

QUnit.test('validator should return correctly validate arrays', function() {
  const arrayValidator = validator(null, Array);

  // Should correctly pass validation
  ok(arrayValidator([1,2,3]));

  // Should correctly fail validation
  notOk(arrayValidator(true));
});

QUnit.test('validator should return correctly validate strings', function() {
  const stringValidator = validator(null, String);

  // Should correctly pass validation
  ok(stringValidator('hello'));

  // Should correctly fail validation
  notOk(stringValidator(9));
});

QUnit.test('validator should return correctly validate dom nodes', function() {
  const nodeValidator = validator(null, Node);

  // Should correctly pass validation
  ok(nodeValidator(document.createElement('div')));

  // Should correctly fail validation
  notOk(nodeValidator('hello'));
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