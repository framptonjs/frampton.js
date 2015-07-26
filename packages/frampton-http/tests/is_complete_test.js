import isComplete from 'frampton-http/is_complete';
import Response from 'frampton-http/response';

QUnit.module('Frampton.Http.isComplete');

QUnit.test('should return true for complete response', function() {
  var response = Response('complete', 1, null);
  ok(isComplete(response));
});

QUnit.test('should return false for incomplete response', function() {
  var response = Response('progress', 0.5, null);
  notOk(isComplete(response));
});