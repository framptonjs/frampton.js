import apply from 'frampton-utils/apply';
import guid from 'frampton-utils/guid';
import identity from 'frampton-utils/identity';
import isEqual from 'frampton-utils/is_equal';
import isFunction from 'frampton-utils/is_function';
import isUndefined from 'frampton-utils/is_undefined';
import log from 'frampton-utils/log';
import noop from 'frampton-utils/noop';
import ofValue from 'frampton-utils/of_value';

import {
  errorEvent,
  nextEvent,
  endEvent
} from 'frampton-signals/event';

import stepper from 'frampton-signals/stepper';
import Dispatcher from 'frampton-signals/dispatcher';

// Creates a new stream with a given transform.
function withTransform(source, transform) {
  return new EventStream((sink) => {
    return source.subscribe((event) => {
      sink(event);
    });
  }, transform);
}

function fromMerge(...streams) {

  var breakers = [];

  return new EventStream((sink) => {

    streams.forEach((source) => {
      breakers.push(source.subscribe((event) => {
        sink(event);
      }));
    });

    return function merge_cleanup() {
      breakers.forEach(apply);
      breakers = null;
      streams = null;
    };

  });
}

/**
 * @name EventStream
 * @alias EventStream
 * @class
 * @memberof Frampton.Signals
 * @param {Function} seed      A function to seed values to the EventStream
 * @param {Function} transform A function to transform values on the EventStream
 */
function EventStream(seed, transform) {
  this._id        = guid();
  this.seed       = seed || noop;
  this.transform  = transform || identity;
  this.dispatcher = new Dispatcher(this);
  this.cleanup    = null;
  this.isClosed   = false;
}

/**
 * Push a new Event onto the EventStream
 * @name push
 * @memberof Frampton.Signals.EventStream#
 * @method
 * @param {Event} event A new Event to put on the stream
 */
EventStream.prototype.push = function EventStream_push(event) {
  try {
    if (!this.isClosed) {
      this.dispatcher.push(this.transform(event));
    }
  } catch(e) {
    log('error: ', e);
    this.dispatcher.push(errorEvent(e.message));
  }
};

/**
 * Push a new value onto the EventStream, wrapping it in an Event object
 *
 * @name pushNext
 * @method
 * @memberof Frampton.Signals.EventStream#
 * @param {*} val A new value to put on the stream
 */
EventStream.prototype.pushNext = function EventStream_pushNext(val) {
  this.push(nextEvent(val));
};

/**
 * Push a new error onto the EventStream, wrapping it in an Event object
 *
 * @name pushError
 * @method
 * @memberof Frampton.Signals.EventStream#
 * @param {String} err A new error message to put on the stream
 */
EventStream.prototype.pushError = function EventStream_pushError(err) {
  this.push(errorEvent(err));
};

/**
 * Gets raw event, including empty events discarded by filter actions
 *
 * @name subscribe
 * @method
 * @memberof Frampton.Signals.EventStream#
 * @param {Function} fn A function to call when there's a new Event on the stream
 * @returns {Function} A function to unsubscribe
 */
EventStream.prototype.subscribe = function EventStream_subscribe(fn) {
  return this.dispatcher.subscribe(fn);
};

/**
 * Registers a callback for the next value on the stream
 *
 * @name next
 * @method
 * @memberof Frampton.Signals.EventStream#
 * @param {Function} fn   Function to call when there is a value
 * @returns {Function} A function to unsubscribe from the EventStream
 */
EventStream.prototype.next = function EventStream_next(fn) {
  return this.subscribe(function(event) {
    if (event.isNext()) {
      fn(event.get());
    }
  });
};

/**
 * Registers a callback for errors on the stream
 *
 * @name error
 * @method
 * @memberof Frampton.Signals.EventStream#
 * @param {Function} fn   Function to call when there is an error
 * @returns {Function} A function to unsubscribe from the EventStream
 */
EventStream.prototype.error = function EventStream_error(fn) {
  return this.subscribe(function(event) {
    if (event.isError()) {
      fn(event.get());
    }
  });
};

/**
 * Registers a callback for when the stream closes
 *
 * @name next
 * @method
 * @memberof Frampton.Signals.EventStream#
 * @param {Function} fn   Function to call when the stream closes
 * @returns {Function} A function to unsubscribe from the EventStream
 */
EventStream.prototype.done = function EventStream_done(fn) {
  return this.subscribe(function(event) {
    if (event.isEnd()) {
      fn(event.get());
    }
  });
};

/**
 * Closes the stream by removing all subscribers and calling cleanup function (if any)
 *
 * @name close
 * @method
 * @memberof Frampton.Signals.EventStream#
 */
EventStream.prototype.close = function EventStream_close() {
  if (!this.isClosed) {
    this.push(endEvent());
    this.isClosed = true;
    this.dispatcher.destroy();
    this.dispatcher = null;
  }
};

/**
 * join :: EventStream ( EventStream a ) -> EventStream a
 *
 * Given an EventStream of an EventStream it will remove one layer of nesting.
 *
 * @name join
 * @method
 * @memberof Frampton.Signals.EventStream#
 * @returns {Frampton.Signals.EventStream} A new EventStream with a level of nesting removed
 */
EventStream.prototype.join = function EventStream_join() {

  var source = this;
  var breakers = [];

  return new EventStream((sink) => {

    breakers.push(source.subscribe((event) => {
      if (event.isNext()) {
        breakers.push(event.get().subscribe((event) => {
          sink(event);
        }));
      } else {
        sink(event);
      }
    }));

    return function chain_cleanup() {
      breakers.forEach(apply);
      breakers = null;
      source = null;
    };
  });
};

/**
 * concat(>>) :: EventStream a -> EventStream b -> EventStream b
 *
 * @name concat
 * @method
 * @memberof Frampton.Signals.EventStream#
 * @param {Frampton.Signals.EventStream} stream
 * @returns {Frampton.Signals.EventStream}
 */
EventStream.prototype.concat = function EventStream_concat(stream) {

  var source = this;
  var breakers = [];

  return new EventStream((sink) => {

    breakers.push(source.next((_) => {
      breakers.push(stream.next((val) => {
        sink(nextEvent(val));
      }));
    }));

    return function concat_cleanup() {
      breakers.forEach(apply);
      breakers = null;
    };
  });
};

/**
 * chain(>>=) :: EventStream a -> (a -> EventStream b) -> EventStream b
 *
 * Given a function that returns an EventStream this will create a new EventStream
 * that passes the value of the parent EventStream to the function and returns the value
 * of the nested EventStream
 *
 * @name chain
 * @method
 * @memberof Frampton.Signals.EventStream#
 * @param {Function} fn   A function that returns an EventStream
 * @returns {Frampton.Signals.EventStream} A new EventStream with a level of nesting removed
 */
EventStream.prototype.chain = function EventStream_chain(fn) {
  return this.map(fn).join();
};

/**
 * chainLatest :: EventStream a -> (a -> EventStream b) -> EventStream b
 *
 * @name chainLatest
 * @method
 * @memberof Frampton.Signals.EventStream#
 * @param {Function} fn   A function that returns an EventStream
 * @returns {Frampton.Signals.EventStream}
 */
EventStream.prototype.chainLatest = function EventStream_chainLatest(fn) {

  var source      = this;
  var innerStream = null;
  var breakers    = [];

  return new EventStream((sink) => {

    breakers.push(source.subscribe((event) => {

      if (event.isNext()) {

        if (innerStream) {
          innerStream.close();
          innerStream = null;
        }

        innerStream = fn(event.get());
        innerStream.subscribe((event) => {
          sink(event);
        });

      } else {
        sink(event);
      }

    }));

    return function chainLatest_cleanup() {
      if (innerStream) {
        innerStream.close();
        innerStream = null;
      }
      breakers.forEach(apply);
      breakers = null;
      source = null;
    };
  });
};

/**
 * ap(<*>) :: EventStream (a -> b) -> EventStream a -> EventStream b
 *
 * @name ap
 * @method
 * @memberof Frampton.Signals.EventStream#
 * @param {Frampton.Signals.EventStream} stream
 * @returns {Frampton.Signals.EventStream}
 */
EventStream.prototype.ap = function EventStream_ap(stream) {

  var source = this;
  var breakers = [];

  return new EventStream((sink) => {

    var fn = identity;

    breakers.push(source.subscribe((event) => {
      if (event.isNext()) {
        fn = event.get();
      }
    }));

    breakers.push(stream.subscribe((event) => {
      if (event.isNext()) {
        sink(nextEvent(fn(event.get())));
      } else {
        sink(event);
      }
    }));

    return function ap_cleanup() {
      breakers.forEach(apply);
      breakers = null;
      source = null;
    };
  });
};

/**
 * map :: EventStream a -> (a -> b) -> EventStream b
 *
 * @name map
 * @method
 * @memberof Frampton.Signals.EventStream#
 * @param {Function} mapping A function to transform values on the stream
 * @returns {Frampton.Signals.EventStream}
 */
EventStream.prototype.map = function EventStream_map(mapping) {
  var mappingFn = isFunction(mapping) ? mapping : ofValue(mapping);
  return withTransform(this, (event) => {
    return event.map(mappingFn);
  });
};

/**
 * recover :: EventStream a -> (err -> a) -> EventStream a
 *
 * @name recover
 * @method
 * @memberof! EventStream.prototype
 * @param {Function} mapping A function to map an error to a value
 * @returns {Frampton.Signals.EventStream}
 */
EventStream.prototype.recover = function EventStream_recover(mapping) {
  var mappingFn = isFunction(mapping) ? mapping : ofValue(mapping);
  return withTransform(this, (event) => {
    return event.recover(mappingFn);
  });
};

/**
 * filter :: EventStream a -> (a -> Bool) -> EventStream a
 *
 * @name filter
 * @method
 * @memberof Frampton.Signals.EventStream#
 * @param {Function} predicate A function to filter values on the stream
 * @returns {Frampton.Signals.EventStream}
 */
EventStream.prototype.filter = function EventStream_filter(predicate) {
  var filterFn = isFunction(predicate) ? predicate : isEqual(predicate);
  return withTransform(this, (event) => {
    return event.filter(filterFn);
  });
};

/**
 * filterJust :: EventStream Maybe a -> EventStream a
 *
 * @name filterJust
 * @method
 * @memberof Frampton.Signals.EventStream#
 * @returns {Frampton.Signals.EventStream}
 */
EventStream.prototype.filterJust = function EventStream_filterJust() {
  return this.filter((val) => {
    return (isFunction(val.isJust) && val.isJust());
  });
};

/**
 * dropRepeats :: EventStream a -> EventStream a
 *
 * @name dropRepeats
 * @method
 * @memberof Frampton.Signals.EventStream#
 * @returns {Frampton.Signals.EventStream}
 */
EventStream.prototype.dropRepeats = function EventStream_dropRepeats() {
  var saved;
  return this.filter((val) => {
    if (val !== saved) {
      saved = val;
      return true;
    }
    return false;
  });
};

/**
 * scan :: EventStream a -> b -> (a -> b) -> Behavior b
 * @name scan
 * @method
 * @memberof Frampton.Signals.EventStream#
 * @param {*} initial An initial value for the returned Behavior
 * @param {Function} mapping A function to map values on the stream before giving them to Behavior
 * @returns {Frampton.Signals.Behavior}
 */
EventStream.prototype.scan = function EventStream_scan(initial, mapping) {
  return stepper(initial, this.map(mapping));
};

/**
 * sample :: EventStream a -> Behavior b -> EventStream b
 * @name sample
 * @method
 * @memberof Frampton.Signals.EventStream#
 * @param {Frampton.Signals.Behavior} behavior
 * @returns {Frampton.Signals.EventStream}
 */
EventStream.prototype.sample = function EventStream_sample(behavior) {
  var source = this;
  var breakers = [];
  return new EventStream((sink) => {
    breakers.push(source.subscribe((event) => {
      if (event.isNext()) {
        sink(nextEvent(behavior.value));
      } else {
        sink(event);
      }
    }));
    return function sample_cleanup() {
      breakers.forEach(apply);
      breakers = null;
      source = null;
    };
  });
};

/**
 * fold :: EventStream a -> (a -> s -> s) -> s -> EventStream s
 * @name fold
 * @method
 * @memberof Frampton.Signals.EventStream#
 * @param {Function} fn  A function to reduce values on the stream
 * @param {*}        acc An initial value for the fold
 * @returns {Frampton.Signals.EventStream}
 */
EventStream.prototype.fold = function EventStream_fold(fn, acc) {
  return withTransform(this, (event) => {
    if (event.isNext()) {
      acc = (isUndefined(acc)) ? event.get() : fn(acc, event.get());
      return nextEvent(acc);
    } else {
      return event;
    }
  });
};

/**
 * withPrevious :: EventStream a -> EventStream a
 * @name withPrevious
 * @method
 * @memberof Frampton.Signals.EventStream#
 * @param {Number} [limit=2] Number of previous values to save
 * @returns {Frampton.Signals.EventStream}
 */
EventStream.prototype.withPrevious = function EventStream_withPrevious(limit) {
  return this.fold((acc, next) => {
    if (acc.length >= (limit || 2)) acc.shift();
    acc.push(next);
    return acc;
  }, []);
};

/**
 * take :: EventStream a -> Number n -> EventStream a
 * @name take
 * @method
 * @memberof Frampton.Signals.EventStream#
 */
EventStream.prototype.take = function EventStream_take(limit) {

  var source = this;
  var breaker = null;

  return new EventStream(function(sink) {

    var stream = this;

    breaker = source.subscribe((event) => {
      if (event.isNext()) {
        if (limit > 0) {
          limit = limit - 1;
          sink(event);
        } else {
          stream.close();
        }
      } else {
        sink(event);
      }
    });

    return function take_cleanup() {
      breaker();
      breaker = null;
      source = null;
    };
  });
};

/**
 * takeWhile :: EventStream a -> (a -> Boolean) -> EventStream a
 * @name takeWhile
 * @method
 * @memberof Frampton.Signals.EventStream#
 */
EventStream.prototype.takeWhile = function EventStream_takeWhile(predicate) {

  var source = this;
  var breaker = null;

  return new EventStream(function take_while_seed(sink) {

    var stream = this;

    breaker = source.subscribe((event) => {
      if (event.isNext()) {
        if (predicate(event.get())) {
          sink(event);
        } else {
          stream.close();
        }
      } else {
        sink(event);
      }
    });

    return function takeWhile_cleanup() {
      breaker();
      breaker = null;
      source = null;
    };
  });
};

/**
 * @name first
 * @method
 * @memberof Frampton.Signals.EventStream#
 * @returns {Frampton.Signals.EventStream} A new EventStream
 */
EventStream.prototype.first = function EventStream_first() {
  return this.take(1);
};

/**
 * Skips the first n number of values on the stream.
 *
 * @name skip
 * @method
 * @memberof Frampton.Signals.EventStream#
 * @param {Frampton.Signals.EventStream} number - Number of values to skip.
 * @returns {Frampton.Signals.EventStream} A new EventStream
 */
EventStream.prototype.skip = function EventStream_skip(number) {

  var source = this;
  var breaker = null;

  return new EventStream(function(sink) {

    breaker = source.subscribe((event) => {
      if (event.isNext()) {
        if ((number--) === 0) {
          sink(event);
        }
      } else {
        sink(event);
      }
    });

    return function take_cleanup() {
      breaker();
      breaker = null;
      source = null;
    };
  });
};

/**
 * Merges a stream with the current stream and returns a new stream
 *
 * @name merge
 * @method
 * @memberof Frampton.Signals.EventStream#
 * @param {Object} stream - stream to merge with current stream
 * @returns {Frampton.Signals.EventStream} A new EventStream
 */
EventStream.prototype.merge = function Stream_merge(stream) {
  return fromMerge(this, stream);
};

/**
 * zip :: EventStream a -> Behavior b -> EventStream [a,b]
 *
 * @name zip
 * @method
 * @memberof Frampton.Signals.EventStream#
 * @param {Frampton.Signals.Behavior} behavipr - The EventStream to zip with the current EventStream.
 * @returns {Frampton.Signals.EventStream} A new EventStream.
 */
EventStream.prototype.zip = function Stream_zip(behavior) {

  var source   = this;
  var breakers = [];

  return new EventStream((sink) => {

    breakers.push(source.subscribe((event) => {
      if (event.isNext()) {
        sink(nextEvent([event.get(), behavior.value]));
      } else {
        sink(event);
      }
    }));

    return function break_zip() {
      breakers.forEach(apply);
      breakers = null;
      source = null;
    };
  });
};

/**
 * debounce :: EventStream a -> Number -> EventStream a
 * @name debounce
 * @method
 * @memberof Frampton.Signals.EventStream#
 */
EventStream.prototype.debounce = function EventStream_debounce(delay) {

  var source   = this;
  var timerId  = null;
  var breakers = [];

  return new EventStream((sink) => {

    breakers.push(source.subscribe((event) => {

      if (event.isNext()) {

        if (timerId) clearTimeout(timerId);

        timerId = setTimeout(() => {
          sink(nextEvent(event.get()));
          timerId = null;
        }, delay);
      } else {
        sink(event);
      }
    }));

    return function debounce_cleanup() {
      if (timerId) {
        clearTimeout(timerId);
        timerId = null;
      }
      breakers.forEach(apply);
      breakers = null;
      source = null;
    };
  });
};

/**
 * throttle :: EventStream a -> Number -> EventStream a
 *
 * @name throttle
 * @method
 * @memberof Frampton.Signals.EventStream#
 * @param {Number} delay - Time (milliseconds) to delay each update on the stream.
 * @returns {Frampton.Signals.EventStream} A new Stream with the delay applied.
 */
EventStream.prototype.throttle = function EventStream_throttle(delay) {

  var source   = this;
  var timer    = null;
  var saved    = null;
  var breakers = [];

  return new EventStream((sink) => {

    function applyTimeout() {

      return setTimeout(() => {

        timer = null;

        if (saved) {
          sink(nextEvent(saved));
          saved = null;
        }

      }, delay);
    }

    breakers.push(source.subscribe((event) => {

      if (event.isNext()) {
        saved = event.get();
        timer = (timer !== null) ? timer : applyTimeout();
      } else {
        sink(event);
      }

    }));

    return function throttle_cleanup() {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      breakers.forEach(apply);
      breakers = null;
      saved = null;
      source = null;
    };
  });
};

/**
 * and :: EventStream a -> Behavior b -> EventStream a
 *
 * @name and
 * @method
 * @memberof Frampton.Signals.EventStream#
 * @param {Frampton.Signals.Behavior} behavior - A behavior to test against
 * @returns {Frampton.Signals.EventStream} A new EventStream that only produces values if the behavior is truthy.
 */
EventStream.prototype.and = function(behavior) {

  var source   = this;
  var breakers = [];

  return new EventStream((sink) => {

    breakers.push(source.subscribe((event) => {

      if (event.isNext()) {
        if (behavior.value) {
          sink(event);
        }
      } else {
        sink(event);
      }

    }));

    return function and_cleanup() {
      breakers.forEach(apply);
      breakers = null;
      source = null;
    };
  });
};

/**
 * not :: EventStream a -> Behavior b -> EventStream a
 *
 * @name not
 * @method
 * @memberof Frampton.Signals.EventStream#
 * @param {Frampton.Signals.Behavior} behavior - A behavior to test against
 * @returns {Frampton.Signals.EventStream} A new EventStream that only produces values if the behavior is falsy.
 */
EventStream.prototype.not = function(behavior) {

  var source   = this;
  var breakers = [];

  return new EventStream((sink) => {

    breakers.push(source.subscribe((event) => {

      if (event.isNext()) {
        if (!behavior.value) {
          sink(event);
        }
      } else {
        sink(event);
      }

    }));

    return function not_cleanup() {
      breakers.forEach(apply);
      breakers = null;
      source = null;
    };
  });
};

/**
 * preventDefault :: EventStream DomEvent
 *
 * @name preventDefault
 * @method
 * @memberof Frampton.Signals.EventStream#
 * @returns {Frampton.Signals.EventStream}
 */
EventStream.prototype.preventDefault = function EventStream_preventDefault() {
  return withTransform(this, (event) => {
    return event.map((evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      return evt;
    });
  });
};

/**
 * log :: EventStream a
 *
 * @name log
 * @method
 * @memberof Frampton.Signals.EventStream#
 * @returns {Frampton.Signals.EventStream} A new EventStream that logs its values to the console.
 */
EventStream.prototype.log = function EventStream_log(msg) {
  return withTransform(this, (event) => {
    if (msg) {
      log(msg, event.get());
    } else {
      log(event.get());
    }
    return event;
  });
};

var isEventStream = function is_event_stream(obj) {
  return (obj instanceof EventStream);
};

export default EventStream;

export {
  fromMerge as merge,
  isEventStream
};