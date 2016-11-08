import matches from 'frampton-style/matches';

QUnit.module('Frampton.Style.matches', {
  beforeEach() {
    this.div = document.createElement('div');
    this.container = document.getElementById('qunit-fixture');
    this.container.appendChild(this.div);
  },
  afterEach() {
    this.container.removeChild(this.div);
    this.div = null;
    this.container = null;
  }
});

QUnit.test('detects if an element has a class', function(assert) {
  this.div.classList.add('blue');
  assert.ok(matches('.blue', this.div));
});

QUnit.test('detects if an element has an id', function(assert) {
  this.div.id = 'blue';
  assert.ok(matches('#blue', this.div));
});

QUnit.test('detects if an element has an attribute', function(assert) {
  this.div.setAttribute('aria-live', 'polite');
  assert.ok(matches('[aria-live]', this.div));
});
