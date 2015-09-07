import parseSearch from 'frampton-history/parse_search';

QUnit.module('Frampton.History.parseSearch');

QUnit.test('should correctly parse query string', function() {
  var str = '?key1=test1&key2=test2&key3=test3';
  var obj = {
    key1 : 'test1',
    key2 : 'test2',
    key3 : 'test3'
  };
  deepEqual(parseSearch(str), obj);
});

QUnit.test('should return empty object for empty string', function() {
  var str = '';
  var obj = {};
  deepEqual(parseSearch(str), obj);
});

QUnit.test('should ignore malformed pairs', function() {
  var str = '?key1-test1&key2=test2&key3=test3';
  var obj = {
    key2 : 'test2',
    key3 : 'test3'
  };
  deepEqual(parseSearch(str), obj);
});

QUnit.test('should ignore empty values', function() {
  var str = '?key1=&key2=test2&key3=test3';
  var obj = {
    key2 : 'test2',
    key3 : 'test3'
  };
  deepEqual(parseSearch(str), obj);
});