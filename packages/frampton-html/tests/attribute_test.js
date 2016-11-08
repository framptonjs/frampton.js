import attribute from 'frampton-html/attribute';

QUnit.module('Frampton.Html.attribute');

QUnit.test('gets the value of attribute of element', function(assert) {
  var div = document.createElement('div');
  div.setAttribute('title', 'test');
  assert.equal(attribute('title', div), 'test');
});
