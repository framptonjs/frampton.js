import not from 'frampton-utils/not';

QUnit.module('Frampton.Utils.not');

QUnit.test('should return true if a function returns falsy value', function() {
  var fn = function() { return false; };
  ok(not(fn)());
});

QUnit.test('should return false if a function returns truthy value', function() {
  var fn = function() { return true; };
  notOk(not(fn)());
});