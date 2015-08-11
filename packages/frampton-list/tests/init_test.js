import init from 'frampton-list/init';

QUnit.module('Frampton.List.init');

QUnit.test('should return new array with all but last element', () => {
  var xs = [1,2,3];
  deepEqual(init(xs), [1,2]);
});