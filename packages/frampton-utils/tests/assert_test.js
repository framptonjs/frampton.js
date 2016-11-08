import myAssert from 'frampton-utils/assert';

QUnit.module('Frampton.Utils.assert');

QUnit.test('throws for falsy value', function(assert) {
  assert.throws(function() { myAssert('falsy value', 0); }, 'throws for falsy');
});

QUnit.test('does not throw for truthy value', function(assert) {
  assert.ok((typeof myAssert('truthy value', 'true') === 'undefined'), 'passes on truthy');
});

QUnit.test('throws for false', function(assert) {
  assert.throws(function() { myAssert('false', false); }, 'throws for false');
});

QUnit.test('does not throw for true', function(assert) {
  assert.ok((typeof myAssert('true', true) === 'undefined'), 'passes on true');
});

QUnit.test('thrown message is correct', function(assert) {
  assert.throws(
    function() { myAssert('custom message', false); },
    function(err) { return err.message === 'custom message'; },
    'returns correct error message'
  );
});
