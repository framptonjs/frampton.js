import upload from 'frampton-http/upload';

QUnit.module('Frampton.Http.upload');

QUnit.test('should return an EventStream of an ajax response', function(assert) {
  var done = assert.async();
  var req = upload('test', 'test data');
  req.next((val) => {
    if (val.status === 'complete') {
      ok(true);
      done();
    }
  });
});