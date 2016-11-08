import closestToEvent from 'frampton-events/closest_to_event';

QUnit.module('Frampton.Events.closestToEvent', {
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

QUnit.test('returns closest element matching selector', function(assert) {
  this.div1.classList.add('blue');
  const actual = closestToEvent('.blue', { target: this.div2 });
  const expected = this.div1;
  assert.equal(actual, expected, 'correctly gets element');
});
