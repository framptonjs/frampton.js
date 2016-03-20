import contains from 'frampton-html/contains';

QUnit.module('Frampton.Html.contains', {
  beforeEach() {
    this.div1 = document.createElement('div');
    this.div2 = document.createElement('div');
    this.div3 = document.createElement('div');
    this.container = document.getElementById('qunit-fixture');
    this.container.appendChild(this.div1);
    this.div1.appendChild(this.div2);
    this.container.appendChild(this.div3);
  },
  afterEach() {
    this.container.removeChild(this.div1);
    this.container.removeChild(this.div3);
    this.div1 = null;
    this.div2 = null;
    this.div3 = null;
    this.container = null;
  }
});

QUnit.test('Should return true if an element contains given element', function() {
  ok(contains(this.div1, this.div2));
});

QUnit.test('Should return false if an element does not contain a given element', function() {
  notOk(contains(this.div1, this.div3));
});