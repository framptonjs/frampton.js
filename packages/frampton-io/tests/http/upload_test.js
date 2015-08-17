import upload from 'frampton-io/http/upload';

QUnit.module('Frampton.IO.Http.upload');

QUnit.test('should return an EventStream of a response', function(assert) {
  var done = assert.async();
  var req = upload('test', 'test data');
  req.next((val) => {
    if (val.status === 'complete') {
      ok(true);
      done();
    }
  });
});