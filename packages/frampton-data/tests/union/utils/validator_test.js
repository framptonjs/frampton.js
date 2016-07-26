import validator from 'frampton-data/union/utils/validator';
import create from 'frampton-data/union/create';

QUnit.module('Frampton.Data.Union.Utils.validator');

QUnit.test('Should return correctly validate arrays', function(assert) {
  const arrayValidator = validator(null, Array);

  // Should correctly pass validation
  assert.ok(arrayValidator([1,2,3]));

  // Should correctly fail validation
  assert.notOk(arrayValidator(true));
});

QUnit.test('Should return correctly validate strings', function(assert) {
  const stringValidator = validator(null, String);

  // Should correctly pass validation
  assert.ok(stringValidator('hello'));

  // Should correctly fail validation
  assert.notOk(stringValidator(9));
});

QUnit.test('Should return correctly validate dom nodes', function(assert) {
  const nodeValidator = validator(null, Node);

  // Should correctly pass validation
  assert.ok(nodeValidator(document.createElement('div')));

  // Should correctly fail validation
  assert.notOk(nodeValidator('hello'));
});

QUnit.test('Should return a validator to handle objects', function(assert) {
  const dateValidator = validator(null, Date);
  const objectValidator = validator(null, Object);
  const date = new Date();

  // Should correctly pass validation
  assert.ok(dateValidator(date));

  // Should correctly fail validation
  assert.notOk(objectValidator(date));
});

QUnit.test('Should return a validator to handle other Unions', function(assert) {
  const Action = create({ ActiveID : [Number] });
  const unionValidator = validator(null, Action);

  // Should correctly pass validation
  assert.ok(unionValidator(Action.ActiveID(3)));
});
