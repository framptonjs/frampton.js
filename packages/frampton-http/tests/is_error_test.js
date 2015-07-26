import isError from 'frampton-http/is_error';
import Response from 'frampton-http/response';

QUnit.module('Frampton.Http.isError');

QUnit.test('should return true for error response', function() {
  var response = Response('error', 0, null);
  ok(isError(response));
});

QUnit.test('should return false for complete response', function() {
  var response = Response('complete', 1, null);
  notOk(isError(response));
});