import queryPair from 'frampton-io/http/query_pair';

QUnit.module('Frampton.IO.Http.queryPair');

QUnit.test('should combine pair of strings to string', function() {
  var params = ['key', 'value'];
  equal(queryPair(params), 'key=value');
});