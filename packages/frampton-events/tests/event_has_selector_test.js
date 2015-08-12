import eventHasSelector from 'frampton-events/event_has_selector';

QUnit.module('Frampton.Events.eventHasSelector', {
  beforeEach() {
    this.div1 = document.createElement('div');
    this.container = document.getElementById('qunit-fixture');
    this.container.appendChild(this.div1);
  },
  afterEach() {
    this.container.removeChild(this.div1);
    this.div1 = null;
    this.container = null;
  }
});

QUnit.test('should return true if event target has given selector', function() {
  this.div1.classList.add('blue');
  ok(eventHasSelector('.blue', { target: this.div1 }));
});