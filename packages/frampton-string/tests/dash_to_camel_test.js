import dashToCamel from 'frampton-string/dash_to_camel';

QUnit.module('Frampton.String.dashToCamel');

QUnit.test('changes dash case to camel case', function(assert) {
  assert.equal(dashToCamel('test-test-camel'), 'testTestCamel');
});
