import contains from 'frampton-html/contains';

QUnit.module('Frampton.Html.contains', {
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

QUnit.test('should return true if an element contains given element', function() {
  ok(contains(this.div1, this.div2));
});

QUnit.test('should return false if an element does not contain a given element', function() {
  var div3 = document.createElement('div');
  notOk(contains(this.div1, div3));
});