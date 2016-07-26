import addClass from 'frampton-style/add_class';

QUnit.module('Frampton.Style.addClass');

QUnit.test('should return true if element has class', function(assert) {
  var div = document.createElement('div');
  addClass(div, 'test');
  assert.ok(div.classList.contains('test'));
});
