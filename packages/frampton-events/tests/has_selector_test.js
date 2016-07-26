import hasSelector from 'frampton-events/has_selector';

QUnit.module('Frampton.Events.hasSelector', {
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

QUnit.test('should return true if event target has given selector', function(assert) {
  this.div1.classList.add('blue');
  assert.ok(hasSelector('.blue', { target: this.div1 }));
});
