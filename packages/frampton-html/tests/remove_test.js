import remove from 'frampton-html/remove';

QUnit.module('Frampton.Html.remove');

QUnit.test('removes element from its parent', function(assert) {
  assert.expect(2);
  const parent = document.createElement('div');
  const child = document.createElement('div');
  parent.appendChild(child);
  assert.equal(parent.childNodes.length, 1);
  remove(child);
  assert.equal(parent.childNodes.length, 0);
});
