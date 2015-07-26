import queryEscape from 'frampton-http/query_escape';

QUnit.module('Frampton.Http.queryEscape');

QUnit.test('should correctly escape spaces', function() {
  var params = 'some thing';
  equal(queryEscape(params), 'some+thing');
});