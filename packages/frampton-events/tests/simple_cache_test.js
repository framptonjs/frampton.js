import simpleCache from 'frampton-events/simple_cache';

QUnit.module('Frampton.Events.simpleCache');

QUnit.test('Should return a function', function(assert) {
  const cache = simpleCache();
  assert.ok(typeof cache === 'function');
});

QUnit.test('Should run function if no cached value', function(assert) {
  var count = 0;
  const cache = simpleCache();
  const val = cache('test', () => {
    count += 1;
    return 3;
  });
  assert.equal(val, 3);
  assert.equal(count, 1);
});

QUnit.test('Should not run function if key in cache', function(assert) {
  var count = 0;
  const cache = simpleCache();
  const val1 = cache('test', () => {
    count += 1;
    return 3;
  });
  const val2 = cache('test', () => {
    count += 1;
    return 4;
  });
  assert.equal(val1, 3);
  assert.equal(val2, 3);
  assert.equal(count, 1);
});