import elementValue from 'frampton-html/element_value';

QUnit.module('Frampton.Html.elementValue');

QUnit.test('should return value property of given object', function() {
  equal(elementValue({ value: 'test' }), 'test');
});