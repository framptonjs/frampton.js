import {
  apply,
  guid,
  identity,
  isEqual,
  isFunction,
  isUndefined,
  log,
  noop,
  ofValue
} from 'frampton-utils';

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

function EventStream(seed, transform) {
  this._id        = guid();
  this.seed       = seed || noop;
  this.transform  = transform || identity;
  this.dispatcher = new Dispatcher(this);
  this.cleanup    = null;
  this.isClosed   = false;
}

/**
 * @name push
 * @memberOf EventStream
 */
EventStream.prototype.push = function EventStream_push(event) {
  try {
    if (!this.isClosed) {
      this.dispatcher.push(this.transform(event));
    }
  } catch(e) {
    if (Frampton.ENV.MODE === Frampton.DEV) {
      log('error: ', e);
    }
    this.dispatcher.push(errorEvent(e.message));
  }
};

// Gets raw event, including empty events discarded by filter actions
EventStream.prototype.subscribe = function EventStream_subscribe(fn) {
  return this.dispatcher.subscribe(fn);
};

// Gets next value
EventStream.prototype.next = function EventStream_next(fn) {
  return this.subscribe(function(event) {
    if (event.isNext()) {
      fn(event.get());
    }
  });
};

// Gets next error
EventStream.prototype.error = function EventStream_error(fn) {
  return this.subscribe(function(event) {
    if (event.isError()) {
      fn(event.get());
    }
  });
};

// Get done event
EventStream.prototype.done = function EventStream_done(fn) {
  return this.subscribe(function(event) {
    if (event.isEnd()) {
      fn(event.get());
    }
  });
};

/**
 * @name close
 * @memberOf EventStream
 */
EventStream.prototype.close = function EventStream_close() {
  if (!this.isClosed) {
    this.push(endEvent());
    this.isClosed = true;
    // Tell the dispatcher to remove subscribers.
    this.dispatcher.destroy();
    this.dispatcher = null;
  }
};

// join :: EventStream ( EventStream a ) -> EventStream a
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

// chain(>>=) :: EventStream a -> (a -> EventStream b) -> EventStream b
EventStream.prototype.chain = function EventStream_chain(fn) {
  return this.map(fn).join();
};

// recover :: EventStream a -> (err -> EventStream b) -> EventStream b
EventStream.prototype.recover = function EventStream_chain(fn) {
  return this.mapError(fn).join();
};

// chainLatest :: EventStream a -> (a -> EventStream b) -> EventStream b
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

// ap(<*>) :: EventStream (a -> b) -> EventStream a -> EventStream b
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

// map :: EventStream a -> (a -> b) -> EventStream b
EventStream.prototype.map = function EventStream_map(mapping) {
  var mappingFn = isFunction(mapping) ? mapping : ofValue(mapping);
  return withTransform(this, (event) => {
    return event.map(mappingFn);
  });
};

// mapError :: EventStream a -> (err -> b) -> EventStream b
EventStream.prototype.mapError = function EventStream_map(mapping) {
  var mappingFn = isFunction(mapping) ? mapping : ofValue(mapping);
  return withTransform(this, (event) => {
    return event.recover(mappingFn);
  });
};

// filter :: EventStream a -> (a -> Bool) -> EventStream a
EventStream.prototype.filter = function EventStream_filter(predicate) {
  var filterFn = isFunction(predicate) ? predicate : isEqual(predicate);
  return withTransform(this, (event) => {
    return event.filter(filterFn);
  });
};

// scan :: EventStream a -> (a -> b) -> Behavior b
EventStream.prototype.scan = function(initial, fn) {
  return stepper(initial, this.map(fn));
};

// sample :: EventStream a -> Behavior b -> EventStream b
EventStream.prototype.sample = function(behavior) {
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

// fold :: EventStream a -> (a -> s -> s) -> s -> EventStream s
EventStream.prototype.fold = function(fn, acc) {
  return withTransform(this, (event) => {
    acc = (isUndefined(acc)) ? event.get() : fn(acc, event.get());
    return nextEvent(acc);
  });
};

// take :: EventStream a -> Number n -> EventStream a
EventStream.prototype.take = function(limit) {

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
 * Merges a stream with the current stream and returns a new stream
 *
 * @name merge
 * @method
 * @memberOf EventStream
 * @instance
 * @param {Object} stream - stream to merge with current stream
 * @returns {EventStream} A new EventStream
 */
EventStream.prototype.merge = function Stream_merge(stream) {
  return fromMerge(this, stream);
};

/**
 * zip :: EventStream a -> Behavior b -> EventStream [a,b]
 *
 * @name zip
 * @method
 * @memberOf EventStream
 * @instance
 * @param {Behavior} behavipr - The EventStream to zip with the current EventStream.
 * @returns {EventStream} A new EventStream.
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

// debounce :: EventStream a -> Number -> EventStream a
EventStream.prototype.debounce = function EventStream_debounce(delay) {

  var source   = this;
  var timerId  = null;
  var saved    = null;
  var breakers = [];

  return new EventStream((sink) => {

    breakers.push(source.subscribe((event) => {
      if (event.isNext()) {
        saved = event.get();

        if (timerId) {
          clearTimeout(timerId);
        }

        timerId = setTimeout(() => {
          sink(nextEvent(saved));
          saved = null;
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
      saved = null;
      source = null;
    };
  });
};

/**
 * throttle :: EventStream a -> Number -> EventStream a
 *
 * @name throttle
 * @method
 * @memberOf EventStream
 * @instance
 * @param {Number} delay - Time (milliseconds) to delay each update on the stream.
 * @returns {EventStream} A new Stream with the delay applied.
 */
EventStream.prototype.throttle = function EventStream_throttle(delay) {

  var source   = this;
  var timer    = null;
  var saved    = null;
  var breakers = [];

  return new EventStream((sink) => {

    function applyTimeout() {

      return setTimeout(function() {

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

// dropRepeats :: EventStream a -> EventStream a
EventStream.prototype.dropRepeats = function EventStream_dropRepeats() {
  var prevVal = null;
  return this.filter((val) => {
    if (val !== prevVal) {
      prevVal = val;
      return true;
    }
    return false;
  });
};

// and :: EventStream a -> Behavior b -> EventStream a
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

// not :: EventStream a -> Behavior b -> EventStream a
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

EventStream.prototype.log = function EventStream_log() {
  return withTransform(this, (event) => {
    log(event.get());
    return event;
  });
};

var isEventStream = function(obj) {
  return (obj instanceof EventStream);
};

export default EventStream;

export {
  fromMerge as merge,
  isEventStream
};