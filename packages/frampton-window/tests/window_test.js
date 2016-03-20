import _window from 'frampton-window/window';

QUnit.module('Frampton.Window');

QUnit.test('Window.dimensions should be a tuple of width and height', function() {
  const win = _window();
  equal(win.dimensions()[0], win.width());
  equal(win.dimensions()[1], win.height());
});