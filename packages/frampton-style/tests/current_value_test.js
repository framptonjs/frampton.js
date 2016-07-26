import current from 'frampton-style/current_value';

QUnit.module('Frampton.Style.current');

QUnit.module('Frampton.Style.current', {
  beforeEach() {
    this.div = document.createElement('div');
    this.div.style.color = 'rgb(0, 0, 255)';
    this.container = document.getElementById('qunit-fixture');
    this.container.appendChild(this.div);
  },
  afterEach() {
    this.container.removeChild(this.div);
    this.div = null;
    this.container = null;
  }
});

QUnit.test('should correctly retrieve current value of style', function(assert) {
  assert.equal(current(this.div, 'color'), 'rgb(0, 0, 255)', 'correctly gets value');
});
