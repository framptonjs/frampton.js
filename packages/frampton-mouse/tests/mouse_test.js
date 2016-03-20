import Mouse from 'frampton-mouse/mouse';

// function simulateMouseEvent(target, options) {

//   const evt = new MouseEvent(options.type, {
//     view: window,
//     bubbles: true,
//     cancelable: true,
//     clientX: 20,
//     /* whatever properties you want to give it */
//   });

//   target.dispatchEvent(evt);
// }

QUnit.module('Frampton.Mouse');

QUnit.test('Mouse.position should have starting value of [0,0]', function() {
  const mouse = Mouse();
  deepEqual(mouse.position(), [0,0]);
});

QUnit.test('Mouse.isDown should have starting value of false', function() {
  const mouse = Mouse();
  equal(mouse.isDown(), false);
});