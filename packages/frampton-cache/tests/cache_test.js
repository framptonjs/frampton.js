import Cache from 'frampton-cache/cache';

QUnit.module('Frampton.Cache', {
  beforeEach() {
    this.cache = new Cache();
  },
  afterEach() {
    this.cache = null;
  }
});

QUnit.test('get method should return value of function if no cached value', function() {

  equal(this.cache.get('key', function() {
    return 5;
  }), 5);
});

QUnit.test('get method should return cached value if ther is one', function() {
  this.cache.put('key', 7);
  equal(this.cache.get('key', function() {
    return 9;
  }), 7);
});