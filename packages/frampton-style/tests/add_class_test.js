import addClass from 'frampton-style/add_class';

QUnit.module('Frampton.Style.addClass');

QUnit.test('should return true if element has class', function() {
  var div = document.createElement('div');
  addClass(div, 'test');
  ok(div.classList.contains('test'));
});