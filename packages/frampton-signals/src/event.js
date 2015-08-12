import assert from 'frampton-utils/assert';
import inherits from 'frampton-utils/inherits';
import isString from 'frampton-utils/is_string';
import notImplemented from 'frampton-utils/not_implemented';

/**
 * The value of a observable
 */
function Event(value) {}

Event.of = function(value) {
  return new Next(value);
};

Event.prototype.of = Event.of;

Event.prototype.ap = notImplemented;

Event.prototype.map = notImplemented;

Event.prototype.recover = notImplemented;

Event.prototype.filter = notImplemented;

Event.prototype.get = function() {
  return this._value;
};

Event.prototype.isEmpty = function() {
  return false;
};

Event.prototype.isEnd = function() {
  return false;
};

Event.prototype.isNext = function() {
  return false;
};

Event.prototype.isError = function() {
  return false;
};

/**
 * @class Next
 * @extends Event
 */
inherits(Next, Event);

function Next(value) {
  this._value = value;
}

Next.prototype.map = function(fn) {
  return new Next(fn(this._value));
};

Next.prototype.recover = function(fn) {
  return new Next(this._value);
};

Next.prototype.filter = function(fn) {
  if (fn(this._value)) {
    return new Next(this._value);
  } else {
    return new Empty();
  }
};

Next.prototype.isNext = function() {
  return true;
};

function nextEvent(value) {
  return new Next(value);
}

/**
 * @class End
 * @extends Event
 */
inherits(End, Event);

function End(value) {
  this._value = value;
}

End.prototype.map = function() {
  return new End(this._value);
};

End.prototype.recover = function(fn) {
  return new End(this._value);
};

End.prototype.filter = function(fn) {
  if (fn(this._value)) {
    return new End(this._value);
  } else {
    return new Empty();
  }
};

End.prototype.isEnd = function() {
  return true;
};

function endEvent(value) {
  return new End(value || null);
}

/**
 * @class Error
 * @extends Event
 */
inherits(Error, Event);

function Error(msg) {
  assert('Error requires a message', isString(msg));
  this._message = msg;
}

Error.prototype.get = function() {
  return this._message;
};

Error.prototype.map = function() {
  return new Error(this._message);
};

Error.prototype.recover = function(fn) {
  return new Next(fn(this._message));
};

Error.prototype.filter = function() {
  return new Error(this._message);
};

Error.prototype.isError = function() {
  return true;
};

function errorEvent(msg) {
  return new Error(msg);
}

/**
 * @class Empty
 * @extends Event
 */
inherits(Empty, Event);

function Empty() {}

Empty.prototype.get = function() {
  return null;
};

Empty.prototype.map = function() {
  return new Empty();
};

Empty.prototype.recover = function() {
  return new Empty();
};

Empty.prototype.filter = function() {
  return new Empty();
};

Empty.prototype.isEmpty = function() {
  return true;
};

function emptyEvent() {
  return new Empty();
}

export {
  emptyEvent,
  errorEvent,
  nextEvent,
  endEvent
};