import attribute from 'frampton-html/attribute';

QUnit.module('Frampton.Html.attribute');

QUnit.test('Should get the value of attribute of element', function() {
  var div = document.createElement('div');
  div.setAttribute('title', 'test');
  equal(attribute('title', div), 'test');
});