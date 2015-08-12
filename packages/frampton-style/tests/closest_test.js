import closest from 'frampton-style/closest';

QUnit.module('Frampton.Style.closest', {
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

QUnit.test('should return closest element matching selector', function() {
  this.div1.classList.add('blue');
  equal(closest('.blue', this.div2), this.div1, 'correctly gets element');
});

QUnit.test('should return null if no match', function() {
  this.div1.classList.add('blue');
  equal(closest('#blue', this.div2), null, 'correctly gets element');
});