import data from 'frampton-html/data';

QUnit.module('Frampton.Html.data');

QUnit.test('Should get the value of data attribute of element', function(assert) {
  var div = document.createElement('div');
  div.setAttribute('data-id', 2);
  assert.equal(data('id', div), 2);
});
