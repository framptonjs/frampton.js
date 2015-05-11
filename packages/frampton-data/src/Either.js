import { identity, inherits, noop, notImplemented } from 'frampton-utils';

/**
 *
 */
function Either() {}

Either.of = function(val) {
  return new Right(val);
};

Either.prototype.ap = notImplemented;

Either.prototype.chain = notImplemented;

Either.prototype.map = notImplemented;

Either.prototype.toString = notImplemented;

Either.prototype.isLeft = function() {
  return false;
};

Either.prototype.isRight = function() {
  return false;
};

inherits(Left, Either);

function Left(val) {
  this.value = val;
}

Left.prototype.ap = identity;

Left.prototype.chain = noop;

Left.prototype.map = noop;

Left.prototype.toString = function() {
  return 'Left(' + this.value + ')';
};

inherits(Right, Either);

function Right(val) {
  this.value = val;
}

// ap(<*>) :: Either [x, (b -> c)] -> Either x b -> Either [x, c]
Right.prototype.ap = function(either) {
  return either.map(this.value);
};

// chain(>>=) :: Either [x, b] -> (b -> Either [x, c]) -> Either [x, c]
Right.prototype.chain = function(fn) {
  return fn(this.value);
};

// map :: Either [x, a] -> (a -> b) -> Either [x, b]
Right.prototype.map = function(fn) {
  return new Right(fn(this.value));
};

// toString :: String
Right.prototype.toString = function() {
  return 'Right(' + this.value + ')';
};

// isRight :: Boolean
Right.prototype.isRight = function() {
  return true;
};

export {
  Either,
  Left,
  Right
};