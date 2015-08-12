import eventContainsSelector from 'frampton-events/event_contains_selector';

QUnit.module('Frampton.Events.eventContainsSelector', {
  beforeEach() {
    this.div1 = document.createElement('div');
    this.div2 = document.createElement('div');
    this.container = document.getElementById('qunit-fixture');
    this.container.appendChild(this.div1);
    this.div1.appendChild(this.div2);
  },
  afterEach() {
    this.container.removeChild(this.div1);
    this.div1 = null;
    this.div2 = null;
    this.container = null;
  }
});

QUnit.test('should return true if event target has given selector', function() {
  this.div1.classList.add('blue');
  ok(eventContainsSelector('.blue', { target: this.div1 }));
});

QUnit.test('should return true if event target contains given selector', function() {
  this.div2.classList.add('blue');
  ok(eventContainsSelector('.blue', { target: this.div1 }));
});

QUnit.test('should return false if event target does not contain given selector', function() {
  this.div2.classList.add('blue');
  notOk(eventContainsSelector('#blue', { target: this.div1 }));
});