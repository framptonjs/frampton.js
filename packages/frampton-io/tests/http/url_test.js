import url from 'frampton-io/http/url';

QUnit.module('Frampton.IO.Http.url');

QUnit.test('should return url for domain and object of params', function() {
  var params = { one : 1, two : 2, three : 3 };
  var domain = 'http://www.test.com';
  equal(url(domain, params), 'http://www.test.com?one=1&two=2&three=3');
});

QUnit.test('return url with correctly encoded spaces', function() {
  var params = { one : 1, two : 2, three : 'three three' };
  var domain = 'http://www.test.com';
  equal(url(domain, params), 'http://www.test.com?one=1&two=2&three=three+three');
});