import validator from 'frampton-data/union/object_validator';

QUnit.module('Frampton.Data.Union.objectValidator');

QUnit.test('Should return correctly validate arrays', function() {
  const arrayValidator = validator(Array);

  // Should correctly pass validation
  ok(arrayValidator([1,2,3]));

  // Should correctly fail validation
  notOk(arrayValidator(true));
});

QUnit.test('Should return correctly validate dates', function() {
  const dateValidator = validator(Date);

  // Should correctly pass validation
  ok(dateValidator((new Date())));

  // Should correctly fail validation
  notOk(dateValidator({}));
});

QUnit.test('Should return correctly validate objects', function() {
  const objValidator = validator(Object);

  // Should correctly pass validation
  ok(objValidator({ test : 'this' }));

  // Should correctly fail validation
  notOk(objValidator(true));
});