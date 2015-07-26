import queryPair from 'frampton-http/query_pair';

QUnit.module('Frampton.Http.queryPair');

QUnit.test('should combine pair of strings to string', function() {
  var params = ['key', 'value'];
  equal(queryPair(params), 'key=value');
});