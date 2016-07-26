import guid from 'frampton-utils/guid';
import isDefined from 'frampton-utils/is_defined';
import isPromise from 'frampton-utils/is_promise';
import isFunction from 'frampton-utils/is_function';
import isEqual from 'frampton-utils/is_equal';
import ofValue from 'frampton-utils/of_value';
import noop from 'frampton-utils/noop';
import log from 'frampton-utils/log';

var signalGraph = [];
var updateQueue = [];
var updateInProgress = false;

// Removing duplicates from right->left ensures all of a node's dependencies have
// been updated before the node is updated.
function removeDuplicatesWeigthed(graph) {
  const temp = [];
  var i = graph.length - 1;
  for (;i>=0;i--) {
    if (temp.indexOf(graph[i]) === -1) {
      temp.unshift(graph[i]);
    }
  }
  return temp;
}

// Build the initial graph by queuing children breadth first
function buildRawGraph(sig) {
  const graph = [];
  return (function addChildren(next) {
    const len = next._children.length;
    var i;
    for (i=0;i<len;i++) {
      graph.push(next._children[i]);
    }
    for (i=0;i<len;i++) {
      addChildren(next._children[i]);
    }
    return graph;
  }(sig));
}

function buildSignalGraph(sig) {
  return removeDuplicatesWeigthed(buildRawGraph(sig));
}

function finishUpdate() {
  const len = signalGraph.length;
  var sig = null;
  var i;
  for (i=0;i<len;i++) {
    sig = signalGraph[i];
    sig._updater = null;
    sig._queued = false;
  }
  signalGraph.length = 0;
}

function runUpdate() {
  const numberOfNodes = signalGraph.length;
  var node = null;
  var i = 0;
  updateInProgress = true;
  for (i=0;i<numberOfNodes;i++) {
    node = signalGraph[i];
    if (node._queued) {
      node._update(node);
    }
  }
  finishUpdate();
  updateInProgress = false;
}

function markChildren(sig) {
  const len = sig._children.length;
  var child = null;
  var i;
  for (i=0;i<len;i++) {
    child = sig._children[i];
    child._updater = sig;
    child._queued = true;
  }
}

function notInGraph(sig) {
  return (signalGraph.indexOf(sig) === -1);
}

function scheduleUpdate(sig, val) {
  updateQueue.push({
    signal : sig,
    value : val
  });
}

function checkUpdateQueue() {
  var update;
  if (updateQueue.length > 0) {
    update = updateQueue.shift();
    updateValue(update.signal, update.value);
  }
}

function updateValue(sig, val) {
  if (isPromise(val)) {
    val.then(sig);
  } else {
    sig._value = val;
    sig._hasValue = true;
    markChildren(sig);
    if (!updateInProgress) {
      signalGraph = buildSignalGraph(sig);
      runUpdate();
      checkUpdateQueue();
    } else if (notInGraph(sig)) {
      scheduleUpdate(sig, val);
    }
  }
}

function toString() {
  return 'Signal(' + this._value + ')';
}

/**
 * @name merge
 * @method
 * @memberof Frampton.Signal.Signal#
 * @param {Frampton.Signal.Signal} sig2
 * @returns {Frampton.Signal.Signal}
 */
function merge(sig2) {
  const sig1 = this;
  return mergeMany([sig1, sig2]);
}

/**
 * ap(<*>) :: Signal (a -> b) -> Signal a -> Signal b
 *
 * @name ap
 * @method
 * @memberof Frampton.Signal.Signal#
 * @param {Frampton.Signal.Signal} arg
 * @returns {Frampton.Signal.Signal}
 */
function ap(arg) {
  const parent = this;
  const initial = (parent._hasValue && arg._hasValue) ? parent._value(arg._value) : undefined;
  return createSignal((self) => {
    self.push(parent._value(arg._value));
  }, [parent], initial);
}

/**
 * @name sample
 * @method
 * @private
 * @memberof Frampton.Signal.Signal#
 * @param {Frampton.Signal.Signal} tag
 * @returns {Frampton.Signal.Signal}
 */
function sample(tag) {
  const parent = this;
  return createSignal((self) => {
    self.push(tag._value);
  }, [parent], tag._value);
}

/**
 * @name take
 * @method
 * @private
 * @memberof Frampton.Signal.Signal#
 * @param {Number} limit
 * @returns {Frampton.Signal.Signal}
 */
function take(limit) {
  const parent = this;
  return createSignal((self) => {
    if (limit-- > 0) {
      self.push(parent._value);
    } else {
      self.close();
    }
  }, [parent]);
}

/**
 * Like reduce on Arrays, this method is used to reduce all values of a Signal down to a
 * single value using the given function.
 *
 * The function recieves arguments in the order of (accumulator, next value). The function
 * should return a new value that will then be the new accumulator for the next interation.
 *
 * @name fold
 * @method
 * @private
 * @memberof Frampton.Signal.Signal#
 * @param {Function} fn
 * @param {Function} initial
 * @returns {Frampton.Signal.Signal}
 */
function fold(fn, initial) {
  const parent = this;
  return createSignal((self) => {
    self.push(fn(self._value, parent._value));
  }, [parent], initial);
}

/**
 * Remove values from the Signal based on the given predicate function. If a function is not
 * given then filter will use strict equals with the value given to test new values on the
 * Signal.
 *
 * @name filter
 * @method
 * @private
 * @memberof Frampton.Signal.Signal#
 * @param {*} predicate - Usually a function to test values of the Signal
 * @returns {Frampton.Signal.Signal}
 */
function filter(predicate) {
  const parent = this;
  const filterFn = isFunction(predicate) ? predicate : isEqual(predicate);
  const initial = (parent._hasValue && filterFn(parent._value)) ? parent._value : undefined;
  return createSignal((self) => {
    if (filterFn(parent._value)) {
      self.push(parent._value);
    }
  }, [parent], initial);
}

/**
 * @name filterPrevious
 * @method
 * @private
 * @memberof Frampton.Signal.Signal#
 * @param {Function} predicate - A binary function to test the previous value against the current
 *                               value to decide if you want to keep the new value.
 * @returns {Frampton.Signal.Signal}
 */
function filterPrevious(predicate) {
  const parent = this;
  const initial = (parent._hasValue) ? parent._value : undefined;
  return createSignal((self) => {
    if (predicate(self._value, parent._value)) {
      self.push(parent._value);
    }
  }, [parent], initial);
}

/**
 * @name and
 * @method
 * @private
 * @memberof Frampton.Signal.Signal#
 * @param {Frampton.Signal.Signal} predicate - A Signal that must be truthy for values on this Signal
 *                                             to continue.
 * @returns {Frampton.Signal.Signal}
 */
function and(predicate) {
  const parent = this;
  const initial = (parent._hasValue && predicate._value) ? parent._value : undefined;
  return createSignal((self) => {
    if (predicate._value) {
      self.push(parent._value);
    }
  }, [parent], initial);
}

/**
 * @name not
 * @method
 * @private
 * @memberof Frampton.Signal.Signal#
 * @param {Frampton.Signal.Signal} predicate - A Signal that must be falsy for values on this Signal
 *                                             to continue.
 * @returns {Frampton.Signal.Signal}
 */
function not(predicate) {
  const parent = this;
  const initial = (parent._hasValue && !predicate._value) ? parent._value : undefined;
  return createSignal((self) => {
    if (!predicate._value) {
      self.push(parent.value);
    }
  }, [parent], initial);
}

/**
 * @name map
 * @method
 * @private
 * @memberof Frampton.Signal.Signal#
 * @param {*} mapping - A function or value to map the signal with. If a function, the value
 *                        on the parent signal will be passed to the function and the signal will
 *                        be mapped to the return value of the function. If a value, the value of
 *                        the parent signal will be replaced with the value.
 * @returns {Frampton.Signal.Signal} A new signal with mapped values
 */
function map(mapping) {
  const parent = this;
  const mappingFn = isFunction(mapping) ? mapping : ofValue(mapping);
  const initial = (parent._hasValue) ? mappingFn(parent._value) : undefined;
  return createSignal((self) => {
    self.push(mappingFn(parent._value));
  }, [parent], initial);
}

/**
 * @name debounce
 * @method
 * @private
 * @memberof Frampton.Signal.Signal#
 * @param {Number} delay - Milliseconds to debounce the signal
 * @returns {Frampton.Signal.Signal}
 */
function debounce(delay) {
  const parent = this;
  var timer = null;
  return createSignal((self) => {
    if (!timer) {
      timer = setTimeout(() => {
        self.push(parent._value);
        timer = null;
      }, (delay || 10));
    }
  }, [parent], parent._value);
}

/**
 * @name delay
 * @method
 * @private
 * @memberof Frampton.Signal.Signal#
 * @param {Number} time - Milliseconds to delay values of this Signal.
 * @returns {Frampton.Signal.Signal}
 */
function delay(time) {
  const parent = this;
  return createSignal((self) => {
    (function(saved) {
      setTimeout(() => {
        self.push(saved);
      }, time);
    }(parent._value));
  }, [parent], parent._value);
}

/**
 * dropRepeats :: Signal a -> Signal a
 *
 * Uses strict equals to drop repeated values from the parent signal.
 *
 * @name dropRepeats
 * @method
 * @memberof Frampton.Signal.Signal#
 * @returns {Frampton.Signal.Signal}
 */
function dropRepeats() {
  return this.filterPrevious((prev, next) => {
    return (prev !== next);
  });
}

/**
 * Calls the given function when this signal updates. This function will call for the first
 * time the next time the Signal updates. If there is a current value on the Signal it is
 * ignored. If you are interested in the current value of the Signal use either the value or
 * changes method.
 *
 * @name next
 * @method
 * @memberof Frampton.Signal.Signal#
 * @param {Function} fn - The function to call
 * @returns {Frampton.Signal.Signal}
 */
function next(fn) {
  const parent = this;
  return createSignal((self) => {
    fn(parent._value);
  }, [parent]);
}

/**
 * Calls the given function when this Signal has a value. The function is called immediately
 * if this Signal already has a value, then is called again each time this Signal updates.
 *
 * @name value
 * @method
 * @memberof Frampton.Signal.Signal#
 * @param {Function} fn - The function to call
 * @returns {Frampton.Signal.Signal}
 */
function value(fn) {
  const parent = this;
  const child = createSignal((self) => {
    fn(parent._value);
  }, [parent], parent._value);

  if (child._hasValue) {
    fn(child._value);
  }

  return child;
}

/**
 * Works just like the value method, just repeated values are dropped.
 *
 * @name changes
 * @method
 * @memberof Frampton.Signal.Signal#
 * @param {Function} fn - The function to call
 * @returns {Frampton.Signal.Signal}
 */
function changes(fn) {
  return this.dropRepeats().value(fn);
}

/**
 * Removes the Signal from the Signal graph.
 *
 * @name close
 * @method
 * @memberof Frampton.Signal.Signal#
 */
function close() {

  const sig = this;

  sig._children.forEach((child) => {
    child._parents = child._parents.filter((parent) => {
      return parent._id !== sig._id;
    });
  });

  sig._parents.forEach((parent) => {
    parent._children = parent._children.filter((child) => {
      return child._id !== sig._id;
    });
  });

  sig._children.length = 0;
  sig._parents.length = 0;
}

/**
 * Logs the values of a given signal to the console.
 *
 * @name logValue
 * @method
 * @memberof Frampton.Signal.Signal#
 * @returns {Frampton.Signal.Signal}
 */
function logValue(msg) {
  const parent = this;
  return createSignal((self) => {
    if (msg) {
      log(msg);
    } else {
      log(parent._value);
    }
    self.push(parent._value);
  }, [parent], parent._value);
}

/**
 * @name createSignal
 * @memberof Frampton.Signal
 * @method
 * @private
 * @param {function}                 update  - Function to call when this signal updates
 * @param {Frampton.Signal.Signal[]} parents - List of signals this signal depends on
 * @param {*}                        initial - Initial value for this signal
 * @returns {Frampton.Signal.Signal}
 */
export function createSignal(update, parents, initial) {

  const signal = {};

  signal.push = (val) => {
    updateValue(signal, val);
  };

  signal.get = () => {
    return signal._value;
  };

  // Constructor
  signal.ctor = 'Frampton.Signal';

  // Private
  signal._id = guid();
  signal._value = initial;
  signal._hasValue = isDefined(initial);
  signal._queued = false;
  signal._updater = null;
  signal._parents = (parents || []);
  signal._children = [];
  signal._update = (update || noop);

  // Public
  signal.debounce = debounce;
  signal.delay = delay;
  signal.ap = ap;
  signal.merge = merge;
  signal.map = map;
  signal.filter = filter;
  signal.filterPrevious = filterPrevious;
  signal.and = and;
  signal.not = not;
  signal.fold = fold;
  signal.sample = sample;
  signal.take = take;
  signal.dropRepeats = dropRepeats;
  signal.log = logValue;
  signal.next = next;
  signal.value = value;
  signal.changes = changes;
  signal.close = close;
  signal.toString = toString;

  for (let i=0;i<signal._parents.length;i++) {
    signal._parents[i]._children.push(signal);
  }

  return Object.seal(signal);
}

/**
 * @name mergeMany
 * @memberof Frampton.Signal
 * @method
 * @param {Frampton.Signal.Signal[]} parents - Signals to merge
 */
export function mergeMany(parents) {
  const initial = ((parents.length > 0) ? parents[0]._value : undefined);
  return createSignal((self) => {
    self.push(self._updater._value);
  }, parents, initial);
}

/**
 * Used to create new instances of Frampton.Signal. This should be used instead of calling
 * the Signal constructor directly.
 *
 * @name create
 * @memberof Frampton.Signal
 * @method
 * @param {*} [initial] - Initial value for this signal
 * @returns {Frampton.Signal}
 */
export default function create(initial) {
  return createSignal(null, null, initial);
}
