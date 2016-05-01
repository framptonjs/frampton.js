import data from 'frampton-html/data';

QUnit.module('Frampton.Html.data');

QUnit.test('Should get the value of data attribute of element', function() {
  var div = document.createElement('div');
  div.setAttribute('data-id', 2);
  equal(data('id', div), 2);
});