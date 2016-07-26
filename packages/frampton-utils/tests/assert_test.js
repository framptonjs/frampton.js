import myAssert from 'frampton-utils/assert';

QUnit.module('Frampton.Utils.assert');

QUnit.test('Should throw for falsy value', function(assert) {
  assert.throws(function() { myAssert('falsy value', 0); }, 'throws for falsy');
});

QUnit.test('Should not throw for truthy value', function(assert) {
  assert.ok((typeof myAssert('truthy value', 'true') === 'undefined'), 'passes on truthy');
});

QUnit.test('Should throw for false', function(assert) {
  assert.throws(function() { myAssert('false', false); }, 'throws for false');
});

QUnit.test('Should not throw for true', function(assert) {
  assert.ok((typeof myAssert('true', true) === 'undefined'), 'passes on true');
});

QUnit.test('Thrown message should be correct', function(assert) {
  assert.throws(
    function() { myAssert('custom message', false); },
    function(err) { return err.message === 'custom message'; },
    'returns correct error message'
  );
});
