import second from 'frampton-list/second';

QUnit.module('Frampton.List.second');

QUnit.test('Should return second item in array', function(assert) {
  var xs = [1,2,3];
  assert.equal(second(xs), 2);
});
