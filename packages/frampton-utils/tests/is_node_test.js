import isNode from 'frampton-utils/is_node';

QUnit.module('Frampton.Utils.isNode');

QUnit.test('Should return true for dom nodes', function() {
  const div = document.createElement('div');
  const ul = document.createElement('ul');
  const span = document.createElement('span');
  ok(isNode(div));
  ok(isNode(ul));
  ok(isNode(span));
});

QUnit.test('Should return false for null', function() {
  const temp = null;
  notOk(isNode(temp));
});

QUnit.test('Should return false for undefined', function() {
  var temp;
  notOk(isNode(temp));
});

QUnit.test('Should return false for strings', function() {
  const temp = 'test';
  notOk(isNode(temp));
});

QUnit.test('Should return false for numbers', function() {
  const temp = 10;
  notOk(isNode(temp));
});

QUnit.test('Should return false for booleans', function() {
  const temp = false;
  const temp2 = true;
  notOk(isNode(temp));
  notOk(isNode(temp2));
});

QUnit.test('Should return false for objects', function() {
  const temp = {};
  notOk(isNode(temp));
});