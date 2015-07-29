import { inherits, isSomething, notImplemented } from 'frampton-utils';

/**
 * @class
 */
function Maybe(a) {}

Maybe.fromEither = function(a) {
  return a.fold(Maybe.Nothing, Maybe.Just);
};

Maybe.prototype.fromEither = Maybe.fromEither;

Maybe.of = function(val) {
  return (isSomething(val)) ? new Just(val) : new Nothing();
};

Maybe.prototype.of = Maybe.of;

// join :: Maybe (Maybe a) -> Maybe a
Maybe.prototype.join = notImplemented;

// chain(>>=) :: Maybe a -> (a -> Maybe b) -> Maybe b
Maybe.prototype.chain = notImplemented;

// ap(<*>) :: Maybe (a -> b) -> Maybe a -> Maybe b
Maybe.prototype.ap = notImplemented;

Maybe.prototype.map = notImplemented;

Maybe.prototype.isJust = function() {
  return false;
};

Maybe.prototype.isNothing = function() {
  return false;
};

Maybe.prototype.get = notImplemented;

Maybe.prototype.getOrElse = notImplemented;

Maybe.prototype.toString = notImplemented;

/**
 * @class
 * @extends Maybe
 */
inherits(Just, Maybe);

function Just() {}

Just.prototype.isJust = function() {
  return true;
};

// join :: Maybe (Maybe a) -> Maybe a
Just.prototype.join = function() {
  return this.value;
};

// chain(>>=) :: Maybe a -> (a -> Maybe b) -> Maybe b
Just.prototype.chain = function(fn) {
  return this.map(fn).join();
};

// ap(<*>) :: Maybe (a -> b) -> Maybe a -> Maybe b
Just.prototype.ap = function(maybe) {
  return maybe.map(this.value);
};

Just.prototype.map = function(fn) {
  return this.of(fn(this.value));
};

Just.prototype.get = function() {
  return this.value;
};

Just.prototype.getOrElse = function(val) {
  return this.value;
};

Just.prototype.toString = function() {
  return 'Just(' + this.value + ')';
};

/**
 * @class
 * @extends Maybe
 */
inherits(Nothing, Maybe);

function Nothing() {}

Nothing.prototype.isNothing = function() {
  return true;
};

Nothing.prototype.ap = function(val) {
  return val;
};

Nothing.prototype.map = function(fn) {
  return new Nothing();
};

Nothing.prototype.chain = function(fn) {
  return new Nothing();
};

Nothing.prototype.toString = function() {
  return 'Nothing';
};

Nothing.prototype.get = function() {
  throw new TypeError("Can't extract the value of a Nothing.");
};

Nothing.prototype.getOrElse = function(val) {
  return val;
};

export {
  Maybe,
  Just,
  Nothing
};