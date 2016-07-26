import hasClass from 'frampton-style/has_class';

QUnit.module('Frampton.Style.hasClass');

QUnit.test('should return true if element has class', function(assert) {
  var div = document.createElement('div');
  div.classList.add('blue');
  assert.ok(hasClass('blue', div), 'correctly detects class');
});

QUnit.test('should return false if element has class', function(assert) {
  var div = document.createElement('div');
  div.classList.add('blue');
  assert.notOk(hasClass('wrong', div), 'correctly detects class');
});
