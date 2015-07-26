import send from 'frampton-http/send';
import Request from 'frampton-http/request';

QUnit.module('Frampton.Http.send');

QUnit.test('should return an EventStream of an ajax response', function(assert) {
  var done = assert.async();
  var req = send(null, Request('test'));
  req.next((val) => {
    if (val.status === 'complete') {
      ok(true);
      done();
    }
  });
});