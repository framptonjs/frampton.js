import { assert } from 'frampton-utils';

QUnit.module('Frampton.assert');

QUnit.test('should throw for falsy value', function() {
  throws(function() { assert('falsy value', 0); }, 'throws for falsy');
});

QUnit.test('should not throw for truthy value', function() {
  ok((typeof assert('truthy value', 'true') === 'undefined'), 'passes on truthy');
});

QUnit.test('should throw for false', function() {
  throws(function() { assert('false', false); }, 'throws for false');
});

QUnit.test('should not throw for true', function() {
  ok((typeof assert('true', true) === 'undefined'), 'passes on true');
});

QUnit.test('thrown message should be correct', function() {
  throws(
    function() { assert('custom message', false); },
    function(err) { return err.message === 'custom message'; },
    'returns correct error message'
  );
});