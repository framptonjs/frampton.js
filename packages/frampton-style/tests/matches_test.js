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

QUnit.test('should detect if an element has a class', function() {
  this.div.classList.add('blue');
  ok(matches('.blue', this.div));
});

QUnit.test('should detect if an element has an id', function() {
  this.div.id = 'blue';
  ok(matches('#blue', this.div));
});

QUnit.test('should detect if an element has an attribute', function() {
  this.div.setAttribute('aria-live', 'polite');
  ok(matches('[aria-live]', this.div));
});