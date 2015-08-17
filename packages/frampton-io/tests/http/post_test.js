import post from 'frampton-io/http/post';

QUnit.module('Frampton.IO.Http.post');

QUnit.test('should return an EventStream of a response', function(assert) {
  var done = assert.async();
  var req = post('test', {});
  req.next((val) => {
    if (val.status === 'complete') {
      ok(true);
      done();
    }
  });
});