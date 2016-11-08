import contains from 'frampton-style/contains';

QUnit.module('Frampton.Style.contains', {
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

QUnit.test('returns true if element contains element with selector', function(assert) {
  this.div2.classList.add('blue');
  assert.ok(contains('.blue', this.div1));
});

QUnit.test('returns false if element does not contain element with selector', function(assert) {
  this.div2.classList.add('blue');
  assert.notOk(contains('#blue', this.div1));
});
