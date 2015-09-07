import queryUnescape from 'frampton-io/http/query_unescape';

QUnit.module('Frampton.IO.Http.queryUnescape');

QUnit.test('should correctly unescape spaces', function() {
  var params = 'some+thing';
  equal(queryUnescape(params), 'some thing');
});