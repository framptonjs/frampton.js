import replace from 'frampton-string/replace';

QUnit.module('Frampton.String.replace');

QUnit.test('should replace substring with new substring', function() {
  var str = 'go to the movie';
  equal(replace('yard', 'movie', str), 'go to the yard');
});