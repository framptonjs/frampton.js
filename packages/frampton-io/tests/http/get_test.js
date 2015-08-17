import get from 'frampton-io/http/get';

QUnit.module('Frampton.IO.Http.get');

QUnit.test('should return an EventStream of a response', function(assert) {
  var done = assert.async();
  var req = get('test');
  req.next((val) => {
    if (val.status === 'complete') {
      ok(true);
      done();
    }
  });
});