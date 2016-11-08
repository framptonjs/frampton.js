import supported from 'frampton-style/supported_by_element';

QUnit.module('Frampton.Style.supportedByElement', {
  beforeEach() {
    this.element = {
      style : {
        'borderRadius' : 0,
        'MozAnimationDuration' : 0,
        'webkitBoxShadow' : 0
      }
    };
  },
  afterEach() {
    this.element = null;
  }
});

QUnit.test('returns unprefixed property if browser supports it', function(assert) {
  assert.equal(supported(this.element, 'border-radius'), 'border-radius');
});

QUnit.test('returns prefixed properties for moz only properties', function(assert) {
  assert.equal(supported(this.element, 'animation-duration'), '-moz-animation-duration');
});

QUnit.test('returns prefixed properties for webkit only properties', function(assert) {
  assert.equal(supported(this.element, 'box-shadow'), '-webkit-box-shadow');
});
