import getValidator from 'frampton-data/union/utils/get_validator';
import Union from 'frampton-data/union/create';

QUnit.module('Frampton.Data.Union.Utils.getValidator');

QUnit.test('Should return correctly validate arrays', function(assert) {
  const arrayValidator = getValidator(null, Array);

  // Should correctly pass validation
  assert.ok(arrayValidator([1,2,3]));

  // Should correctly fail validation
  assert.notOk(arrayValidator(true));
});

QUnit.test('Should return correctly validate strings', function(assert) {
  const stringValidator = getValidator(null, String);

  // Should correctly pass validation
  assert.ok(stringValidator('hello'));

  // Should correctly fail validation
  assert.notOk(stringValidator(9));
});

QUnit.test('Should return correctly validate dom nodes', function(assert) {
  const nodeValidator = getValidator(null, Node);

  // Should correctly pass validation
  assert.ok(nodeValidator(document.createElement('div')));

  // Should correctly fail validation
  assert.notOk(nodeValidator('hello'));
});

QUnit.test('Should return a validator to handle objects', function(assert) {
  const dateValidator = getValidator(null, Date);
  const objectValidator = getValidator(null, Object);
  const date = new Date();
  const obj = {};

  assert.ok(dateValidator(date));
  assert.ok(objectValidator(obj));
});

QUnit.test('Should return a validator to handle other Unions', function(assert) {
  const Action = Union({ ActiveID : [Number] });
  const unionValidator = getValidator(null, Action);

  // Should correctly pass validation
  assert.ok(unionValidator(Action.ActiveID(3)));
});
