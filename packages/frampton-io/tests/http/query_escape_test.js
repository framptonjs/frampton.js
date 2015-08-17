import queryEscape from 'frampton-io/http/query_escape';

QUnit.module('Frampton.IO.Http.queryEscape');

QUnit.test('should correctly escape spaces', function() {
  var params = 'some thing';
  equal(queryEscape(params), 'some+thing');
});