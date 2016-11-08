import contains from 'frampton-events/contains';

QUnit.module('Frampton.Events.contains', {
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

QUnit.test('returns true if an element contains an event', function(assert) {
  assert.ok(contains(this.div1, { target: this.div2 }), 'correctly detects element');
});
