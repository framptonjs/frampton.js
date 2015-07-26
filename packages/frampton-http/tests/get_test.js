import get from 'frampton-http/get';

QUnit.module('Frampton.Http.get');

QUnit.test('should return an EventStream of an ajax response', function(assert) {
  var done = assert.async();
  var req = get('test');
  req.next((val) => {
    if (val.status === 'complete') {
      ok(true);
      done();
    }
  });
});