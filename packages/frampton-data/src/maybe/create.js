import isSomething from 'frampton-utils/is_something';
import isFunction from 'frampton-utils/is_function';
import ofValue from 'frampton-utils/of_value';
import isEqual from 'frampton-utils/is_equal';

function create(val) {
  if (isSomething(val)) {
    return new Just(val);
  } else {
    return new Nothing();
  }
}

/**
 * @name Maybe
 * @class
 * @abstract
 * @private
 * @memberof Frampton.Data
 */
function Maybe() {}

/**
 * @name toString
 * @method
 * @memberof Frampton.Data.Mabye#
 * @returns {String}
 */
Maybe.prototype.toString = function() {
  return `Just(${this._value})`;
};

/**
 * join :: Maybe (a -> b) -> Maybe a -> Maybe b
 *
 * Applies the function in one maybe to the value of another.
 *
 * @name join
 * @method
 * @memberof Frampton.Data.Maybe#
 * @param {Frampton.Data.Maybe} mb
 * @returns {Frampton.Data.Maybe}
 */
Maybe.prototype.ap = function(mb) {
  return create(this._value(mb._value));
};

/**
 * join :: Maybe (Maybe a) -> Maybe a
 *
 * Takes a nested Maybe and removes one level of nesting.
 *
 * @name join
 * @method
 * @memberof Frampton.Data.Maybe#
 * @returns {Frampton.Data.Maybe}
 */
Maybe.prototype.join = function() {
  return this.get();
};

/**
 * map :: Maybe a -> (a -> b) -> Maybe b
 *
 * Transforms the value of a Maybe with the given function.
 *
 * @name map
 * @method
 * @memberof Frampton.Data.Maybe#
 * @param {Function} mapping Function used to map value of Maybe
 * @returns {Frampton.Data.Maybe}
 */
Maybe.prototype.map = function(mapping) {
  const mappingFn = isFunction(mapping) ? mapping : ofValue(mapping);
  return create(mappingFn(this._value));
};

/**
 * chain :: Maybe a -> (a -> Maybe b) -> Maybe b
 *
 * Takes the value of a Maybe and gives it to a function that returns a new Maybe.
 *
 * @name chain
 * @method
 * @memberof Frampton.Data.Maybe#
 * @param {Function} mapping Function used to create new Maybe
 * @returns {Frampton.Data.Maybe}
 */
Maybe.prototype.chain = function(mapping) {
  return this.map(mapping).join();
};

/**
 * filter :: Maybe a -> (a -> Boolean) -> Maybe a
 *
 * Turns a Just into a Nothing if the predicate returns false
 *
 * @name filter
 * @method
 * @memberof Frampton.Data.Maybe#
 * @param {Function} predicate Function used to test value
 * @returns {Frampton.Data.Maybe}
 */
Maybe.prototype.filter = function(predicate) {
  const filterFn = isFunction(predicate) ? predicate : isEqual(predicate);
  if (filterFn(this._value)) {
    return new Just(this._value);
  } else {
    return new Nothing();
  }
};

/**
 * get :: Maybe a -> a
 *
 * Extract the value from a Maybe
 *
 * @name get
 * @method
 * @memberof Frampton.Data.Maybe#
 * @returns {*}
 */
Maybe.prototype.get = function() {
  return this._value;
};

/**
 * getOrElse :: Maybe a -> a -> a
 *
 * @name getOrElse
 * @method
 * @memberof Frampton.Data.Maybe#
 * @returns {*}
 */
Maybe.prototype.getOrElse = function(_) {
  return this._value;
};

/**
 * isNothing :: Maybe a -> Boolean
 *
 * @name isNothing
 * @method
 * @memberof Frampton.Data.Maybe#
 * @returns {Boolean}
 */
Maybe.prototype.isNothing = function() {
  return false;
};

/**
 * isJust :: Maybe a -> Boolean
 *
 * @name isJust
 * @method
 * @memberof Frampton.Data.Maybe#
 * @returns {Boolean}
 */
Maybe.prototype.isJust = function() {
  return false;
};

/**
 * @name Just
 * @class
 * @extends Frampton.Data.Maybe
 */
function Just(val) {
  this._value = val;
}

Just.prototype = new Maybe();

Just.isJust = function() {
  return true;
};

/**
 * @name Nothing
 * @class
 * @extends Frampton.Data.Maybe
 */
function Nothing() {}

Nothing.prototype = new Maybe();

Nothing.prototype.toString = function() {
  return 'Nothing';
};

Nothing.prototype.join = function() {
  return new Nothing();
};

Nothing.prototype.map = function(_) {
  return new Nothing();
};

Nothing.prototype.filter = function(_) {
  return new Nothing();
};

Nothing.prototype.ap = function(_) {
  return new Nothing();
};

Nothing.prototype.chain = function(_) {
  return new Nothing();
};

Nothing.prototype.get = function() {
  throw new Error('Cannot get the value of a Nothing');
};

Nothing.prototype.getOrElse = function(val) {
  return val;
};

Nothing.isNothing = function() {
  return true;
};

export const createMaybe = create;

export const JustType = Just;

export const NothingType = Nothing;
