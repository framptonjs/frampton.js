import elementValue from 'frampton-html/element_value';

QUnit.module('Frampton.Html.elementValue');

QUnit.test('returns value property of given object', function(assert) {
  const mockObject = { value : 'test' };
  const actual = elementValue(mockObject);
  const expected = 'test';
  assert.equal(actual, expected);
});
