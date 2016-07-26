import _window from 'frampton-window/window';

QUnit.module('Frampton.Window');

QUnit.test('Window.dimensions should be a tuple of width and height', function(assert) {
  const win = _window();
  const expectedWidth = win.width.get();
  const expectedHeight = win.height.get();
  const [width, height] = win.dimensions.get();
  assert.equal(width, expectedWidth);
  assert.equal(height, expectedHeight);
});
