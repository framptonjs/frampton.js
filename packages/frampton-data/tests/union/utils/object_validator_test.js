import validator from 'frampton-data/union/utils/object_validator';

QUnit.module('Frampton.Data.Union.Utils.objectValidator');

QUnit.test('Should return correctly validate arrays', function(assert) {
  const arrayValidator = validator(Array);

  // Should correctly pass validation
  assert.ok(arrayValidator([1,2,3]));

  // Should correctly fail validation
  assert.notOk(arrayValidator(true));
});

QUnit.test('Should return correctly validate dates', function(assert) {
  const dateValidator = validator(Date);

  // Should correctly pass validation
  assert.ok(dateValidator((new Date())));

  // Should correctly fail validation
  assert.notOk(dateValidator({}));
});

QUnit.test('Should return correctly validate objects', function(assert) {
  const objValidator = validator(Object);

  // Should correctly pass validation
  assert.ok(objValidator({ test : 'this' }));

  // Should correctly fail validation
  assert.notOk(objValidator(true));
});
