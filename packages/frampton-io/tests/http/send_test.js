import send from 'frampton-io/http/send';
import Request from 'frampton-io/http/request';

QUnit.module('Frampton.IO.Http.send');

QUnit.test('should return an EventStream of a response', function(assert) {
  var done = assert.async();
  var req = send(null, Request('test'));
  req.next((val) => {
    if (val.status === 'complete') {
      ok(true);
      done();
    }
  });
});