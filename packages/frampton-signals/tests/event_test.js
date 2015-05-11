import {
  emptyEvent,
  nextEvent,
  errorEvent,
  endEvent
} from 'frampton-signals';

QUnit.module('Frampton.Event');

QUnit.test('emptyEvent should return an Empty', function() {
  var empty = emptyEvent();
  notOk(empty.isNext(), 'empty is not a Next');
  notOk(empty.isError(), 'empty is not an Error');
  notOk(empty.isEnd(), 'empty is not an End');
  ok(empty.isEmpty(), 'empty is an Empty');
});

QUnit.test('nextEvent should return a Next', function() {
  var next = nextEvent(1);
  notOk(next.isEmpty(), 'next is not an Empty');
  notOk(next.isError(), 'next is not an Error');
  notOk(next.isEnd(), 'next is not an End');
  ok(next.isNext(), 'next is a Next');
});

QUnit.test('errorEvent should return an Error', function() {
  var error = errorEvent('error');
  notOk(error.isNext(), 'error is not a Next');
  notOk(error.isEmpty(), 'error is not an Empty');
  notOk(error.isEnd(), 'error is not an End');
  ok(error.isError(), 'error is an Error');
});

QUnit.test('endEvent should return an End', function() {
  var end = endEvent();
  notOk(end.isNext(), 'end is not a Next');
  notOk(end.isError(), 'end is not an Error');
  notOk(end.isEmpty(), 'end is not an Empty');
  ok(end.isEnd(), 'end is an End');
});

QUnit.test('errorEvent should throw if no message', function() {
  throws(function() { errorEvent(); }, 'error has no message');
});