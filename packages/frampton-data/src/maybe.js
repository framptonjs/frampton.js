import inherits from 'frampton-utils/inherits';
import isSomething from 'frampton-utils/is_something';
import notImplemented from 'frampton-utils/not_implemented';

/**
 * @name Maybe
 * @class
 * @memberof Frampton.Data
 */
function Maybe(a) {}

/**
 * @name of
 * @method
 * @memberof Frampton.Data.Maybe
 * @param {*}
 */
Maybe.of = function(val) {
  return (isSomething(val)) ? new Just(val) : new Nothing();
};

/**
 * @name of
 * @method
 * @memberof Frampton.Data.Maybe#
 * @param {*}
 */
Maybe.prototype.of = Maybe.of;

/**
 * join :: Maybe (Maybe a) -> Maybe a
 * @name join
 * @method
 * @memberof Frampton.Data.Maybe#
 */
Maybe.prototype.join = notImplemented;

/**
 * chain(>>=) :: Maybe a -> (a -> Maybe b) -> Maybe b
 * @name chain
 * @method
 * @memberof Frampton.Data.Maybe#
 */
Maybe.prototype.chain = notImplemented;

/**
 * ap(<*>) :: Maybe (a -> b) -> Maybe a -> Maybe b
 * @name ap
 * @method
 * @memberof Frampton.Data.Maybe#
 */
Maybe.prototype.ap = notImplemented;

/**
 * map :: Maybe a -> (a -> b) -> Maybe b
 * @name map
 * @method
 * @memberof Frampton.Data.Maybe#
 * @param {Function} mapping Function to map value of Maybe
 * @returns {Frampton.Data.Maybe}
 */
Maybe.prototype.map = notImplemented;

/**
 * @name isJust
 * @method
 * @memberof Frampton.Data.Maybe#
 * @returns {Boolean}
 */
Maybe.prototype.isJust = function() {
  return false;
};

/**
 * @name isNothing
 * @method
 * @memberof Frampton.Data.Maybe#
 * @returns {Boolean}
 */
Maybe.prototype.isNothing = function() {
  return false;
};

/**
 * @name get
 * @method
 * @memberof Frampton.Data.Maybe#
 * @returns {*}
 */
Maybe.prototype.get = notImplemented;

/**
 * @name getOrElse
 * @method
 * @memberof Frampton.Data.Maybe#
 * @param {*}
 * @returns {*}
 */
Maybe.prototype.getOrElse = notImplemented;

/**
 * @name toString
 * @method
 * @memberof Frampton.Data.Maybe#
 * @returns {String}
 */
Maybe.prototype.toString = notImplemented;

/**
 * @name Just
 * @class
 * @extends Frampton.Data.Maybe
 * @memberof Frampton.Data
 */
inherits(Just, Maybe);

function Just(val) {
  this.value = val;
}

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
 * @name Nothing
 * @class
 * @extends Frampton.Data.Maybe
 * @memberof Frampton.Data
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