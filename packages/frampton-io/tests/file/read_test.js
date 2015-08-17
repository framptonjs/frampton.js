import read from 'frampton-io/file/read';

QUnit.module('Frampton.IO.File.read');

QUnit.test('should return an EventStream of a response', function(assert) {
  var done = assert.async();
  var req = read('DATA_URL', 'test');
  req.next((val) => {
    if (val.status === 'complete') {
      ok(true);
      done();
    }
  });
});