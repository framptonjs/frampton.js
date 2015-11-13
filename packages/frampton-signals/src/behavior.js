import assert from 'frampton-utils/assert';
import guid from 'frampton-utils/guid';
import noop from 'frampton-utils/noop';
import isDefined from 'frampton-utils/is_defined';
import lazy from 'frampton-utils/lazy';
import contains from 'frampton-list/contains';
import remove from 'frampton-list/remove';

function init(behavior) {
  let sink = behavior.update.bind(behavior);
  behavior.cleanup = behavior.seed(sink) || noop;
}

function addListener(behavior, fn) {
  if (!contains(behavior.listeners, fn)) {
    behavior.listeners.push(fn);
    fn(behavior.value);
  }

  return lazy(removeListener, behavior, fn);
}

function removeListener(behavior, fn) {
  behavior.listeners = remove(fn, behavior.listeners);
}

function updateListeners(behavior) {
  behavior.listeners.forEach((listener) => {
    listener(behavior.value);
  });
}

/**
 * @name Behavior
 * @memberof Frampton.Signals
 * @class
 * @param {*}        initial Initial value for the Behavior
 * @param {function} seed    A function to seed new values
 */
function Behavior(initial, seed) {
  assert('Behavior must have initial value', isDefined(initial));
  this._id = guid();
  this.value = initial;
  this.listeners = [];
  this.cleanup = null;
  this.seed = seed || noop;
  init(this);
}

/**
 * of :: a -> Behavior a
 *
 * @name of
 * @method
 * @memberof Frampton.Signals.Behavior
 * @returns {Frampton.Signals.Behavior}
 */
Behavior.of = function Behavior_of(value) {
  return new Behavior(value);
};

/**
 * of :: a -> Behavior a
 * @name of
 * @method
 * @memberof Frampton.Signals.Behavior#
 * @returns {Frampton.Signals.Behavior}
 */
Behavior.prototype.of = Behavior.of;


/**
 * update :: a -> Behavior a
 *
 * @name update
 * @method
 * @memberof Behavior
 * @param {*} val
 * @returns {Frampton.Signals.Behavior}
 */
Behavior.prototype.update = function Behavior_update(val) {
  if (val !== this.value) {
    this.value = val;
    updateListeners(this);
  }
  return this;
};

/**
 * ap(<*>) :: Behavior (a -> b) -> Behavior a -> Behavior b
 *
 * @name ap
 * @method
 * @memberof Frampton.Signals.Behavior#
 * @returns {Frampton.Signals.Behavior}
 */
Behavior.prototype.ap = function Behavior_ap(behavior) {
  var source = this;
  return new Behavior(source.value(behavior.value), (sink) => {
    source.changes((val) => {
      sink(val(behavior.value));
    });
    behavior.changes((val) => {
      sink(source.value(val));
    });
  });
};

/**
 * join :: Behavior (Behavior a) -> Behavior a
 *
 * @name join
 * @method
 * @memberof Frampton.Signals.Behavior#
 * @returns {Frampton.Signals.Behavior}
 */
Behavior.prototype.join = function Behavior_join() {
  var source = this;
  return new Behavior(source.value.value, (sink) => {
    source.changes((val) => {
      sink(val.value);
    });
  });
};

/**
 * chain(>>=) :: Behavior a -> (a -> Behavior b) -> Behavior b
 *
 * @name chain
 * @method
 * @memberof Frampton.Signals.Behavior#
 * @returns {Frampton.Signals.Behavior}
 */
Behavior.prototype.chain = function Behavior_chain(fn) {
  return this.map(fn).join();
};

/**
 * map :: Behavior a -> (a -> b) -> Behavior b
 *
 * @name map
 * @method
 * @memberof Frampton.Signals.Behavior#
 * @param {Function} fn A function to transform the value of this Behavior
 * @returns {Frampton.Signals.Behavior}
 */
Behavior.prototype.map = function Behavior_map(fn) {
  var source = this;
  return new Behavior(fn(source.value), (sink) => {
    source.changes((val) => {
      sink(fn(val));
    });
  });
};

/**
 * fold :: Behavior a -> (a -> b) -> Behavior b
 *
 * @name fold
 * @method
 * @memberof Frampton.Signals.Behavior#
 * @param {Function} fn  A function to transform the value of this Behavior
 * @param {*}        acc An initial value for the fold
 * @returns {Frampton.Signals.Behavior}
 */
Behavior.prototype.fold = function Behavior_fold(fn, acc) {
  var source = this;
  return new Behavior((isDefined(acc) ? acc : source.value), (sink) => {
    source.changes((val) => {
      acc = fn(acc, val);
      sink(acc);
    });
  });
};

/**
 * zip :: Behavior a -> Behavior b -> Behavior [a, b]
 *
 * @name zip
 * @method
 * @memberof Frampton.Signals.Behavior#
 * @returns {Frampton.Signals.Behavior}
 */
Behavior.prototype.zip = function Behavior_map(b2) {
  var b1 = this;
  return new Behavior([b1.value, b2.value], (sink) => {
    b1.changes((val) => {
      sink([val, b2.value]);
    });
    b2.changes((val) => {
      sink([b1.value, val]);
    });
  });
};

/**
 * @name changes
 * @method
 * @memberof Frampton.Signals.Behavior#
 * @param {Function} fn A function to call when value changes
 * @returns {Function} A function to unsubscribe
 */
Behavior.prototype.changes = function Behavior_changes(fn) {
  return addListener(this, fn);
};

/**
 * @name bind
 * @method
 * @memberof Frampton.Signals.Behavior#
 * @param {Object} obj  Object to bind value of stream
 * @param {String} prop Property name to bind the value on obj
 * @returns {Function} A function to unsubscribe
 */
Behavior.prototype.bind = function Behavior_bind(obj, prop) {
  return this.changes((val) => {
    obj[prop] = val;
  });
};

/**
 * @name destroy
 * @method
 * @memberof Frampton.Signals.Behavior#
 */
Behavior.prototype.destroy = function Behavior_destroy() {
  this.cleanup();
  this.cleanup = null;
  this.seed = null;
  this.value = null;
  this.listeners = null;
};

export default Behavior;