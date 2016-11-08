import replace from 'frampton-string/replace';

QUnit.module('Frampton.String.replace');

QUnit.test('replaces substring with new substring', function(assert) {
  const str = 'go to the movie';
  const actual = replace('yard', 'movie', str);
  const expected = 'go to the yard';
  assert.equal(actual, expected);
});
