import isError from 'frampton-io/is_error';
import Response from 'frampton-io/response';

QUnit.module('Frampton.IO.isError');

QUnit.test('should return true for error response', function() {
  var response = Response('error', 0, null);
  ok(isError(response));
});

QUnit.test('should return false for complete response', function() {
  var response = Response('complete', 1, null);
  notOk(isError(response));
});