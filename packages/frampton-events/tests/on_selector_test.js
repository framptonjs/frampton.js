import onSelector from 'frampton-events/on_selector';

QUnit.module('Frampton.Events.onSelector', {
  beforeEach() {
    this.selectorTestDiv = document.createElement('div');
    this.selectorTestDiv.classList.add('blue');
    this.container = document.getElementById('qunit-fixture');
    this.container.appendChild(this.selectorTestDiv);
  },
  afterEach() {
    this.container.removeChild(this.selectorTestDiv);
    this.selectorTestDiv = null;
    this.container = null;
  }
});

QUnit.test('Should create a signal that responds to events on a given selector', function(assert) {
  const sig = onSelector('click', '.blue').map(1);
  assert.equal(sig.get(), undefined, 'Initial value is not undefined');
  this.selectorTestDiv.click();
  assert.equal(sig.get(), 1, 'Did not update to new value');
});

QUnit.test('Should create a signal that responds to multiple events', function(assert) {
  var test = '';
  const sig = onSelector('click mouseover', '.blue').map((evt) => {
    return test += evt.type;
  });
  const evt = document.createEvent("HTMLEvents");
  evt.initEvent('mouseover', true, true);
  this.selectorTestDiv.dispatchEvent(evt);
  this.selectorTestDiv.click();
  assert.equal(sig.get(), 'mouseoverclick');
});
