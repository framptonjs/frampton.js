import post from 'frampton-http/post';

QUnit.module('Frampton.Http.post');

QUnit.test('should return an EventStream of an ajax response', function(assert) {
  var done = assert.async();
  var req = post('test', {});
  req.next((val) => {
    if (val.status === 'complete') {
      ok(true);
      done();
    }
  });
});