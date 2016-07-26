import selectorContains from 'frampton-style/selector_contains';

QUnit.module('Frampton.Style.selectorContains', {
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

QUnit.test('should return true if the element is contained inside an element with the given selector', function(assert) {
  this.div1.classList.add('blue');
  assert.ok(selectorContains('.blue', this.div2));
});

QUnit.test('should return true if the element matches the selector', function(assert) {
  this.div1.classList.add('blue');
  assert.ok(selectorContains('.blue', this.div1));
});

QUnit.test('should return false if the element is not contained inside an element with the given selector', function(assert) {
  this.div2.classList.add('blue');
  assert.notOk(selectorContains('.blue', this.div1));
});
