import ofValue from 'frampton-utils/of_value';
import isEqual from 'frampton-utils/is_equal';
import isFunction from 'frampton-utils/is_function';

/**
 * @name Result
 * @class
 * @abstract
 * @memberof Frampton.Data
 */
function Result() {}

/**
 * Provides a string representation of this Result
 *
 * @name toString
 * @method
 * @override
 * @memberof Frampton.Data.Result#
 * @returns {String}
 */
Result.prototype.toString = function() {
  return `Success(${this._value})`;
};

/**
 * Maps the successful value of a Result. Failures are returned unaltered.
 *
 * @name map
 * @method
 * @memberof Frampton.Data.Result#
 * @param {Function} mapping Function used to map successful value
 * @returns {Frampton.Data.Result}
 */
Result.prototype.map = function(mapping) {
  const mappingFn = isFunction(mapping) ? mapping : ofValue(mapping);
  return new Success(mappingFn(this._value));
};

/**
 * Maps the failed value of a Result. Successes are returned unaltered.
 *
 * @name mapFailure
 * @method
 * @memberof Frampton.Data.Result#
 * @param {Function} mapping Function used to map failed value
 * @returns {Frampton.Data.Result}
 */
Result.prototype.mapFailure = function(_) {
  return new Success(this._value);
};

/**
 * Filters successful values. If the predicate fails the success becomes a failure.
 *
 * @name filter
 * @method
 * @memberof Frampton.Data.Result#
 * @param {Function} predicate Function to test successful values
 * @returns {Frampton.Data.Result}
 */
Result.prototype.filter = function(predicate) {
  const filterFn = isFunction(predicate) ? predicate : isEqual(predicate);
  if (filterFn(this._value)) {
    return new Success(this._value);
  } else {
    return new Failure(this._value);
  }
};

/**
 * Handle the value in a Result. Given two functions it will call the appropriate one
 * with the value of this Result and return the return value of that function.
 *
 * @name fork
 * @method
 * @memberof Frampton.Data.Result#
 * @param {Function} success Function to call for Successes
 * @param {Function} failure Function to call for Failures
 * @returns {*} The result of the given callback function
 */
Result.prototype.fork = function(success, _) {
  return success(this._value);
};

/**
 * Is this Result a Success?
 *
 * @name isSuccess
 * @method
 * @memberof Frampton.Data.Result#
 * @returns {Boolean}
 */
Result.prototype.isSuccess = function() {
  return false;
};

/**
 * Is this Result a Failure?
 *
 * @name isFailure
 * @method
 * @memberof Frampton.Data.Result#
 * @returns {Boolean}
 */
Result.prototype.isFailure = function() {
  return false;
};

function Success(val) {
  this._value = val;
}

Success.prototype = new Result();

Success.prototype.isSuccess = function() {
  return true;
};

function Failure(err) {
  this._value = err;
}

Failure.prototype = new Result();

Failure.prototype.toString = function() {
  return `Failure(${this._value})`;
};

Failure.prototype.map = function(_) {
  return new Failure(this._value);
};

Failure.prototype.mapFailure = function(mapping) {
  const mappingFn = isFunction(mapping) ? mapping : ofValue(mapping);
  return new Failure(mappingFn(this._value));
};

Failure.prototype.filter = function(_) {
  return new Failure(this._value);
};

Failure.prototype.fork = function(_, failure) {
  return failure(this._value);
};

Failure.prototype.isFailure = function() {
  return true;
};

export const SuccessType = Success;

export const FailureType = Failure;
