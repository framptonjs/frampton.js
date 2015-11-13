(function() {
/*globals Frampton:true */
var define, require;
var global = this;

/**

This loader code is taken from the guys over at Ember
https://github.com/emberjs/ember.js/

Copyright (c) 2015 Yehuda Katz, Tom Dale and Ember.js contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/
(function() {

  if (typeof Frampton === 'undefined') {
    Frampton = {};
  };

  if (typeof Frampton.__loader === 'undefined') {

    var registry = {},
        seen     = {};

    define = function(name, deps, callback) {

      var value = {};

      if (!callback) {
        value.deps = [];
        value.callback = deps;
      } else {
        value.deps = deps;
        value.callback = callback;
      }

      registry[name] = value;
    };

    require = function(name) {
      return internalRequire(name, null);
    };

    function internalRequire(name, referrerName) {

      var exports = seen[name];
          module  = {};

      if (exports !== undefined) {
        return exports;
      }

      exports = {};
      module.exports = exports;

      if (!registry[name]) {
        if (referrerName) {
          throw new Error('Could not find module ' + name + ' required by: ' + referrerName);
        } else {
          throw new Error('Could not find module ' + name);
        }
      }

      var mod      = registry[name],
          deps     = mod.deps,
          callback = mod.callback,
          reified  = [],
          len      = deps.length,
          i        = 0;

      for (; i<len; i++) {
        if (deps[i] === 'exports') {
          reified.push(exports);
        } else if (deps[i] === 'module') {
          reified.push(module);
        } else {
          reified.push(internalRequire(resolve(deps[i], name), name));
        }
      }

      callback.apply(this, reified);

      seen[name] = (reified[1] && reified[1].exports) ? reified[1].exports : reified[0];

      return seen[name];
    };

    function resolve(child, name) {

      if (child.charAt(0) !== '.') {
        return child;
      }

      var parts      = child.split('/'),
          parentBase = name.split('/').slice(0, -1),
          len        = parts.length,
          i          = 0;

      for (; i < len; i++) {

        var part = parts[i];

        if (part === '..') {
          parentBase.pop();
        } else if (part === '.') {
          continue;
        } else {
          parentBase.push(part);
        }
      }

      return parentBase.join('/');
    }

    Frampton.__loader = {
      define: define,
      require: require,
      registry: registry
    };

  } else {
    define = Frampton.__loader.define;
    require = Frampton.__loader.require;
  }

}());
define('frampton-cache', ['exports', 'frampton/namespace', 'frampton-cache/Cache'], function (exports, _framptonNamespace, _framptonCacheCache) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Frampton = _interopRequire(_framptonNamespace);

  var _Cache = _interopRequire(_framptonCacheCache);

  _Frampton.Cache = _Cache;
});
define('frampton-cache/cache', ['exports', 'module', 'frampton-utils/extend', 'frampton-utils/is_nothing'], function (exports, module, _framptonUtilsExtend, _framptonUtilsIs_nothing) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _extend = _interopRequire(_framptonUtilsExtend);

  var _isNothing = _interopRequire(_framptonUtilsIs_nothing);

  var defaults = {
    LIMIT: 1000,
    TIMEOUT: 5 * 60 * 1000 // 5 minutes
  };

  function currentTime() {
    return new Date().getTime();
  }

  function isExpired(entry, timeout) {
    return currentTime() - entry.timestamp > timeout;
  }

  // Takes two entries and bidirectionally links them.
  function linkEntries(prevEntry, nextEntry) {

    if (nextEntry === prevEntry) return;

    if (nextEntry) {
      nextEntry.prev = prevEntry || null;
    }

    if (prevEntry) {
      prevEntry.next = nextEntry || null;
    }
  }

  // update the counter to keep track of most popular cached items.
  function updateCounter(entry) {
    entry.counter = entry.counter + 1;
  }

  // takes an entry and makes it the head of the linked list
  function makeHead(entry, head, tail) {

    if (entry === head) return;

    if (!tail) {
      tail = entry;
    } else if (tail === entry) {
      tail = entry.prev;
    }

    linkEntries(entry.prev, entry.next);
    linkEntries(entry, head);

    head = entry;
    head.prev = null;
  }

  /**
   * Simple cache that removes items based on least recently used (LRU).
   *
   * @name Cache
   * @memberof Frampton
   * @class
   * @param {Object} options - A hash of options to configure the cache. Currently only supports
   * LIMIT (the max number of items in cache) and TIMEOUT (how long an entry should be valid).
   */
  function Cache(options) {

    this.store = {};
    this.config = {};
    this.size = 0;
    this.head = null;
    this.tail = null;

    (0, _extend)(this.config, defaults, options);
  }

  /**
   * Gets a value with the given key. It the key is expired, or doens't exist,
   * it uses the function to populate the value.
   *
   * @name get
   * @memberof Cache
   * @method
   * @instance
   * @param {String} key Key lookup in the cache
   * @param {Function} fn Funtion to generate value if not available
   */
  Cache.prototype.get = function Cache_get(key, fn) {

    if (this.store[key]) {

      // if we have a key but it's expired, blow the mother up.
      if (isExpired(this.store[key], this.config.TIMEOUT)) {
        this.remove(key);
        return this.put(key, fn());
      }

      // otherwise, yeah b@$%#!, let's return the value and get moving.
      makeHead(this.store[key], this.head, this.tail);
      updateCounter(this.store[key]);
      return this.store[key].value;
    }

    return this.put(key, fn());
  };

  /**
   * Assigns a value to a given key.
   *
   * @name put
   * @memberof Cache
   * @method
   * @instance
   */
  Cache.prototype.put = function Cache_put(key, value) {

    if ((0, _isNothing)(key) || (0, _isNothing)(value)) return;

    if (!this.store[key]) {

      this.size = this.size + 1;
      this.store[key] = {
        key: key,
        value: value,
        next: null,
        prev: null,
        timestamp: currentTime(),
        counter: 1
      };
    } else {
      this.store[key].value = value;
      this.store[key].timestamp = currentTime();
      updateCounter(this.store[key]);
    }

    makeHead(this.store[key], this.head, this.tail);

    if (this.size > this.config.LIMIT) {
      this.remove(this.tail.key);
    }

    return value;
  };

  /**
   * Removes the value with the given key.
   *
   * @name remove
   * @memberof Cache
   * @method
   * @instance
   */
  Cache.prototype.remove = function Cache_remove(key) {

    var entryToRemove;

    if ((0, _isNothing)(this.store[key])) return;

    entryToRemove = this.store[key];

    if (entryToRemove === this.head) {
      this.head = entryToRemove.next;
    }

    if (entryToRemove === this.tail) {
      this.tail = entryToRemove.tail;
    }

    linkEntries(entryToRemove.prev, entryToRemove.next);

    delete this.store[key];

    this.size = this.size - 1;
  };

  /**
   * @name isCache
   * @memberof Cache
   * @static
   * @param {Object} obj Object to test.
   * @return {Boolean} Is the object an instance of Cache?
   */
  Cache.isCache = function Cache_isCache(obj) {
    return obj instanceof Cache;
  };

  module.exports = Cache;
});
define('frampton-events', ['exports', 'frampton/namespace', 'frampton-events/listen', 'frampton-events/contains', 'frampton-events/event_target', 'frampton-events/event_value', 'frampton-events/get_position', 'frampton-events/get_position_relative', 'frampton-events/has_selector', 'frampton-events/contains_selector', 'frampton-events/selector_contains', 'frampton-events/closest_to_event'], function (exports, _framptonNamespace, _framptonEventsListen, _framptonEventsContains, _framptonEventsEvent_target, _framptonEventsEvent_value, _framptonEventsGet_position, _framptonEventsGet_position_relative, _framptonEventsHas_selector, _framptonEventsContains_selector, _framptonEventsSelector_contains, _framptonEventsClosest_to_event) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Frampton = _interopRequire(_framptonNamespace);

  var _contains = _interopRequire(_framptonEventsContains);

  var _eventTarget = _interopRequire(_framptonEventsEvent_target);

  var _eventValue = _interopRequire(_framptonEventsEvent_value);

  var _getPosition = _interopRequire(_framptonEventsGet_position);

  var _getPositionRelative = _interopRequire(_framptonEventsGet_position_relative);

  var _hasSelector = _interopRequire(_framptonEventsHas_selector);

  var _containsSelector = _interopRequire(_framptonEventsContains_selector);

  var _selectorContains = _interopRequire(_framptonEventsSelector_contains);

  var _closestToEvent = _interopRequire(_framptonEventsClosest_to_event);

  /**
   * @name Events
   * @namespace
   * @memberof Frampton
   */
  _Frampton.Events = {};
  _Frampton.Events.listen = _framptonEventsListen.listen;
  _Frampton.Events.onSelector = _framptonEventsListen.onSelector;
  _Frampton.Events.contains = _contains;
  _Frampton.Events.eventTarget = _eventTarget;
  _Frampton.Events.eventValue = _eventValue;
  _Frampton.Events.hasSelector = _hasSelector;
  _Frampton.Events.containsSelector = _containsSelector;
  _Frampton.Events.selectorContains = _selectorContains;
  _Frampton.Events.getPosition = _getPosition;
  _Frampton.Events.getPositionRelative = _getPositionRelative;
  _Frampton.Events.closestToEvent = _closestToEvent;
});
define('frampton-events/closest_to_event', ['exports', 'module', 'frampton-utils/curry', 'frampton-utils/compose', 'frampton-style/closest', 'frampton-events/event_target'], function (exports, module, _framptonUtilsCurry, _framptonUtilsCompose, _framptonStyleClosest, _framptonEventsEvent_target) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _compose = _interopRequire(_framptonUtilsCompose);

  var _closest = _interopRequire(_framptonStyleClosest);

  var _eventTarget = _interopRequire(_framptonEventsEvent_target);

  /**
   * closestToEvent :: String -> DomEvent -> DomNode
   *
   * @name closestToEvent
   * @memberof Frampton.Events
   * @static
   * @param {String} selector
   * @param {Object} evt
   * @returns {Object} A DomNode matching the given selector
   */
  module.exports = (0, _curry)(function closest_to_event(selector, evt) {
    return (0, _compose)((0, _closest)(selector), _eventTarget)(evt);
  });
});
define('frampton-events/contains', ['exports', 'module', 'frampton-utils/curry', 'frampton-utils/compose', 'frampton-html/contains', 'frampton-events/event_target'], function (exports, module, _framptonUtilsCurry, _framptonUtilsCompose, _framptonHtmlContains, _framptonEventsEvent_target) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _compose = _interopRequire(_framptonUtilsCompose);

  var _contains = _interopRequire(_framptonHtmlContains);

  var _eventTarget = _interopRequire(_framptonEventsEvent_target);

  /**
   * contains :: DomNode -> DomEvent -> Boolean
   *
   * @name contains
   * @memberof Frampton.Events
   * @static
   * @param {Object} element
   * @param {Object} evt
   * @returns {Boolean}
   */
  module.exports = (0, _curry)(function curried_contains(element, evt) {
    return (0, _compose)((0, _contains)(element), _eventTarget)(evt);
  });
});
define('frampton-events/contains_selector', ['exports', 'module', 'frampton-utils/curry', 'frampton-utils/compose', 'frampton-style/contains', 'frampton-events/event_target'], function (exports, module, _framptonUtilsCurry, _framptonUtilsCompose, _framptonStyleContains, _framptonEventsEvent_target) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _compose = _interopRequire(_framptonUtilsCompose);

  var _contains = _interopRequire(_framptonStyleContains);

  var _eventTarget = _interopRequire(_framptonEventsEvent_target);

  /**
   * containsSelector :: String -> DomEvent -> Boolean
   *
   * @name containsSelector
   * @static
   * @memberof Frampton.Events
   * @param {String} selector A selector to test
   * @param {Object} evt      An event object whose target will be tested against
   * @returns {Boolean}       Does the event target, or one of its children, have the given selector
   */
  module.exports = (0, _curry)(function contains_selector(selector, evt) {
    return (0, _compose)((0, _contains)(selector), _eventTarget)(evt);
  });
});
define('frampton-events/document_cache', ['exports', 'module', 'frampton-cache/cache'], function (exports, module, _framptonCacheCache) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Cache = _interopRequire(_framptonCacheCache);

  module.exports = new _Cache();
});
define('frampton-events/event_dispatcher', ['exports', 'frampton-utils/assert', 'frampton-utils/is_function', 'frampton-utils/is_defined', 'frampton-utils/lazy', 'frampton-events/event_map'], function (exports, _framptonUtilsAssert, _framptonUtilsIs_function, _framptonUtilsIs_defined, _framptonUtilsLazy, _framptonEventsEvent_map) {
  'use strict';

  exports.__esModule = true;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _assert = _interopRequire(_framptonUtilsAssert);

  var _isFunction = _interopRequire(_framptonUtilsIs_function);

  var _isDefined = _interopRequire(_framptonUtilsIs_defined);

  var _lazy = _interopRequire(_framptonUtilsLazy);

  var _EVENT_MAP = _interopRequire(_framptonEventsEvent_map);

  // get dom event -> filter -> return stream
  function addDomEvent(name, node, callback) {
    node.addEventListener(name, callback, !_EVENT_MAP[name].bubbles);
  }

  function addCustomEvent(name, target, callback) {
    var listen = (0, _isFunction)(target.addEventListener) ? target.addEventListener : (0, _isFunction)(target.on) ? target.on : null;

    (0, _assert)('addListener received an unknown type as target', (0, _isFunction)(listen));

    listen.call(target, name, callback);
  }

  function removeDomEvent(name, node, callback) {
    node.removeEventListener(name, callback, !_EVENT_MAP[name].bubbles);
  }

  function removeCustomEvent(name, target, callback) {
    var remove = (0, _isFunction)(target.removeEventListener) ? target.removeEventListener : (0, _isFunction)(target.off) ? target.off : null;

    (0, _assert)('removeListener received an unknown type as target', (0, _isFunction)(remove));

    remove.call(target, name, callback);
  }

  function addListener(eventName, callback, target) {

    if ((0, _isDefined)(_EVENT_MAP[eventName]) && (0, _isFunction)(target.addEventListener)) {
      addDomEvent(eventName, target, callback);
    } else {
      addCustomEvent(eventName, target, callback);
    }

    return (0, _lazy)(removeListener, eventName, callback, target);
  }

  function removeListener(eventName, callback, target) {
    if ((0, _isDefined)(_EVENT_MAP[eventName]) && (0, _isFunction)(target.removeEventListener)) {
      removeDomEvent(eventName, target, callback);
    } else {
      removeCustomEvent(eventName, target, callback);
    }
  }

  exports.addListener = addListener;
  exports.removeListener = removeListener;
});
define("frampton-events/event_map", ["exports", "module"], function (exports, module) {
  "use strict";

  module.exports = {
    focus: {
      bubbles: false,
      stream: null
    },

    blur: {
      bubbles: false,
      stream: null
    },

    focusin: {
      bubbles: true,
      stream: null
    },

    focusout: {
      bubbles: true,
      stream: null
    },

    input: {
      bubbles: true,
      stream: null
    },

    change: {
      bubbles: true,
      stream: null
    },

    click: {
      bubbles: true,
      stream: null
    },

    mousedown: {
      bubbles: true,
      stream: null
    },

    mouseup: {
      bubbles: true,
      stream: null
    },

    mousemove: {
      bubbles: true,
      stream: null
    },

    mouseenter: {
      bubbles: true,
      stream: null
    },

    mouseleave: {
      bubbles: true,
      stream: null
    },

    mouseover: {
      bubbles: true,
      stream: null
    },

    mouseout: {
      bubbles: true,
      stream: null
    },

    keyup: {
      bubbles: true,
      stream: null
    },

    keydown: {
      bubbles: true,
      stream: null
    },

    keypress: {
      bubbles: true,
      stream: null
    },

    touchstart: {
      bubbles: true,
      stream: null
    },

    touchend: {
      bubbles: true,
      stream: null
    },

    touchcancel: {
      bubbles: true,
      stream: null
    },

    touchleave: {
      bubbles: true,
      stream: null
    },

    touchmove: {
      bubbles: true,
      stream: null
    },

    submit: {
      bubbles: true,
      stream: null
    },

    animationstart: {
      bubbles: true,
      stream: null
    },

    animationend: {
      bubbles: true,
      stream: null
    },

    animationiteration: {
      bubbles: true,
      stream: null
    },

    transitionend: {
      bubbles: true,
      stream: null
    },

    drag: {
      bubbles: true,
      stream: null
    },

    drop: {
      bubbles: true,
      stream: null
    },

    dragstart: {
      bubbles: true,
      stream: null
    },

    dragend: {
      bubbles: true,
      stream: null
    },

    dragenter: {
      bubbles: true,
      stream: null
    },

    dragleave: {
      bubbles: true,
      stream: null
    },

    dragover: {
      bubbles: true,
      stream: null
    },

    wheel: {
      bubbles: true,
      stream: null
    }
  };
});
define('frampton-events/event_supported', ['exports', 'module', 'frampton-utils/is_function', 'frampton-utils/memoize'], function (exports, module, _framptonUtilsIs_function, _framptonUtilsMemoize) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isFunction = _interopRequire(_framptonUtilsIs_function);

  var _memoize = _interopRequire(_framptonUtilsMemoize);

  var TAGNAMES = {
    select: 'input',
    change: 'input',
    submit: 'form',
    reset: 'form',
    error: 'img',
    load: 'img',
    abort: 'img'
  };

  /**
   * Tests whether a given event is supported by the current browser.
   *
   * @name eventSupported
   * @static
   * @memberof Frampton.Events
   * @param {String} eventName The name of the event to test
   * @returns {Boolean} Is the event supported
   */
  module.exports = (0, _memoize)(function event_supported(eventName) {
    var el = document.createElement(TAGNAMES[eventName] || 'div');
    eventName = 'on' + eventName;
    var isSupported = (eventName in el);
    if (!isSupported) {
      el.setAttribute(eventName, 'return;');
      isSupported = (0, _isFunction)(el[eventName]);
    }
    el = null;
    return !!isSupported;
  });
});
define("frampton-events/event_target", ["exports", "module"], function (exports, module) {
  /**
   * eventTarget :: DomEvent -> Object
   *
   * @name eventTarget
   * @memberof Frampton.Events
   * @static
   * @param {Object} evt
   * @returns {Object} The target value of the event object, usually a DomNode
   */
  "use strict";

  module.exports = event_target;

  function event_target(evt) {
    return evt.target;
  }
});
define('frampton-events/event_value', ['exports', 'module', 'frampton-utils/compose', 'frampton-html/element_value', 'frampton-events/event_target'], function (exports, module, _framptonUtilsCompose, _framptonHtmlElement_value, _framptonEventsEvent_target) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _compose = _interopRequire(_framptonUtilsCompose);

  var _elementValue = _interopRequire(_framptonHtmlElement_value);

  var _eventTarget = _interopRequire(_framptonEventsEvent_target);

  /**
   * eventValue :: DomEvent -> String
   *
   * @name eventValue
   * @memberof Frampton.Events
   * @static
   * @param {Object} evt
   * @returns {String} The value property of the event target
   */
  module.exports = (0, _compose)(_elementValue, _eventTarget);
});
define('frampton-events/get_document_stream', ['exports', 'module', 'frampton-events/document_cache', 'frampton-events/get_event_stream'], function (exports, module, _framptonEventsDocument_cache, _framptonEventsGet_event_stream) {
  'use strict';

  module.exports = get_document_stream;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _documentCache = _interopRequire(_framptonEventsDocument_cache);

  var _getEventStream = _interopRequire(_framptonEventsGet_event_stream);

  function get_document_stream(name) {
    return _documentCache.get(name, function () {
      return (0, _getEventStream)(name, document);
    });
  }
});
define('frampton-events/get_event_stream', ['exports', 'module', 'frampton-signals/event_stream', 'frampton-signals/event', 'frampton-events/event_dispatcher'], function (exports, module, _framptonSignalsEvent_stream, _framptonSignalsEvent, _framptonEventsEvent_dispatcher) {
  'use strict';

  module.exports = get_event_stream;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _EventStream = _interopRequire(_framptonSignalsEvent_stream);

  function get_event_stream(name, target) {
    return new _EventStream(function (sink) {
      return (0, _framptonEventsEvent_dispatcher.addListener)(name, function (evt) {
        return sink((0, _framptonSignalsEvent.nextEvent)(evt));
      }, target);
    });
  }
});
define("frampton-events/get_position", ["exports", "module"], function (exports, module) {
  /**
   * getPosition :: DomEvent -> [Number, Number]
   *
   * @name getPosition
   * @memberof Frampton.Events
   * @static
   * @param {Object} evt
   * @returns {Array} A pair where the 0 index is the x coord and the 1 index is the y coord
   */
  "use strict";

  module.exports = get_position;

  function get_position(evt) {

    var posx = 0;
    var posy = 0;
    var body = document.body;
    var documentElement = document.documentElement;

    if (evt.pageX || evt.pageY) {
      posx = evt.pageX;
      posy = evt.pageY;
    } else if (evt.clientX || evt.clientY) {
      posx = evt.clientX + body.scrollLeft + documentElement.scrollLeft;
      posy = evt.clientY + body.scrollTop + documentElement.scrollTop;
    }

    return [posx, posy];
  }
});
define('frampton-events/get_position_relative', ['exports', 'module', 'frampton-utils/curry', 'frampton-events/get_position'], function (exports, module, _framptonUtilsCurry, _framptonEventsGet_position) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _getPosition = _interopRequire(_framptonEventsGet_position);

  /**
   * getPositionRelative :: DomNode -> DomEvent -> [Number, Number]
   *
   * @name getPositionRelative
   * @memberof Frampton.Events
   * @static
   * @param {Object} node
   * @param {Object} evt
   * @returns {Array} A pair where the 0 index is the x coord and the 1 index is the y coord
   */
  module.exports = (0, _curry)(function get_position_relative(node, evt) {

    var position = (0, _getPosition)(evt);

    var rect = node.getBoundingClientRect();
    var relx = rect.left + document.body.scrollLeft + document.documentElement.scrollLeft;
    var rely = rect.top + document.body.scrollTop + document.documentElement.scrollTop;

    var posx = position[0] - Math.round(relx) - node.clientLeft;
    var posy = position[1] - Math.round(rely) - node.clientTop;

    return [posx, posy];
  });
});
define('frampton-events/has_selector', ['exports', 'module', 'frampton-utils/curry', 'frampton-utils/compose', 'frampton-style/matches', 'frampton-events/event_target'], function (exports, module, _framptonUtilsCurry, _framptonUtilsCompose, _framptonStyleMatches, _framptonEventsEvent_target) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _compose = _interopRequire(_framptonUtilsCompose);

  var _matches = _interopRequire(_framptonStyleMatches);

  var _eventTarget = _interopRequire(_framptonEventsEvent_target);

  /**
   * hasSelector :: String -> DomEvent -> Boolean
   *
   * @name hasSelector
   * @memberof Frampton.Events
   * @static
   * @param {String} selector
   * @param {Object} evt
   * @returns {Boolean}
   */
  module.exports = (0, _curry)(function has_selector(selector, evt) {
    return (0, _compose)((0, _matches)(selector), _eventTarget)(evt);
  });
});
define('frampton-events/listen', ['exports', 'frampton-utils/curry', 'frampton-utils/is_function', 'frampton-events/contains', 'frampton-events/selector_contains', 'frampton-events/event_map', 'frampton-events/get_document_stream', 'frampton-events/get_event_stream'], function (exports, _framptonUtilsCurry, _framptonUtilsIs_function, _framptonEventsContains, _framptonEventsSelector_contains, _framptonEventsEvent_map, _framptonEventsGet_document_stream, _framptonEventsGet_event_stream) {
  'use strict';

  exports.__esModule = true;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _isFunction = _interopRequire(_framptonUtilsIs_function);

  var _contains = _interopRequire(_framptonEventsContains);

  var _selectorContains = _interopRequire(_framptonEventsSelector_contains);

  var _EVENT_MAP = _interopRequire(_framptonEventsEvent_map);

  var _getDocumentStream = _interopRequire(_framptonEventsGet_document_stream);

  var _getEventStream = _interopRequire(_framptonEventsGet_event_stream);

  /**
   * listen :: String -> Dom -> EventStream Event
   *
   * @name listen
   * @memberof Frampton.Events
   * @static
   * @param {String} eventName Name of event to listen for
   * @param {Object} target    Object on which to listen for event
   * @returns {Frampton.Signals.EventStream} An EventStream of all occurances of the given event on the given object
   */
  var onEvent = (0, _curry)(function on_selector(eventName, target) {
    if (_EVENT_MAP[eventName] && (0, _isFunction)(target.addEventListener)) {
      return (0, _getDocumentStream)(eventName).filter((0, _contains)(target));
    } else {
      return (0, _getEventStream)(eventName, target);
    }
  });

  /**
   * onSelector :: String -> String -> EventStream Event
   *
   * @name listen
   * @memberof Frampton.Events
   * @static
   * @param {String} eventName Name of event to listen for
   * @param {String} selector  Selector to filter events by
   * @returns {Frampton.Signals.EventStream} An EventStream of all occurances of the given event within given selector
   */
  var onSelector = (0, _curry)(function on_selector(eventName, selector) {
    if (_EVENT_MAP[eventName]) {
      return (0, _getDocumentStream)(eventName).filter((0, _selectorContains)(selector));
    } else {
      throw new Error('Frampton.Events.onSelector given unrecognized event name: ' + eventName);
    }
  });

  exports.listen = onEvent;
  exports.onSelector = onSelector;
});
define('frampton-events/once', ['exports', 'module', 'frampton-events/listen'], function (exports, module, _framptonEventsListen) {
  'use strict';

  module.exports = once;

  function once(eventName, target) {
    return (0, _framptonEventsListen.listen)(eventName, target).take(1);
  }
});
define('frampton-events/selector_contains', ['exports', 'module', 'frampton-utils/curry', 'frampton-utils/is_something', 'frampton-events/closest_to_event'], function (exports, module, _framptonUtilsCurry, _framptonUtilsIs_something, _framptonEventsClosest_to_event) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _isSomething = _interopRequire(_framptonUtilsIs_something);

  var _closestToEvent = _interopRequire(_framptonEventsClosest_to_event);

  /**
   * selectorContains :: String -> DomEvent -> Boolean
   *
   * Tests if the target of a given event is contained in a node that matches
   * the given selector.
   *
   * @name selectorContains
   * @memberof Frampton.Events
   * @static
   * @param {String} selector
   * @param {Object} evt
   * @returns {Boolean} Is the event contained in a node that matches the given selector
   */
  module.exports = (0, _curry)(function selector_contains(selector, evt) {
    return (0, _isSomething)((0, _closestToEvent)(selector, evt));
  });
});
define('frampton-html', ['exports', 'frampton/namespace', 'frampton-html/contains', 'frampton-html/element_value', 'frampton-html/data'], function (exports, _framptonNamespace, _framptonHtmlContains, _framptonHtmlElement_value, _framptonHtmlData) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Frampton = _interopRequire(_framptonNamespace);

  var _contains = _interopRequire(_framptonHtmlContains);

  var _elementValue = _interopRequire(_framptonHtmlElement_value);

  var _data = _interopRequire(_framptonHtmlData);

  /**
   * @name Html
   * @namespace
   * @memberof Frampton
   */
  _Frampton.Html = {};
  _Frampton.Html.contains = _contains;
  _Frampton.Html.elementValue = _elementValue;
  _Frampton.Html.data = _data;
});
define('frampton-html/contains', ['exports', 'module', 'frampton-utils/curry', 'frampton-utils/is_function'], function (exports, module, _framptonUtilsCurry, _framptonUtilsIs_function) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _isFunction = _interopRequire(_framptonUtilsIs_function);

  // contains :: Dom -> Dom -> Boolean
  module.exports = (0, _curry)(function contains(parent, child) {
    if (parent === child) {
      return true;
    } else if ((0, _isFunction)(parent.contains)) {
      return parent.contains(child);
    } else {
      while (child = child.parentNode) {
        if (parent === child) {
          return true;
        }
        return false;
      }
    }
  });
});
define('frampton-html/data', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  // data :: String -> Dom -> String
  module.exports = (0, _curry)(function data(name, dom) {
    return dom.getAttribute('data-' + name);
  });
});
define("frampton-html/element_value", ["exports", "module"], function (exports, module) {
  /**
   * elementValue :: Object -> Any
   *
   * @name elementValue
   * @method
   * @memberof Frampton.Html
   * @param {Object} element
   * @returns {*}
   */
  "use strict";

  module.exports = element_value;

  function element_value(element) {
    return element.value || null;
  }
});
define('frampton-html/set_html', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  module.exports = (0, _curry)(function set_html(element, html) {
    element.innerHTML = html;
  });
});
define('frampton-keyboard', ['exports', 'frampton/namespace', 'frampton-keyboard/keyboard', 'frampton-keyboard/key_code', 'frampton-keyboard/is_key', 'frampton-keyboard/is_enter', 'frampton-keyboard/is_esc', 'frampton-keyboard/is_up', 'frampton-keyboard/is_down', 'frampton-keyboard/is_left', 'frampton-keyboard/is_right', 'frampton-keyboard/is_space', 'frampton-keyboard/is_ctrl', 'frampton-keyboard/is_shift'], function (exports, _framptonNamespace, _framptonKeyboardKeyboard, _framptonKeyboardKey_code, _framptonKeyboardIs_key, _framptonKeyboardIs_enter, _framptonKeyboardIs_esc, _framptonKeyboardIs_up, _framptonKeyboardIs_down, _framptonKeyboardIs_left, _framptonKeyboardIs_right, _framptonKeyboardIs_space, _framptonKeyboardIs_ctrl, _framptonKeyboardIs_shift) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Frampton = _interopRequire(_framptonNamespace);

  var _Keyboard = _interopRequire(_framptonKeyboardKeyboard);

  var _keyCode = _interopRequire(_framptonKeyboardKey_code);

  var _isKey = _interopRequire(_framptonKeyboardIs_key);

  var _isEnter = _interopRequire(_framptonKeyboardIs_enter);

  var _isEsc = _interopRequire(_framptonKeyboardIs_esc);

  var _isUp = _interopRequire(_framptonKeyboardIs_up);

  var _isDown = _interopRequire(_framptonKeyboardIs_down);

  var _isLeft = _interopRequire(_framptonKeyboardIs_left);

  var _isRight = _interopRequire(_framptonKeyboardIs_right);

  var _isSpace = _interopRequire(_framptonKeyboardIs_space);

  var _isCtrl = _interopRequire(_framptonKeyboardIs_ctrl);

  var _isShift = _interopRequire(_framptonKeyboardIs_shift);

  /**
   * @name Keyboard
   * @namespace
   * @memberof Frampton
   */
  _Frampton.Keyboard = _Keyboard;
  _Frampton.Keyboard.keyCode = _keyCode;
  _Frampton.Keyboard.isKey = _isKey;
  _Frampton.Keyboard.isEnter = _isEnter;
  _Frampton.Keyboard.isEsc = _isEsc;
  _Frampton.Keyboard.isUp = _isUp;
  _Frampton.Keyboard.isDown = _isDown;
  _Frampton.Keyboard.isLeft = _isLeft;
  _Frampton.Keyboard.isRight = _isRight;
  _Frampton.Keyboard.isShift = _isShift;
  _Frampton.Keyboard.isSpace = _isSpace;
  _Frampton.Keyboard.isCtrl = _isCtrl;
});
define('frampton-keyboard/is_ctrl', ['exports', 'module', 'frampton-keyboard/is_key', 'frampton-keyboard/key_map'], function (exports, module, _framptonKeyboardIs_key, _framptonKeyboardKey_map) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isKey = _interopRequire(_framptonKeyboardIs_key);

  var _KEY_MAP = _interopRequire(_framptonKeyboardKey_map);

  // is_ctrl :: KeyCode -> Boolean
  module.exports = (0, _isKey)(_KEY_MAP.CTRL);
});
define('frampton-keyboard/is_down', ['exports', 'module', 'frampton-keyboard/is_key', 'frampton-keyboard/key_map'], function (exports, module, _framptonKeyboardIs_key, _framptonKeyboardKey_map) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isKey = _interopRequire(_framptonKeyboardIs_key);

  var _KEY_MAP = _interopRequire(_framptonKeyboardKey_map);

  // is_down :: KeyCode -> Boolean
  module.exports = (0, _isKey)(_KEY_MAP.DOWN);
});
define('frampton-keyboard/is_enter', ['exports', 'module', 'frampton-keyboard/is_key', 'frampton-keyboard/key_map'], function (exports, module, _framptonKeyboardIs_key, _framptonKeyboardKey_map) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isKey = _interopRequire(_framptonKeyboardIs_key);

  var _KEY_MAP = _interopRequire(_framptonKeyboardKey_map);

  // is_enter :: KeyCode -> Boolean
  module.exports = (0, _isKey)(_KEY_MAP.ENTER);
});
define('frampton-keyboard/is_esc', ['exports', 'module', 'frampton-keyboard/is_key', 'frampton-keyboard/key_map'], function (exports, module, _framptonKeyboardIs_key, _framptonKeyboardKey_map) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isKey = _interopRequire(_framptonKeyboardIs_key);

  var _KEY_MAP = _interopRequire(_framptonKeyboardKey_map);

  // is_esc :: KeyCode -> Boolean
  module.exports = (0, _isKey)(_KEY_MAP.ESC);
});
define('frampton-keyboard/is_key', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  // isKey :: KeyCode -> KeyCode -> Boolean
  module.exports = (0, _curry)(function is_key(key, keyCode) {
    return key === keyCode;
  });
});
define('frampton-keyboard/is_left', ['exports', 'module', 'frampton-keyboard/is_key', 'frampton-keyboard/key_map'], function (exports, module, _framptonKeyboardIs_key, _framptonKeyboardKey_map) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isKey = _interopRequire(_framptonKeyboardIs_key);

  var _KEY_MAP = _interopRequire(_framptonKeyboardKey_map);

  // is_left :: KeyCode -> Boolean
  module.exports = (0, _isKey)(_KEY_MAP.LEFT);
});
define('frampton-keyboard/is_right', ['exports', 'module', 'frampton-keyboard/is_key', 'frampton-keyboard/key_map'], function (exports, module, _framptonKeyboardIs_key, _framptonKeyboardKey_map) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isKey = _interopRequire(_framptonKeyboardIs_key);

  var _KEY_MAP = _interopRequire(_framptonKeyboardKey_map);

  // is_right :: KeyCode -> Boolean
  module.exports = (0, _isKey)(_KEY_MAP.RIGHT);
});
define('frampton-keyboard/is_shift', ['exports', 'module', 'frampton-keyboard/is_key', 'frampton-keyboard/key_map'], function (exports, module, _framptonKeyboardIs_key, _framptonKeyboardKey_map) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isKey = _interopRequire(_framptonKeyboardIs_key);

  var _KEY_MAP = _interopRequire(_framptonKeyboardKey_map);

  // is_shift :: KeyCode -> Boolean
  module.exports = (0, _isKey)(_KEY_MAP.SHIFT);
});
define('frampton-keyboard/is_space', ['exports', 'module', 'frampton-keyboard/is_key', 'frampton-keyboard/key_map'], function (exports, module, _framptonKeyboardIs_key, _framptonKeyboardKey_map) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isKey = _interopRequire(_framptonKeyboardIs_key);

  var _KEY_MAP = _interopRequire(_framptonKeyboardKey_map);

  // is_space :: KeyCode -> Boolean
  module.exports = (0, _isKey)(_KEY_MAP.SPACE);
});
define('frampton-keyboard/is_up', ['exports', 'module', 'frampton-keyboard/is_key', 'frampton-keyboard/key_map'], function (exports, module, _framptonKeyboardIs_key, _framptonKeyboardKey_map) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isKey = _interopRequire(_framptonKeyboardIs_key);

  var _KEY_MAP = _interopRequire(_framptonKeyboardKey_map);

  // is_up :: KeyCode -> Boolean
  module.exports = (0, _isKey)(_KEY_MAP.UP);
});
define('frampton-keyboard/key_code', ['exports', 'module', 'frampton-utils/get'], function (exports, module, _framptonUtilsGet) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _get = _interopRequire(_framptonUtilsGet);

  // key_code :: DomEvent -> KeyCode
  module.exports = (0, _get)('keyCode');
});
define("frampton-keyboard/key_map", ["exports", "module"], function (exports, module) {
  "use strict";

  module.exports = {
    ENTER: 13,
    ESC: 27,
    SPACE: 32,
    CTRL: 17,
    SHIFT: 16,
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39
  };
});
define('frampton-keyboard/keyboard', ['exports', 'module', 'frampton-utils/curry', 'frampton-list/contains', 'frampton-list/append', 'frampton-list/remove', 'frampton-events/listen', 'frampton-signals/stepper', 'frampton-keyboard/key_map', 'frampton-keyboard/key_code'], function (exports, module, _framptonUtilsCurry, _framptonListContains, _framptonListAppend, _framptonListRemove, _framptonEventsListen, _framptonSignalsStepper, _framptonKeyboardKey_map, _framptonKeyboardKey_code) {
  'use strict';

  module.exports = Keyboard;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _contains = _interopRequire(_framptonListContains);

  var _append = _interopRequire(_framptonListAppend);

  var _remove = _interopRequire(_framptonListRemove);

  var _stepper = _interopRequire(_framptonSignalsStepper);

  var _KEY_MAP = _interopRequire(_framptonKeyboardKey_map);

  var _keyCode = _interopRequire(_framptonKeyboardKey_code);

  //+ keyUp :: EventStream DomEvent
  var keyUp = (0, _framptonEventsListen.listen)('keyup', document);

  //+ keyDown :: EventStream DomEvent
  var keyDown = (0, _framptonEventsListen.listen)('keydown', document);

  //+ keyPress :: EventStream DomEvent
  var keyPress = (0, _framptonEventsListen.listen)('keypress', document);

  //+ keyUpCodes :: EventStream KeyCode
  var keyUpCodes = keyUp.map(_keyCode);

  //+ keyDownCodes :: EventStream KeyCode
  var keyDownCodes = keyDown.map(_keyCode);

  var addKey = function addKey(keyCode) {
    return function (arr) {
      if (!(0, _contains)(arr, keyCode)) {
        return (0, _append)(arr, keyCode);
      }
      return arr;
    };
  };

  var removeKey = function removeKey(keyCode) {
    return function (arr) {
      return (0, _remove)(keyCode, arr);
    };
  };

  var update = function update(acc, fn) {
    return fn(acc);
  };

  //+ rawEvents :: EventStream Function
  var rawEvents = keyUpCodes.map(removeKey).merge(keyDownCodes.map(addKey));

  //+ keysDown :: EventStream []
  var keysDown = rawEvents.fold(update, []);

  //+ keyIsDown :: KeyCode -> EventStream Boolean
  var keyIsDown = function keyIsDown(keyCode) {
    return keysDown.map(function (arr) {
      return (0, _contains)(arr, keyCode);
    });
  };

  //+ direction :: KeyCode -> [KeyCode] -> Boolean
  var direction = (0, _curry)(function (keyCode, arr) {
    return (0, _contains)(arr, keyCode) ? 1 : 0;
  });

  //+ isUp :: [KeyCode] -> Boolean
  var isUp = direction(_KEY_MAP.UP);

  //+ isDown :: [KeyCode] -> Boolean
  var isDown = direction(_KEY_MAP.DOWN);

  //+ isRight :: [KeyCode] -> Boolean
  var isRight = direction(_KEY_MAP.RIGHT);

  //+ isLeft :: [KeyCode] -> Boolean
  var isLeft = direction(_KEY_MAP.LEFT);

  //+ arrows :: EventStream [horizontal, vertical]
  var arrows = keysDown.map(function (arr) {
    return [isRight(arr) - isLeft(arr), isUp(arr) - isDown(arr)];
  });

  var defaultKeyboard = {
    downs: keyDown,
    ups: keyUp,
    presses: keyPress,
    codes: keyUpCodes,
    arrows: (0, _stepper)([0, 0], arrows),
    shift: (0, _stepper)(false, keyIsDown(_KEY_MAP.SHIFT)),
    ctrl: (0, _stepper)(false, keyIsDown(_KEY_MAP.CTRL)),
    escape: (0, _stepper)(false, keyIsDown(_KEY_MAP.ESC)),
    enter: (0, _stepper)(false, keyIsDown(_KEY_MAP.ENTER)),
    space: (0, _stepper)(false, keyIsDown(_KEY_MAP.SPACE))
  };

  function Keyboard() {
    return defaultKeyboard;
  }
});
define('frampton-list', ['exports', 'frampton/namespace', 'frampton-list/add', 'frampton-list/append', 'frampton-list/contains', 'frampton-list/copy', 'frampton-list/diff', 'frampton-list/drop', 'frampton-list/each', 'frampton-list/filter', 'frampton-list/foldl', 'frampton-list/foldr', 'frampton-list/head', 'frampton-list/init', 'frampton-list/last', 'frampton-list/length', 'frampton-list/maximum', 'frampton-list/minimum', 'frampton-list/prepend', 'frampton-list/product', 'frampton-list/remove', 'frampton-list/reverse', 'frampton-list/split', 'frampton-list/sum', 'frampton-list/tail', 'frampton-list/zip'], function (exports, _framptonNamespace, _framptonListAdd, _framptonListAppend, _framptonListContains, _framptonListCopy, _framptonListDiff, _framptonListDrop, _framptonListEach, _framptonListFilter, _framptonListFoldl, _framptonListFoldr, _framptonListHead, _framptonListInit, _framptonListLast, _framptonListLength, _framptonListMaximum, _framptonListMinimum, _framptonListPrepend, _framptonListProduct, _framptonListRemove, _framptonListReverse, _framptonListSplit, _framptonListSum, _framptonListTail, _framptonListZip) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Frampton = _interopRequire(_framptonNamespace);

  var _add = _interopRequire(_framptonListAdd);

  var _append = _interopRequire(_framptonListAppend);

  var _contains = _interopRequire(_framptonListContains);

  var _copy = _interopRequire(_framptonListCopy);

  var _diff = _interopRequire(_framptonListDiff);

  var _drop = _interopRequire(_framptonListDrop);

  var _each = _interopRequire(_framptonListEach);

  var _filter = _interopRequire(_framptonListFilter);

  var _foldl = _interopRequire(_framptonListFoldl);

  var _foldr = _interopRequire(_framptonListFoldr);

  var _head = _interopRequire(_framptonListHead);

  var _init = _interopRequire(_framptonListInit);

  var _last = _interopRequire(_framptonListLast);

  var _length = _interopRequire(_framptonListLength);

  var _maximum = _interopRequire(_framptonListMaximum);

  var _minimum = _interopRequire(_framptonListMinimum);

  var _prepend = _interopRequire(_framptonListPrepend);

  var _product = _interopRequire(_framptonListProduct);

  var _remove = _interopRequire(_framptonListRemove);

  var _reverse = _interopRequire(_framptonListReverse);

  var _split = _interopRequire(_framptonListSplit);

  var _sum = _interopRequire(_framptonListSum);

  var _tail = _interopRequire(_framptonListTail);

  var _zip = _interopRequire(_framptonListZip);

  /**
   * @name List
   * @namespace
   * @memberof Frampton
   */
  _Frampton.List = {};
  _Frampton.List.add = _add;
  _Frampton.List.append = _append;
  _Frampton.List.contains = _contains;
  _Frampton.List.copy = _copy;
  _Frampton.List.diff = _diff;
  _Frampton.List.drop = _drop;
  _Frampton.List.each = _each;
  _Frampton.List.filter = _filter;
  _Frampton.List.foldl = _foldl;
  _Frampton.List.foldr = _foldr;
  _Frampton.List.head = _head;
  _Frampton.List.init = _init;
  _Frampton.List.last = _last;
  _Frampton.List.length = _length;
  _Frampton.List.maximum = _maximum;
  _Frampton.List.minimum = _minimum;
  _Frampton.List.prepend = _prepend;
  _Frampton.List.product = _product;
  _Frampton.List.remove = _remove;
  _Frampton.List.reverse = _reverse;
  _Frampton.List.split = _split;
  _Frampton.List.sum = _sum;
  _Frampton.List.tail = _tail;
  _Frampton.List.zip = _zip;
});
define('frampton-list/add', ['exports', 'module', 'frampton-utils/curry', 'frampton-list/contains', 'frampton-list/append', 'frampton-list/copy'], function (exports, module, _framptonUtilsCurry, _framptonListContains, _framptonListAppend, _framptonListCopy) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _contains = _interopRequire(_framptonListContains);

  var _append = _interopRequire(_framptonListAppend);

  var _copy = _interopRequire(_framptonListCopy);

  /**
   * @name addToList
   * @method
   * @memberof Frampton.List
   * @param {Array} xs  Array to add object to
   * @param {*}   obj Object to add to array
   * @returns {Array} A new array with the object added
   */
  module.exports = (0, _curry)(function add_to_list(xs, obj) {
    return !(0, _contains)(xs, obj) ? (0, _append)(xs, obj) : (0, _copy)(xs);
  });
});
define('frampton-list/append', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  /**
   * @name append
   * @method
   * @memberof Frampton.List
   * @param {Array} xs
   * @param {*} obj
   * @returns {Array}
   */
  module.exports = (0, _curry)(function (xs, obj) {
    return xs.concat([].concat(obj));
  });
});
define('frampton-list/contains', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  /**
   * @name contains
   * @method
   * @memberof Frampton.List
   * @param {Array} xs
   * @param {*}   obj
   * @retruns {Boolean}
   */
  module.exports = (0, _curry)(function (xs, obj) {
    return xs.indexOf(obj) > -1;
  });
});
define("frampton-list/copy", ["exports", "module"], function (exports, module) {
  /**
   * @name copy
   * @method
   * @memberof Frampton.List
   */
  "use strict";

  module.exports = copy;

  function copy(xs, begin, end) {

    var argLen = xs.length,
        idx = 0,
        arrLen,
        arr,
        i;

    begin = begin || 0;
    end = end || argLen;
    arrLen = end - begin;

    if (argLen > 0) {
      arr = new Array(arrLen);
      for (i = begin; i < end; i++) {
        arr[idx++] = xs[i];
      }
    }

    return arr || [];
  }
});
define('frampton-list/diff', ['exports', 'module', 'frampton-utils/curry', 'frampton-list/contains'], function (exports, module, _framptonUtilsCurry, _framptonListContains) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _contains = _interopRequire(_framptonListContains);

  /**
   * @name diff
   * @method
   * @memberof Frampton.List
   * @returns {Array}
   */
  module.exports = (0, _curry)(function curried_diff(xs, ys) {

    var diff = [];

    xs.forEach(function (item) {
      if (!(0, _contains)(ys, item)) {
        diff.push(item);
      }
    });

    return diff;
  });
});
define('frampton-list/drop', ['exports', 'module', 'frampton-utils/assert', 'frampton-utils/curry', 'frampton-utils/is_array'], function (exports, module, _framptonUtilsAssert, _framptonUtilsCurry, _framptonUtilsIs_array) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _assert = _interopRequire(_framptonUtilsAssert);

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _isArray = _interopRequire(_framptonUtilsIs_array);

  /**
   * @name drop
   * @method
   * @memberof Frampton.List
   */
  module.exports = (0, _curry)(function curried_drop(n, xs) {
    (0, _assert)('Frampton.drop recieved a non-array', (0, _isArray)(xs));
    return xs.filter(function (next) {
      if (n === 0) {
        return true;
      } else {
        n--;
      }
      return false;
    });
  });
});
define('frampton-list/each', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  /**
   * @name each
   * @method
   * @memberof Frampton.List
   */
  module.exports = (0, _curry)(function curried_each(fn, xs) {
    xs.forEach(fn);
  });
});
define('frampton-list/filter', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  /**
   * @name filter
   * @method
   * @memberof Frampton.List
   */
  module.exports = (0, _curry)(function (predicate, xs) {
    return xs.filter(predicate);
  });
});
define('frampton-list/foldl', ['exports', 'module', 'frampton-utils/assert', 'frampton-utils/curry', 'frampton-utils/is_array'], function (exports, module, _framptonUtilsAssert, _framptonUtilsCurry, _framptonUtilsIs_array) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _assert = _interopRequire(_framptonUtilsAssert);

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _isArray = _interopRequire(_framptonUtilsIs_array);

  /**
   * @name foldl
   * @method
   * @memberof Frampton.List
   */
  module.exports = (0, _curry)(function curried_foldl(fn, acc, xs) {
    (0, _assert)('Frampton.foldl recieved a non-array', (0, _isArray)(xs));
    return xs.reduce(fn, acc);
  });
});
define('frampton-list/foldr', ['exports', 'module', 'frampton-utils/assert', 'frampton-utils/curry', 'frampton-utils/is_array'], function (exports, module, _framptonUtilsAssert, _framptonUtilsCurry, _framptonUtilsIs_array) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _assert = _interopRequire(_framptonUtilsAssert);

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _isArray = _interopRequire(_framptonUtilsIs_array);

  /**
   * @name foldr
   * @method
   * @memberof Frampton.List
   */
  module.exports = (0, _curry)(function curried_foldr(fn, acc, xs) {
    (0, _assert)('Frampton.foldr recieved a non-array', (0, _isArray)(xs));
    return xs.reduceRight(fn, acc);
  });
});
define('frampton-list/head', ['exports', 'module', 'frampton-utils/assert', 'frampton-utils/is_defined', 'frampton-utils/is_array'], function (exports, module, _framptonUtilsAssert, _framptonUtilsIs_defined, _framptonUtilsIs_array) {
  'use strict';

  /**
   * @name head
   * @method
   * @memberof Frampton.List
   */
  module.exports = head;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _assert = _interopRequire(_framptonUtilsAssert);

  var _isDefined = _interopRequire(_framptonUtilsIs_defined);

  var _isArray = _interopRequire(_framptonUtilsIs_array);

  function head(xs) {
    (0, _assert)('Frampton.head recieved a non-array', (0, _isArray)(xs));
    return (0, _isDefined)(xs[0]) ? xs[0] : null;
  }
});
define('frampton-list/init', ['exports', 'module', 'frampton-utils/assert', 'frampton-utils/is_array'], function (exports, module, _framptonUtilsAssert, _framptonUtilsIs_array) {
  'use strict';

  /**
   * @name init
   * @method
   * @memberof Frampton.List
   */
  module.exports = init;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _assert = _interopRequire(_framptonUtilsAssert);

  var _isArray = _interopRequire(_framptonUtilsIs_array);

  function init(xs) {
    (0, _assert)('Frampton.init recieved a non-array', (0, _isArray)(xs));
    switch (xs.length) {
      case 0:
        return [];
      default:
        return xs.slice(0, xs.length - 1);
    }
  }
});
define('frampton-list/last', ['exports', 'module', 'frampton-utils/assert', 'frampton-utils/is_array'], function (exports, module, _framptonUtilsAssert, _framptonUtilsIs_array) {
  'use strict';

  /**
   * @name last
   * @method
   * @memberof Frampton.List
   */
  module.exports = last;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _assert = _interopRequire(_framptonUtilsAssert);

  var _isArray = _interopRequire(_framptonUtilsIs_array);

  function last(xs) {
    (0, _assert)('Frampton.last recieved a non-array', (0, _isArray)(xs));
    switch (xs.length) {
      case 0:
        return null;
      default:
        return xs[xs.length - 1];
    }
  }
});
define('frampton-list/length', ['exports', 'module', 'frampton-utils/is_something', 'frampton-utils/is_defined'], function (exports, module, _framptonUtilsIs_something, _framptonUtilsIs_defined) {
  'use strict';

  /**
   * @name length
   * @method
   * @memberof Frampton.List
   */
  module.exports = length;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isSomething = _interopRequire(_framptonUtilsIs_something);

  var _isDefined = _interopRequire(_framptonUtilsIs_defined);

  function length(xs) {
    return (0, _isSomething)(xs) && (0, _isDefined)(xs.length) ? xs.length : 0;
  }
});
define('frampton-list/maximum', ['exports', 'module', 'frampton-list/foldl', 'frampton-utils/is_nothing'], function (exports, module, _framptonListFoldl, _framptonUtilsIs_nothing) {
  'use strict';

  /**
   * @name maximum
   * @method
   * @memberof Frampton.List
   * @param {Array} xs
   */
  module.exports = maximum;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _foldl = _interopRequire(_framptonListFoldl);

  var _isNothing = _interopRequire(_framptonUtilsIs_nothing);

  function maximum(xs) {
    return (0, _foldl)(function (acc, next) {
      if ((0, _isNothing)(acc) || next > acc) {
        acc = next;
      }
      return acc;
    }, null, xs);
  }
});
define('frampton-list/minimum', ['exports', 'module', 'frampton-list/foldl', 'frampton-utils/is_nothing'], function (exports, module, _framptonListFoldl, _framptonUtilsIs_nothing) {
  'use strict';

  /**
   * @name minimum
   * @method
   * @memberof Frampton.List
   * @param {Array} xs
   */
  module.exports = minimum;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _foldl = _interopRequire(_framptonListFoldl);

  var _isNothing = _interopRequire(_framptonUtilsIs_nothing);

  function minimum(xs) {
    return (0, _foldl)(function (acc, next) {
      if ((0, _isNothing)(acc) || next < acc) {
        acc = next;
      }
      return acc;
    }, null, xs);
  }
});
define('frampton-list/prepend', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  /**
   * @name prepend
   * @method
   * @memberof Frampton.List
   * @param {Array} xs
   * @param {*} obj
   */
  module.exports = (0, _curry)(function (xs, obj) {
    return [].concat(obj).concat(xs);
  });
});
define('frampton-list/product', ['exports', 'module', 'frampton-list/foldl'], function (exports, module, _framptonListFoldl) {
  'use strict';

  /**
   * @name product
   * @method
   * @memberof Frampton.List
   * @param {Array} xs
   */
  module.exports = product;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _foldl = _interopRequire(_framptonListFoldl);

  function product(xs) {
    (0, _foldl)(function (acc, next) {
      return acc = acc * next;
    }, 0, xs);
  }
});
define('frampton-list/remove', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  /**
   * remove :: List a -> Any a -> List a
   *
   * @name remove
   * @method
   * @memberof Frampton.List
   * @param {Array} xs
   * @param {Object} obj
   */
  module.exports = (0, _curry)(function curried_remove(obj, xs) {
    return xs.filter(function (next) {
      return next !== obj;
    });
  });
});
define('frampton-list/reverse', ['exports', 'module', 'frampton-list/foldr'], function (exports, module, _framptonListFoldr) {
  'use strict';

  /**
   * reverse :: List a -> List a
   *
   * @name reverse
   * @method
   * @memberof Frampton.List
   */
  module.exports = reverse;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _foldr = _interopRequire(_framptonListFoldr);

  function reverse(xs) {
    return (0, _foldr)(function (acc, next) {
      acc.push(next);
      return acc;
    }, [], xs);
  }
});
define('frampton-list/split', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  /**
   * split :: Number -> List a -> (List a, List a)
   *
   * @name split
   * @method
   * @memberof Frampton.List
   */
  module.exports = (0, _curry)(function split(n, xs) {
    var ys = [];
    var zs = [];
    var len = xs.length;

    for (var i = 0; i < len; i++) {
      if (i < n) {
        ys.push(xs[i]);
      } else {
        zs.push(xs[i]);
      }
    }

    return [ys, zs];
  });
});
define('frampton-list/sum', ['exports', 'module', 'frampton-list/foldl'], function (exports, module, _framptonListFoldl) {
  'use strict';

  /**
   * + sum :: Number a => List a -> a
   *
   * @name sum
   * @method
   * @memberof Frampton.List
   * @param {Array} xs
   */
  module.exports = sum;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _foldl = _interopRequire(_framptonListFoldl);

  function sum(xs) {
    (0, _foldl)(function (acc, next) {
      return acc = acc + next;
    }, 0, xs);
  }
});
define('frampton-list/tail', ['exports', 'module', 'frampton-utils/assert', 'frampton-utils/is_array'], function (exports, module, _framptonUtilsAssert, _framptonUtilsIs_array) {
  /**
   * @name tail
   * @method
   * @memberof Frampton.List
   */
  'use strict';

  module.exports = tail;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _assert = _interopRequire(_framptonUtilsAssert);

  var _isArray = _interopRequire(_framptonUtilsIs_array);

  function tail(xs) {
    (0, _assert)('Frampton.tail recieved a non-array', (0, _isArray)(xs));
    switch (xs.length) {
      case 0:
        return [];
      default:
        return xs.slice(1);
    }
  }
});
define('frampton-list/zip', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  /**
   * zip :: List a -> List b - List (a, b)
   *
   * @name zip
   * @method
   * @memberof Frampton.List
   * @param {Array} xs
   * @param {Array} ys
   */
  module.exports = (0, _curry)(function (xs, ys) {

    var xLen = xs.length;
    var yLen = ys.length;
    var len = xLen > yLen ? yLen : xLen;
    var zs = new Array(len);
    var i = 0;

    for (; i < len; i++) {
      zs[i] = [xs[i], ys[i]];
    }

    return zs;
  });
});
define('frampton-math', ['exports', 'frampton/namespace', 'frampton-math/add', 'frampton-math/subtract', 'frampton-math/multiply', 'frampton-math/divide', 'frampton-math/modulo', 'frampton-math/max', 'frampton-math/min'], function (exports, _framptonNamespace, _framptonMathAdd, _framptonMathSubtract, _framptonMathMultiply, _framptonMathDivide, _framptonMathModulo, _framptonMathMax, _framptonMathMin) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Frampton = _interopRequire(_framptonNamespace);

  var _add = _interopRequire(_framptonMathAdd);

  var _subtract = _interopRequire(_framptonMathSubtract);

  var _multiply = _interopRequire(_framptonMathMultiply);

  var _divide = _interopRequire(_framptonMathDivide);

  var _modulo = _interopRequire(_framptonMathModulo);

  var _max = _interopRequire(_framptonMathMax);

  var _min = _interopRequire(_framptonMathMin);

  /**
   * @name Math
   * @namespace
   * @memberof Frampton
   */
  _Frampton.Math = {};
  _Frampton.Math.add = _add;
  _Frampton.Math.subtract = _subtract;
  _Frampton.Math.multiply = _multiply;
  _Frampton.Math.divide = _divide;
  _Frampton.Math.modulo = _modulo;
  _Frampton.Math.max = _max;
  _Frampton.Math.min = _min;
});
define('frampton-math/add', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  // add :: Number -> Number -> Number
  module.exports = (0, _curry)(function add(a, b) {
    return a + b;
  });
});
define('frampton-math/divide', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  // divide :: Number -> Number -> Number
  module.exports = (0, _curry)(function divide(a, b) {
    return a / b;
  });
});
define('frampton-math/max', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  module.exports = (0, _curry)(function (a, b) {
    return a > b ? a : b;
  });
});
define('frampton-math/min', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  module.exports = (0, _curry)(function (a, b) {
    return a < b ? a : b;
  });
});
define('frampton-math/modulo', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  // modulo :: Number -> Number -> Number
  module.exports = (0, _curry)(function modulo(a, b) {
    return a % b;
  });
});
define('frampton-math/multiply', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  // multiply :: Number -> Number -> Number
  module.exports = (0, _curry)(function multiply(a, b) {
    return a * b;
  });
});
define('frampton-math/subtract', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  // subtract :: Number -> Number -> Number
  module.exports = (0, _curry)(function subtract(a, b) {
    return a - b;
  });
});
define('frampton-monad', ['exports', 'frampton-monad/ap', 'frampton-monad/chain', 'frampton-monad/filter', 'frampton-monad/map'], function (exports, _framptonMonadAp, _framptonMonadChain, _framptonMonadFilter, _framptonMonadMap) {
  'use strict';

  exports.__esModule = true;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _ap = _interopRequire(_framptonMonadAp);

  var _chain = _interopRequire(_framptonMonadChain);

  var _filter = _interopRequire(_framptonMonadFilter);

  var _map = _interopRequire(_framptonMonadMap);

  /**
   * @name Monad
   * @namespace
   * @memberof Frampton
   */
  exports.ap = _ap;
  exports.chain = _chain;
  exports.filter = _filter;
  exports.map = _map;
});
define('frampton-monad/ap', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  /**
   * ap(<*>) :: (a -> b) -> Monad a -> Monad b
   *
   * @name ap
   * @method
   * @memberof Frampton.Monad
   * @param {Function} fn
   * @param {Object} monad
   * @returns {Object}
   */
  module.exports = (0, _curry)(function curried_ap(fn, monad) {
    return monad.ap(fn);
  });
});
define('frampton-monad/chain', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  /**
   * chain(>>=) :: Monad a -> Monad b -> Monad b
   *
   * @name chain
   * @method
   * @memberof Frampton.Monad
   * @param {Object} monad1
   * @param {Object} monad2
   * @returns {Object}
   */
  module.exports = (0, _curry)(function curried_ap(monad1, monad2) {
    return monad1.chain(monad2);
  });
});
define('frampton-monad/filter', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  /**
   * filter :: (a -> b) -> Monad a -> Monad b
   *
   * @name filter
   * @method
   * @memberof Frampton.Monad
   * @param {Function} predicate
   * @param {Object} monad
   * @returns {Object}
   */
  module.exports = (0, _curry)(function curried_filter(predicate, monad) {
    return monad.filter(predicate);
  });
});
define('frampton-monad/map', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  /**
   * map :: (a -> b) -> Monad a -> Monad b
   *
   * @name map
   * @method
   * @memberof Frampton.Monad
   * @param {Function} mapping
   * @param {Object} monad
   * @returns {Object}
   */
  module.exports = (0, _curry)(function curried_map(mapping, monad) {
    return monad.map(mapping);
  });
});
define('frampton-mouse', ['exports', 'frampton/namespace', 'frampton-mouse/mouse'], function (exports, _framptonNamespace, _framptonMouseMouse) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Frampton = _interopRequire(_framptonNamespace);

  var _Mouse = _interopRequire(_framptonMouseMouse);

  _Frampton.Mouse = _Mouse;
});
define('frampton-mouse/mouse', ['exports', 'module', 'frampton-signals/stepper', 'frampton-events/listen', 'frampton-events/contains', 'frampton-events/get_position', 'frampton-events/get_position_relative'], function (exports, module, _framptonSignalsStepper, _framptonEventsListen, _framptonEventsContains, _framptonEventsGet_position, _framptonEventsGet_position_relative) {
  'use strict';

  /**
   * @name Mouse
   * @memberof Frampton
   * @class
   */
  module.exports = Mouse;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _stepper = _interopRequire(_framptonSignalsStepper);

  var _contains = _interopRequire(_framptonEventsContains);

  var _getPosition = _interopRequire(_framptonEventsGet_position);

  var _getPositionRelative = _interopRequire(_framptonEventsGet_position_relative);

  var clickStream = (0, _framptonEventsListen.listen)('click', document);
  var downStream = (0, _framptonEventsListen.listen)('mousedown', document);
  var upStream = (0, _framptonEventsListen.listen)('mouseup', document);
  var moveStream = (0, _framptonEventsListen.listen)('mousemove', document);
  var isDown = (0, _stepper)(false, downStream.map(true).merge(upStream.map(false)));

  var defaultMouse = {
    clicks: clickStream,
    downs: downStream,
    ups: upStream,
    position: (0, _stepper)([0, 0], moveStream.map(_getPosition)),
    isDown: isDown
  };
  function Mouse(element) {
    if (!element) {
      return defaultMouse;
    } else {
      return {
        clicks: clickStream.filter((0, _contains)(element)),
        downs: downStream.filter((0, _contains)(element)),
        ups: upStream.filter((0, _contains)(element)),
        position: (0, _stepper)([0, 0], moveStream.filter((0, _contains)(element)).map((0, _getPositionRelative)(element))),
        isDown: isDown
      };
    }
  }
});
define('frampton-object', ['exports', 'frampton/namespace', 'frampton-object/filter', 'frampton-object/reduce', 'frampton-object/map', 'frampton-object/merge', 'frampton-object/for_each', 'frampton-object/as_list', 'frampton-object/copy', 'frampton-object/update'], function (exports, _framptonNamespace, _framptonObjectFilter, _framptonObjectReduce, _framptonObjectMap, _framptonObjectMerge, _framptonObjectFor_each, _framptonObjectAs_list, _framptonObjectCopy, _framptonObjectUpdate) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Frampton = _interopRequire(_framptonNamespace);

  var _filter = _interopRequire(_framptonObjectFilter);

  var _reduce = _interopRequire(_framptonObjectReduce);

  var _map = _interopRequire(_framptonObjectMap);

  var _merge = _interopRequire(_framptonObjectMerge);

  var _forEach = _interopRequire(_framptonObjectFor_each);

  var _asList = _interopRequire(_framptonObjectAs_list);

  var _copy = _interopRequire(_framptonObjectCopy);

  var _update = _interopRequire(_framptonObjectUpdate);

  /**
   * @name Object
   * @namespace
   * @memberof Frampton
   */
  _Frampton.Object = {};
  _Frampton.Object.copy = _copy;
  _Frampton.Object.update = _update;
  _Frampton.Object.filter = _filter;
  _Frampton.Object.reduce = _reduce;
  _Frampton.Object.map = _map;
  _Frampton.Object.each = _forEach;
  _Frampton.Object.asList = _asList;
  _Frampton.Object.merge = _merge;
});
define('frampton-object/as_list', ['exports', 'module', 'frampton-object/reduce'], function (exports, module, _framptonObjectReduce) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _reduce = _interopRequire(_framptonObjectReduce);

  // as_list :: Object -> Array [String, String]

  module.exports = function (map) {
    return (0, _reduce)(function (acc, nextValue, nextKey) {
      acc.push([nextKey, nextValue]);
      return acc;
    }, [], map);
  };
});
define('frampton-object/copy', ['exports', 'module', 'frampton-object/for_each'], function (exports, module, _framptonObjectFor_each) {
  'use strict';

  /**
   * copy :: Object -> Object
   *
   * @name copy
   * @method
   * @memberof Frampton.Object
   * @param {Object} obj object to copy
   * @returns {Object}
   */
  module.exports = copy_object;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _forEach = _interopRequire(_framptonObjectFor_each);

  function copy_object(obj) {
    var newObj = {};
    (0, _forEach)(function (value, key) {
      newObj[key] = value;
    }, obj);
    return newObj;
  }
});
define('frampton-object/filter', ['exports', 'module', 'frampton-utils/curry', 'frampton-object/for_each'], function (exports, module, _framptonUtilsCurry, _framptonObjectFor_each) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _forEach = _interopRequire(_framptonObjectFor_each);

  module.exports = (0, _curry)(function curried_filter(fn, obj) {

    var newObj = {};

    (0, _forEach)(function (value, key) {
      if (fn(value, key)) {
        newObj[key] = value;
      }
    }, obj);

    return newObj;
  });
});
define('frampton-object/for_each', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  module.exports = (0, _curry)(function curried_for_each(fn, obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        fn(obj[key], key);
      }
    }
  });
});
define('frampton-object/map', ['exports', 'module', 'frampton-utils/curry', 'frampton-object/for_each'], function (exports, module, _framptonUtilsCurry, _framptonObjectFor_each) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _forEach = _interopRequire(_framptonObjectFor_each);

  module.exports = (0, _curry)(function curried_map(fn, obj) {

    var newObj = {};

    (0, _forEach)(function (value, key) {
      newObj[key] = fn(value, key);
    }, obj);

    return newObj;
  });
});
define('frampton-object/merge', ['exports', 'module', 'frampton-utils/curry', 'frampton-utils/extend'], function (exports, module, _framptonUtilsCurry, _framptonUtilsExtend) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _extend = _interopRequire(_framptonUtilsExtend);

  module.exports = (0, _curry)(function (obj1, obj2) {
    return (0, _extend)({}, obj1, obj2);
  });
});
define('frampton-object/reduce', ['exports', 'module', 'frampton-utils/curry', 'frampton-object/for_each'], function (exports, module, _framptonUtilsCurry, _framptonObjectFor_each) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _forEach = _interopRequire(_framptonObjectFor_each);

  module.exports = (0, _curry)(function curried_reduce(fn, acc, obj) {

    (0, _forEach)(function (value, key) {
      acc = fn(acc, value, key);
    }, obj);

    return acc;
  });
});
define('frampton-object/update', ['exports', 'module', 'frampton-object/for_each'], function (exports, module, _framptonObjectFor_each) {
  'use strict';

  /**
   * update :: Object -> String -> Any -> Object
   *
   * @name update
   * @method
   * @memberof Frampton.Object
   * @param {Object} obj object to copy
   * @param {String} k   name of key to update
   * @param {*}      v   value to update key to
   * @returns {Object}
   */
  module.exports = update_object;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _forEach = _interopRequire(_framptonObjectFor_each);

  function update_object(obj, k, v) {
    var newObj = {};
    (0, _forEach)(function (value, key) {
      if (key === v) {
        newObj[key] = v;
      } else {
        newObj[key] = value;
      }
    }, obj);
    return newObj;
  }
});
define('frampton-signals', ['exports', 'frampton/namespace', 'frampton-signals/event_stream', 'frampton-signals/behavior', 'frampton-signals/empty', 'frampton-signals/delayed', 'frampton-signals/interval', 'frampton-signals/sequential', 'frampton-signals/null', 'frampton-signals/send', 'frampton-signals/once', 'frampton-signals/changes', 'frampton-signals/stepper', 'frampton-signals/accum_b', 'frampton-signals/swap', 'frampton-signals/toggle', 'frampton-signals/map', 'frampton-signals/map2', 'frampton-signals/map3', 'frampton-signals/map4', 'frampton-signals/map5', 'frampton-signals/map_many', 'frampton-signals/event'], function (exports, _framptonNamespace, _framptonSignalsEvent_stream, _framptonSignalsBehavior, _framptonSignalsEmpty, _framptonSignalsDelayed, _framptonSignalsInterval, _framptonSignalsSequential, _framptonSignalsNull, _framptonSignalsSend, _framptonSignalsOnce, _framptonSignalsChanges, _framptonSignalsStepper, _framptonSignalsAccum_b, _framptonSignalsSwap, _framptonSignalsToggle, _framptonSignalsMap, _framptonSignalsMap2, _framptonSignalsMap3, _framptonSignalsMap4, _framptonSignalsMap5, _framptonSignalsMap_many, _framptonSignalsEvent) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Frampton = _interopRequire(_framptonNamespace);

  var _EventStream = _interopRequire(_framptonSignalsEvent_stream);

  var _Behavior = _interopRequire(_framptonSignalsBehavior);

  var _empty = _interopRequire(_framptonSignalsEmpty);

  var _delayed = _interopRequire(_framptonSignalsDelayed);

  var _interval = _interopRequire(_framptonSignalsInterval);

  var _sequential = _interopRequire(_framptonSignalsSequential);

  var _nullStream = _interopRequire(_framptonSignalsNull);

  var _send = _interopRequire(_framptonSignalsSend);

  var _once = _interopRequire(_framptonSignalsOnce);

  var _changes = _interopRequire(_framptonSignalsChanges);

  var _stepper = _interopRequire(_framptonSignalsStepper);

  var _accumB = _interopRequire(_framptonSignalsAccum_b);

  var _swap = _interopRequire(_framptonSignalsSwap);

  var _toggle = _interopRequire(_framptonSignalsToggle);

  var _map = _interopRequire(_framptonSignalsMap);

  var _map2 = _interopRequire(_framptonSignalsMap2);

  var _map3 = _interopRequire(_framptonSignalsMap3);

  var _map4 = _interopRequire(_framptonSignalsMap4);

  var _map5 = _interopRequire(_framptonSignalsMap5);

  var _mapMany = _interopRequire(_framptonSignalsMap_many);

  /**
   * @name Signals
   * @namespace
   * @memberof Frampton
   */
  _Frampton.Signals = {};
  _Frampton.Signals.EventStream = _EventStream;
  _Frampton.Signals.Behavior = _Behavior;
  _Frampton.Signals.nextEvent = _framptonSignalsEvent.nextEvent;
  _Frampton.Signals.endEvent = _framptonSignalsEvent.endEvent;
  _Frampton.Signals.emptyEvent = _framptonSignalsEvent.emptyEvent;
  _Frampton.Signals.errorEvent = _framptonSignalsEvent.errorEvent;
  _Frampton.Signals.empty = _empty;
  _Frampton.Signals.delayed = _delayed;
  _Frampton.Signals.interval = _interval;
  _Frampton.Signals.merge = _framptonSignalsEvent_stream.merge;
  _Frampton.Signals.sequential = _sequential;
  _Frampton.Signals.nullStream = _nullStream;
  _Frampton.Signals.send = _send;
  _Frampton.Signals.once = _once;
  _Frampton.Signals.changes = _changes;
  _Frampton.Signals.stepper = _stepper;
  _Frampton.Signals.accumB = _accumB;
  _Frampton.Signals.swap = _swap;
  _Frampton.Signals.toggle = _toggle;
  _Frampton.Signals.map = _map;
  _Frampton.Signals.map2 = _map2;
  _Frampton.Signals.map3 = _map3;
  _Frampton.Signals.map4 = _map4;
  _Frampton.Signals.map5 = _map5;
  _Frampton.Signals.mapMany = _mapMany;
});
define('frampton-signals/accum_b', ['exports', 'module', 'frampton-utils/curry', 'frampton-signals/behavior'], function (exports, module, _framptonUtilsCurry, _framptonSignalsBehavior) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _Behavior = _interopRequire(_framptonSignalsBehavior);

  /**
   * accumB :: a -> EventStream (a -> b) -> Behavior b
   *
   * @name accumB
   * @memberof Frampton.Signals
   * @static
   * @param {*}         initial
   * @param {Frampton.Signals.EventStream} stream
   */
  module.exports = (0, _curry)(function accumB(initial, stream) {
    return new _Behavior(initial, function (sink) {
      return stream.next(function (fn) {
        sink(fn(initial));
      });
    });
  });
});
define('frampton-signals/behavior', ['exports', 'module', 'frampton-utils/assert', 'frampton-utils/guid', 'frampton-utils/noop', 'frampton-utils/is_defined', 'frampton-utils/lazy', 'frampton-list/contains', 'frampton-list/remove'], function (exports, module, _framptonUtilsAssert, _framptonUtilsGuid, _framptonUtilsNoop, _framptonUtilsIs_defined, _framptonUtilsLazy, _framptonListContains, _framptonListRemove) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _assert = _interopRequire(_framptonUtilsAssert);

  var _guid = _interopRequire(_framptonUtilsGuid);

  var _noop = _interopRequire(_framptonUtilsNoop);

  var _isDefined = _interopRequire(_framptonUtilsIs_defined);

  var _lazy = _interopRequire(_framptonUtilsLazy);

  var _contains = _interopRequire(_framptonListContains);

  var _remove = _interopRequire(_framptonListRemove);

  function init(behavior) {
    var sink = behavior.update.bind(behavior);
    behavior.cleanup = behavior.seed(sink) || _noop;
  }

  function addListener(behavior, fn) {
    if (!(0, _contains)(behavior.listeners, fn)) {
      behavior.listeners.push(fn);
      fn(behavior.value);
    }

    return (0, _lazy)(removeListener, behavior, fn);
  }

  function removeListener(behavior, fn) {
    behavior.listeners = (0, _remove)(fn, behavior.listeners);
  }

  function updateListeners(behavior) {
    behavior.listeners.forEach(function (listener) {
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
    (0, _assert)('Behavior must have initial value', (0, _isDefined)(initial));
    this._id = (0, _guid)();
    this.value = initial;
    this.listeners = [];
    this.cleanup = null;
    this.seed = seed || _noop;
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
    return new Behavior(source.value(behavior.value), function (sink) {
      source.changes(function (val) {
        sink(val(behavior.value));
      });
      behavior.changes(function (val) {
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
    return new Behavior(source.value.value, function (sink) {
      source.changes(function (val) {
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
    return new Behavior(fn(source.value), function (sink) {
      source.changes(function (val) {
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
    return new Behavior((0, _isDefined)(acc) ? acc : source.value, function (sink) {
      source.changes(function (val) {
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
    return new Behavior([b1.value, b2.value], function (sink) {
      b1.changes(function (val) {
        sink([val, b2.value]);
      });
      b2.changes(function (val) {
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
    return this.changes(function (val) {
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

  module.exports = Behavior;
});
define('frampton-signals/changes', ['exports', 'module', 'frampton-signals/event_stream', 'frampton-signals/event'], function (exports, module, _framptonSignalsEvent_stream, _framptonSignalsEvent) {
  'use strict';

  /**
   * changes :: Behavior a -> EventStream a
   *
   * Takes a Behavior and returns and EventStream that updates when the
   * value of the Behavior changes
   *
   * @name changes
   * @memberof Frampton.Signals
   * @static
   * @param {Behavior} behavior A behavior to feed the EventStream
   * @returns {Frampton.Signals.EventStream}
   */
  module.exports = changes;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _EventStream = _interopRequire(_framptonSignalsEvent_stream);

  function changes(behavior) {
    return new _EventStream(function (sink) {

      behavior.changes(function (val) {
        sink((0, _framptonSignalsEvent.nextEvent)(val));
      });

      return function changes_cleanup() {
        behavior.destroy();
        behavior = null;
      };
    });
  }
});
define('frampton-signals/constant', ['exports', 'module', 'frampton-signals/behavior'], function (exports, module, _framptonSignalsBehavior) {
  'use strict';

  // constant :: a -> Behavior a
  module.exports = constant;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Behavior = _interopRequire(_framptonSignalsBehavior);

  function constant(val) {
    return _Behavior.of(val);
  }
});
define('frampton-signals/count', ['exports', 'module', 'frampton-signals/stepper'], function (exports, module, _framptonSignalsStepper) {
  'use strict';

  /**
   * Creates a Behavior that counts events on the EventStream
   *
   * @name count
   * @method
   * @memberof Frampton.Signals
   * @param {Frampton.Signals.EventStream} stream
   * @returns {Frampton.Signals.Behavior}
   */
  module.exports = count;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _stepper = _interopRequire(_framptonSignalsStepper);

  function count(stream) {
    var i = 0;
    return (0, _stepper)(0, stream.map(function () {
      return ++i;
    }));
  }
});
define('frampton-signals/delayed', ['exports', 'module', 'frampton-utils/curry', 'frampton-signals/event_stream', 'frampton-signals/event'], function (exports, module, _framptonUtilsCurry, _framptonSignalsEvent_stream, _framptonSignalsEvent) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _EventStream = _interopRequire(_framptonSignalsEvent_stream);

  /**
   * delayed :: Number -> a -> EventStream a
   *
   * @name delayed
   * @method
   * @memberof Frampton.Signals
   * @param {Number} delay Miliseconds to delay the event
   * @param {*}      val   Value to push onto EventStream
   * @returns {Frampton.Signals.EventStream}
   */
  module.exports = (0, _curry)(function delayed(delay, val) {
    return new _EventStream(function (sink) {
      var timer = setTimeout(function () {
        sink((0, _framptonSignalsEvent.nextEvent)(val));
      }, delay || 0);
      return function delayed_cleanup() {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
      };
    });
  });
});
define('frampton-signals/dispatcher', ['exports', 'frampton-utils/noop', 'frampton-list/remove'], function (exports, _framptonUtilsNoop, _framptonListRemove) {
  'use strict';

  exports.__esModule = true;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _noop = _interopRequire(_framptonUtilsNoop);

  var _remove = _interopRequire(_framptonListRemove);

  /**
   * Dispatcher is a helper object that helps the a stream manage its Outlets. A
   * new instance of the Dispatcher is created for each new stream. The owning stream
   * inherits references to its dispatcher's subscribe, broadcast and clear methods.
   *
   * @name Dispatcher
   * @memberof Frampton.Signals
   * @class
   * @private
   * @param  {Frampton.Signals.EventStream} stream The EventStream that owns this instance of the dispatcher.
   */
  function Dispatcher(stream) {

    var subscribers = [],
        sink = null;

    /**
     * Add Outlets to the owning stream.
     *
     * @name subscribe
     * @method
     * @memberof Frampton.Signals.Dispatcher#
     * @param   {Function} fn A callback for this stream
     * @returns {Function} A function to cancel the subscription.
     */
    this.subscribe = function Dispatcher_subscribe(fn) {

      subscribers.push(fn);

      if (subscribers.length === 1) {
        sink = stream.push.bind(stream);
        stream.cleanup = stream.seed(sink) || _noop;
      }

      return function unsub() {
        subscribers = (0, _remove)(fn, subscribers);
        if (subscribers.length === 0) {
          stream.cleanup();
          stream.cleanup = null;
        }
      };
    };

    /**
     * Handles notifying outlets of new data on the stream.
     *
     * @name push
     * @method
     * @memberof Frampton.Signals.Dispatcher#
     * @param {*} data The data to push to subscribers.
     */
    this.push = function Dispatcher_push(event) {
      subscribers.forEach(function (fn) {
        fn(event);
      });
    };

    /**
     * Used to burn it all down when this stream is destroyed.
     *
     * @name destroy
     * @method
     * @memberof Frampton.Signals.Dispatcher#
     */
    this.destroy = function Dispatcher_destroy() {
      if (stream.cleanup) {
        stream.cleanup();
        stream.cleanup = null;
      }
      subscribers = null;
      sink = null;
      this.subscribe = null;
      this.push = null;
    };
  }

  var isDispatcher = function isDispatcher(obj) {
    return obj instanceof Dispatcher;
  };

  exports['default'] = Dispatcher;
  exports.isDispatcher = isDispatcher;
});
define('frampton-signals/empty', ['exports', 'module', 'frampton-signals/event_stream'], function (exports, module, _framptonSignalsEvent_stream) {
  'use strict';

  /**
   * Creates an emtpy EventStream
   *
   * @name empty
   * @method
   * @memberof Frampton.Signals
   * @returns {Frampton.Signals.EventStream}
   */
  module.exports = empty_stream;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _EventStream = _interopRequire(_framptonSignalsEvent_stream);

  function empty_stream() {
    return new _EventStream(null, null);
  }
});
define('frampton-signals/event', ['exports', 'frampton-utils/assert', 'frampton-utils/inherits', 'frampton-utils/is_string', 'frampton-utils/not_implemented'], function (exports, _framptonUtilsAssert, _framptonUtilsInherits, _framptonUtilsIs_string, _framptonUtilsNot_implemented) {
  'use strict';

  exports.__esModule = true;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _assert = _interopRequire(_framptonUtilsAssert);

  var _inherits = _interopRequire(_framptonUtilsInherits);

  var _isString = _interopRequire(_framptonUtilsIs_string);

  var _notImplemented = _interopRequire(_framptonUtilsNot_implemented);

  /**
   * The value of a observable
   *
   * @name Event
   * @memberof Frampton.Signals
   * @class
   */
  function Event(value) {}

  Event.of = function (value) {
    return new Next(value);
  };

  Event.prototype.of = Event.of;

  Event.prototype.ap = _notImplemented;

  Event.prototype.map = _notImplemented;

  Event.prototype.recover = _notImplemented;

  Event.prototype.filter = _notImplemented;

  Event.prototype.get = function () {
    return this._value;
  };

  Event.prototype.isEmpty = function () {
    return false;
  };

  Event.prototype.isEnd = function () {
    return false;
  };

  Event.prototype.isNext = function () {
    return false;
  };

  Event.prototype.isError = function () {
    return false;
  };

  /**
   * @class Next
   * @memberof Frampton.Signals
   * @extends Frampton.Signals.Event
   */
  (0, _inherits)(Next, Event);

  function Next(value) {
    this._value = value;
  }

  Next.prototype.map = function (fn) {
    return new Next(fn(this._value));
  };

  Next.prototype.recover = function (fn) {
    return new Next(this._value);
  };

  Next.prototype.filter = function (fn) {
    if (fn(this._value)) {
      return new Next(this._value);
    } else {
      return new Empty();
    }
  };

  Next.prototype.isNext = function () {
    return true;
  };

  /**
   * Creates a new Next
   *
   * @name nextEvent
   * @method
   * @memberOf Frampton.Signals
   * @returns {Frampton.Signals.Next}
   */
  function nextEvent(value) {
    return new Next(value);
  }

  /**
   * @class End
   * @memberof Frampton.Signals
   * @extends Frampton.Signals.Event
   */
  (0, _inherits)(End, Event);

  function End(value) {
    this._value = value;
  }

  End.prototype.map = function () {
    return new End(this._value);
  };

  End.prototype.recover = function (fn) {
    return new End(this._value);
  };

  End.prototype.filter = function (fn) {
    if (fn(this._value)) {
      return new End(this._value);
    } else {
      return new Empty();
    }
  };

  End.prototype.isEnd = function () {
    return true;
  };

  /**
   * Creates a new End
   *
   * @name endEvent
   * @method
   * @memberOf Frampton.Signals
   * @returns {Frampton.Signals.End}
   */
  function endEvent(value) {
    return new End(value || null);
  }

  /**
   * @class Error
   * @memberof Frampton.Signals
   * @extends Frampton.Signals.Event
   */
  (0, _inherits)(Error, Event);

  function Error(msg) {
    (0, _assert)('Error requires a message', (0, _isString)(msg));
    this._message = msg;
  }

  Error.prototype.get = function () {
    return this._message;
  };

  Error.prototype.map = function () {
    return new Error(this._message);
  };

  Error.prototype.recover = function (fn) {
    return new Next(fn(this._message));
  };

  Error.prototype.filter = function () {
    return new Error(this._message);
  };

  Error.prototype.isError = function () {
    return true;
  };

  /**
   * Creates a new Error
   *
   * @name errorEvent
   * @method
   * @memberOf Frampton.Signals
   * @returns {Frampton.Signals.Error}
   */
  function errorEvent(msg) {
    return new Error(msg);
  }

  /**
   * @class Empty
   * @memberof Frampton.Signals
   * @extends Frampton.Signals.Event
   */
  (0, _inherits)(Empty, Event);

  function Empty() {}

  Empty.prototype.get = function () {
    return null;
  };

  Empty.prototype.map = function () {
    return new Empty();
  };

  Empty.prototype.recover = function () {
    return new Empty();
  };

  Empty.prototype.filter = function () {
    return new Empty();
  };

  Empty.prototype.isEmpty = function () {
    return true;
  };

  /**
   * Creates a new Empty
   *
   * @name emptyEvent
   * @method
   * @memberOf Frampton.Signals
   * @returns {Frampton.Signals.Emtpy}
   */
  function emptyEvent() {
    return new Empty();
  }

  exports.emptyEvent = emptyEvent;
  exports.errorEvent = errorEvent;
  exports.nextEvent = nextEvent;
  exports.endEvent = endEvent;
});
define('frampton-signals/event_stream', ['exports', 'frampton-utils/apply', 'frampton-utils/guid', 'frampton-utils/identity', 'frampton-utils/is_equal', 'frampton-utils/is_function', 'frampton-utils/is_undefined', 'frampton-utils/log', 'frampton-utils/noop', 'frampton-utils/of_value', 'frampton-signals/event', 'frampton-signals/stepper', 'frampton-signals/dispatcher'], function (exports, _framptonUtilsApply, _framptonUtilsGuid, _framptonUtilsIdentity, _framptonUtilsIs_equal, _framptonUtilsIs_function, _framptonUtilsIs_undefined, _framptonUtilsLog, _framptonUtilsNoop, _framptonUtilsOf_value, _framptonSignalsEvent, _framptonSignalsStepper, _framptonSignalsDispatcher) {
  'use strict';

  exports.__esModule = true;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _apply = _interopRequire(_framptonUtilsApply);

  var _guid = _interopRequire(_framptonUtilsGuid);

  var _identity = _interopRequire(_framptonUtilsIdentity);

  var _isEqual = _interopRequire(_framptonUtilsIs_equal);

  var _isFunction = _interopRequire(_framptonUtilsIs_function);

  var _isUndefined = _interopRequire(_framptonUtilsIs_undefined);

  var _log = _interopRequire(_framptonUtilsLog);

  var _noop = _interopRequire(_framptonUtilsNoop);

  var _ofValue = _interopRequire(_framptonUtilsOf_value);

  var _stepper = _interopRequire(_framptonSignalsStepper);

  var _Dispatcher = _interopRequire(_framptonSignalsDispatcher);

  // Creates a new stream with a given transform.
  function withTransform(source, transform) {
    return new EventStream(function (sink) {
      return source.subscribe(function (event) {
        sink(event);
      });
    }, transform);
  }

  function fromMerge() {
    for (var _len = arguments.length, streams = Array(_len), _key = 0; _key < _len; _key++) {
      streams[_key] = arguments[_key];
    }

    var breakers = [];

    return new EventStream(function (sink) {

      streams.forEach(function (source) {
        breakers.push(source.subscribe(function (event) {
          sink(event);
        }));
      });

      return function merge_cleanup() {
        breakers.forEach(_apply);
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
    this._id = (0, _guid)();
    this.seed = seed || _noop;
    this.transform = transform || _identity;
    this.dispatcher = new _Dispatcher(this);
    this.cleanup = null;
    this.isClosed = false;
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
    } catch (e) {
      (0, _log)('error: ', e);
      this.dispatcher.push((0, _framptonSignalsEvent.errorEvent)(e.message));
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
    this.push((0, _framptonSignalsEvent.nextEvent)(val));
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
    this.push((0, _framptonSignalsEvent.errorEvent)(err));
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
    return this.subscribe(function (event) {
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
    return this.subscribe(function (event) {
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
    return this.subscribe(function (event) {
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
      this.push((0, _framptonSignalsEvent.endEvent)());
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

    return new EventStream(function (sink) {

      breakers.push(source.subscribe(function (event) {
        if (event.isNext()) {
          breakers.push(event.get().subscribe(function (event) {
            sink(event);
          }));
        } else {
          sink(event);
        }
      }));

      return function chain_cleanup() {
        breakers.forEach(_apply);
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

    return new EventStream(function (sink) {

      breakers.push(source.next(function (_) {
        breakers.push(stream.next(function (val) {
          sink((0, _framptonSignalsEvent.nextEvent)(val));
        }));
      }));

      return function concat_cleanup() {
        breakers.forEach(_apply);
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

    var source = this;
    var innerStream = null;
    var breakers = [];

    return new EventStream(function (sink) {

      breakers.push(source.subscribe(function (event) {

        if (event.isNext()) {

          if (innerStream) {
            innerStream.close();
            innerStream = null;
          }

          innerStream = fn(event.get());
          innerStream.subscribe(function (event) {
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
        breakers.forEach(_apply);
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

    return new EventStream(function (sink) {

      var fn = _identity;

      breakers.push(source.subscribe(function (event) {
        if (event.isNext()) {
          fn = event.get();
        }
      }));

      breakers.push(stream.subscribe(function (event) {
        if (event.isNext()) {
          sink((0, _framptonSignalsEvent.nextEvent)(fn(event.get())));
        } else {
          sink(event);
        }
      }));

      return function ap_cleanup() {
        breakers.forEach(_apply);
        breakers = null;
        source = null;
      };
    });
  };

  /**
   * map :: EventStream a -> (a -> b) -> EventStream b
   *
   * Maps the values on this EventStream with the given function.
   *
   * @name map
   * @method
   * @memberof Frampton.Signals.EventStream#
   * @param {Function} mapping A function to transform values on the stream
   * @returns {Frampton.Signals.EventStream}
   */
  EventStream.prototype.map = function EventStream_map(mapping) {
    var mappingFn = (0, _isFunction)(mapping) ? mapping : (0, _ofValue)(mapping);
    return withTransform(this, function (event) {
      return event.map(mappingFn);
    });
  };

  /**
   * recover :: EventStream a -> (err -> a) -> EventStream a
   *
   * Maps an ErrorEvent to a NextEvent if the EventStream gets an error.
   *
   * @name recover
   * @method
   * @memberof EventStream.Signals.EventStream#
   * @param {Function} mapping A function to map an error to a value
   * @returns {Frampton.Signals.EventStream}
   */
  EventStream.prototype.recover = function EventStream_recover(mapping) {
    var mappingFn = (0, _isFunction)(mapping) ? mapping : (0, _ofValue)(mapping);
    return withTransform(this, function (event) {
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
    var filterFn = (0, _isFunction)(predicate) ? predicate : (0, _isEqual)(predicate);
    return withTransform(this, function (event) {
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
    return this.filter(function (val) {
      return (0, _isFunction)(val.isJust) && val.isJust();
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
    return this.filter(function (val) {
      if (val !== saved) {
        saved = val;
        return true;
      }
      return false;
    });
  };

  /**
   * scan :: EventStream a -> b -> (a -> b) -> Behavior b
   *
   * @name scan
   * @method
   * @memberof Frampton.Signals.EventStream#
   * @param {*} initial An initial value for the returned Behavior
   * @param {Function} mapping A function to map values on the stream before giving them to Behavior
   * @returns {Frampton.Signals.Behavior}
   */
  EventStream.prototype.scan = function EventStream_scan(initial, mapping) {
    return (0, _stepper)(initial, this.map(mapping));
  };

  /**
   * sample :: EventStream a -> Behavior b -> EventStream b
   *
   * @name sample
   * @method
   * @memberof Frampton.Signals.EventStream#
   * @param {Frampton.Signals.Behavior} behavior
   * @returns {Frampton.Signals.EventStream}
   */
  EventStream.prototype.sample = function EventStream_sample(behavior) {
    var source = this;
    var breakers = [];
    return new EventStream(function (sink) {
      breakers.push(source.subscribe(function (event) {
        if (event.isNext()) {
          sink((0, _framptonSignalsEvent.nextEvent)(behavior.value));
        } else {
          sink(event);
        }
      }));
      return function sample_cleanup() {
        breakers.forEach(_apply);
        breakers = null;
        source = null;
      };
    });
  };

  /**
   * fold :: EventStream a -> (a -> s -> s) -> s -> EventStream s
   *
   * @name fold
   * @method
   * @memberof Frampton.Signals.EventStream#
   * @param {Function} fn  A function to reduce values on the stream
   * @param {*}        acc An initial value for the fold
   * @returns {Frampton.Signals.EventStream}
   */
  EventStream.prototype.fold = function EventStream_fold(fn, acc) {
    return withTransform(this, function (event) {
      if (event.isNext()) {
        acc = (0, _isUndefined)(acc) ? event.get() : fn(acc, event.get());
        return (0, _framptonSignalsEvent.nextEvent)(acc);
      } else {
        return event;
      }
    });
  };

  /**
   * withPrevious :: EventStream a -> EventStream a
   *
   * @name withPrevious
   * @method
   * @memberof Frampton.Signals.EventStream#
   * @param {Number} [limit=2] Number of previous values to save
   * @returns {Frampton.Signals.EventStream}
   */
  EventStream.prototype.withPrevious = function EventStream_withPrevious(limit) {
    return this.fold(function (acc, next) {
      if (acc.length >= (limit || 2)) acc.shift();
      acc.push(next);
      return acc;
    }, []);
  };

  /**
   * take :: EventStream a -> Number n -> EventStream a
   *
   * @name take
   * @method
   * @memberof Frampton.Signals.EventStream#
   * @param {Number} limit The number of events to take
   * @returns {Frampton.Signals.EventStream}
   */
  EventStream.prototype.take = function EventStream_take(limit) {

    var source = this;
    var breaker = null;

    return new EventStream(function (sink) {

      var stream = this;

      breaker = source.subscribe(function (event) {
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
   *
   * Takes events from the EventStream whitle the function returns true. Once
   * it returns false the stream is closed.
   *
   * @name takeWhile
   * @method
   * @memberof Frampton.Signals.EventStream#
   * @param {Function} predicate A function to test against.
   * @returns {Frampton.Signals.EventStream}
   */
  EventStream.prototype.takeWhile = function EventStream_takeWhile(predicate) {

    var source = this;
    var breaker = null;

    return new EventStream(function take_while_seed(sink) {

      var stream = this;

      breaker = source.subscribe(function (event) {
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
   * Take the first event off an EventStream
   *
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

    return new EventStream(function (sink) {

      breaker = source.subscribe(function (event) {
        if (event.isNext()) {
          if (number-- === 0) {
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

    var source = this;
    var breakers = [];

    return new EventStream(function (sink) {

      breakers.push(source.subscribe(function (event) {
        if (event.isNext()) {
          sink((0, _framptonSignalsEvent.nextEvent)([event.get(), behavior.value]));
        } else {
          sink(event);
        }
      }));

      return function break_zip() {
        breakers.forEach(_apply);
        breakers = null;
        source = null;
      };
    });
  };

  /**
   * debounce :: EventStream a -> Number -> EventStream a
   *
   * @name debounce
   * @method
   * @memberof Frampton.Signals.EventStream#
   */
  EventStream.prototype.debounce = function EventStream_debounce(delay) {

    var source = this;
    var timerId = null;
    var breakers = [];

    return new EventStream(function (sink) {

      breakers.push(source.subscribe(function (event) {

        if (event.isNext()) {

          if (timerId) clearTimeout(timerId);

          timerId = setTimeout(function () {
            sink((0, _framptonSignalsEvent.nextEvent)(event.get()));
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
        breakers.forEach(_apply);
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

    var source = this;
    var timer = null;
    var saved = null;
    var breakers = [];

    return new EventStream(function (sink) {

      function applyTimeout() {

        return setTimeout(function () {

          timer = null;

          if (saved) {
            sink((0, _framptonSignalsEvent.nextEvent)(saved));
            saved = null;
          }
        }, delay);
      }

      breakers.push(source.subscribe(function (event) {

        if (event.isNext()) {
          saved = event.get();
          timer = timer !== null ? timer : applyTimeout();
        } else {
          sink(event);
        }
      }));

      return function throttle_cleanup() {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        breakers.forEach(_apply);
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
  EventStream.prototype.and = function (behavior) {

    var source = this;
    var breakers = [];

    return new EventStream(function (sink) {

      breakers.push(source.subscribe(function (event) {

        if (event.isNext()) {
          if (behavior.value) {
            sink(event);
          }
        } else {
          sink(event);
        }
      }));

      return function and_cleanup() {
        breakers.forEach(_apply);
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
  EventStream.prototype.not = function (behavior) {

    var source = this;
    var breakers = [];

    return new EventStream(function (sink) {

      breakers.push(source.subscribe(function (event) {

        if (event.isNext()) {
          if (!behavior.value) {
            sink(event);
          }
        } else {
          sink(event);
        }
      }));

      return function not_cleanup() {
        breakers.forEach(_apply);
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
    return withTransform(this, function (event) {
      return event.map(function (evt) {
        if ((0, _isFunction)(evt.preventDefault) && (0, _isFunction)(evt.stopPropagation)) {
          evt.preventDefault();
          evt.stopPropagation();
        }
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
    return withTransform(this, function (event) {
      if (msg) {
        (0, _log)(msg, event.get());
      } else {
        (0, _log)(event.get());
      }
      return event;
    });
  };

  var isEventStream = function is_event_stream(obj) {
    return obj instanceof EventStream;
  };

  exports['default'] = EventStream;
  exports.merge = fromMerge;
  exports.isEventStream = isEventStream;
});
define('frampton-signals/interval', ['exports', 'module', 'frampton-signals/event_stream', 'frampton-signals/event'], function (exports, module, _framptonSignalsEvent_stream, _framptonSignalsEvent) {
  'use strict';

  /**
   * Creates a new stream that fires for each animation frame.
   *
   * @name interval
   * @method
   * @memberof Frampton.Signals
   * @returns {Frampton.Signals.EventStream} A new EventStream
   */
  module.exports = interval;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _EventStream = _interopRequire(_framptonSignalsEvent_stream);

  function interval() {
    return new _EventStream(function (sink) {

      var frame = 0;
      var requestId = null;
      var isStopped = false;

      requestId = requestAnimationFrame(function step() {
        sink((0, _framptonSignalsEvent.nextEvent)(frame++));
        if (!isStopped) requestId = requestAnimationFrame(step);
      });

      return function interval_destroy() {
        cancelAnimationFrame(requestId);
        isStopped = true;
        requestId = null;
      };
    });
  }
});
define('frampton-signals/map', ['exports', 'module', 'frampton-utils/curry', 'frampton-signals/map_many'], function (exports, module, _framptonUtilsCurry, _framptonSignalsMap_many) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _mapMany = _interopRequire(_framptonSignalsMap_many);

  // map :: (a -> b) -> Behavior a -> Behavior b
  module.exports = (0, _curry)(function map(fn, a) {
    return (0, _mapMany)(function () {
      return fn(a.value);
    }, a);
  });
});
define('frampton-signals/map2', ['exports', 'module', 'frampton-utils/curry', 'frampton-signals/map_many'], function (exports, module, _framptonUtilsCurry, _framptonSignalsMap_many) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _mapMany = _interopRequire(_framptonSignalsMap_many);

  // map2 :: (a -> b -> c) -> Behavior a -> Behavior b -> Behavior c
  module.exports = (0, _curry)(function map2(fn, a, b) {
    return (0, _mapMany)(function () {
      return fn(a.value, b.value);
    }, a, b);
  });
});
define('frampton-signals/map3', ['exports', 'module', 'frampton-utils/curry', 'frampton-signals/map_many'], function (exports, module, _framptonUtilsCurry, _framptonSignalsMap_many) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _mapMany = _interopRequire(_framptonSignalsMap_many);

  // map3 :: (a -> b -> c -> d) -> Behavior a -> Behavior b -> Behavior c -> Behavior d
  module.exports = (0, _curry)(function map3(fn, a, b, c) {
    return (0, _mapMany)(function () {
      return fn(a.value, b.value, c.value);
    }, a, b, c);
  });
});
define('frampton-signals/map4', ['exports', 'module', 'frampton-utils/curry', 'frampton-signals/map_many'], function (exports, module, _framptonUtilsCurry, _framptonSignalsMap_many) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _mapMany = _interopRequire(_framptonSignalsMap_many);

  // map4 :: (a -> b -> c -> d -> e) -> Behavior a -> Behavior b -> Behavior c -> Behavior d -> Behavior e
  module.exports = (0, _curry)(function map4(fn, a, b, c, d) {
    return (0, _mapMany)(function () {
      return fn(a.value, b.value, c.value, d.value);
    }, a, b, c, d);
  });
});
define('frampton-signals/map5', ['exports', 'module', 'frampton-utils/curry', 'frampton-signals/map_many'], function (exports, module, _framptonUtilsCurry, _framptonSignalsMap_many) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _mapMany = _interopRequire(_framptonSignalsMap_many);

  // map5 :: (a -> b -> c -> d -> e -> f) -> Behavior a -> Behavior b -> Behavior c -> Behavior d -> Behavior e -> Behavior f
  module.exports = (0, _curry)(function map5(fn, a, b, c, d, e) {
    return (0, _mapMany)(function () {
      return fn(a.value, b.value, c.value, d.value, e.value);
    }, a, b, c, d, e);
  });
});
define('frampton-signals/map_many', ['exports', 'module', 'frampton-signals/behavior'], function (exports, module, _framptonSignalsBehavior) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Behavior = _interopRequire(_framptonSignalsBehavior);

  // map_many :: Function -> [Behavior] -> Behavior

  module.exports = function (mapping) {
    for (var _len = arguments.length, behaviors = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      behaviors[_key - 1] = arguments[_key];
    }

    return new _Behavior(mapping(), function (sink) {
      behaviors.forEach(function (behavior) {
        behavior.changes(function () {
          return sink(mapping());
        });
      });
    });
  };
});
define('frampton-signals/null', ['exports', 'module', 'frampton-signals/empty'], function (exports, module, _framptonSignalsEmpty) {
  'use strict';

  module.exports = null_stream;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _empty = _interopRequire(_framptonSignalsEmpty);

  var instance = null;

  function null_stream() {
    return instance !== null ? instance : instance = (0, _empty)();
  }
});
define('frampton-signals/once', ['exports', 'module', 'frampton-signals/event_stream', 'frampton-signals/event'], function (exports, module, _framptonSignalsEvent_stream, _framptonSignalsEvent) {
  'use strict';

  /**
   * once :: a -> EventStream a
   *
   * @name of
   * @memberof Frampton.Signals
   * @static
   * @param {*} An initial value for the EventStream
   * @returns {Frampton.Signals.EventStream}
   */
  module.exports = once;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _EventStream = _interopRequire(_framptonSignalsEvent_stream);

  function once(val) {
    return new _EventStream(function (sink) {
      sink((0, _framptonSignalsEvent.nextEvent)(val));
    });
  }
});
define('frampton-signals/send', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  // send :: EventStream a -> EventStream b -> Task [a, b] -> ()
  module.exports = (0, _curry)(function send(errors, values, task) {
    task.run(function (err) {
      return errors.pushNext(err);
    }, function (val) {
      return values.pushNext(val);
    });
  });
});
define('frampton-signals/sequential', ['exports', 'module', 'frampton-utils/curry', 'frampton-list/drop', 'frampton-signals/event_stream', 'frampton-signals/event'], function (exports, module, _framptonUtilsCurry, _framptonListDrop, _framptonSignalsEvent_stream, _framptonSignalsEvent) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _drop = _interopRequire(_framptonListDrop);

  var _EventStream = _interopRequire(_framptonSignalsEvent_stream);

  /**
   * Creates a new stream that sequentially emits the values of the given
   * array with the provided delay between each value.
   * @name sequential
   * @method
   * @memberof Frampton.Signals
   * @param {Number} delay Millisecond delay
   * @param {Array}  arr   Array of values
   * @returns {Frampton.Signals.EventStream} A new EventStream
   */
  module.exports = (0, _curry)(function sequential(delay, arr) {
    return new _EventStream(function (sink) {

      var stream = this;
      var isStopped = false;
      var timerId = null;

      function step(arr) {
        timerId = setTimeout(function () {
          sink((0, _framptonSignalsEvent.nextEvent)(arr[0]));
          timerId = null;
          if (arr.length > 1 && !isStopped) {
            step((0, _drop)(1, arr));
          } else {
            stream.close();
          }
        }, delay);
      }

      step(arr);

      return function sequential_destroy() {
        if (timerId) {
          clearTimeout(timerId);
          timerId = null;
        }
        isStopped = true;
        stream = null;
        arr = null;
      };
    });
  });
});
define('frampton-signals/snapshot', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  module.exports = (0, _curry)(function (behavior, stream) {
    return stream.sample(behavior);
  });
});
define('frampton-signals/stepper', ['exports', 'module', 'frampton-utils/curry', 'frampton-signals/behavior'], function (exports, module, _framptonUtilsCurry, _framptonSignalsBehavior) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _Behavior = _interopRequire(_framptonSignalsBehavior);

  // stepper :: a -> EventStream a -> Behavior a
  module.exports = (0, _curry)(function stepper(initial, stream) {
    return new _Behavior(initial, function (sink) {
      return stream.next(function (val) {
        sink(val);
      });
    });
  });
});
define('frampton-signals/swap', ['exports', 'module', 'frampton-utils/curry', 'frampton-signals/stepper'], function (exports, module, _framptonUtilsCurry, _framptonSignalsStepper) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _stepper = _interopRequire(_framptonSignalsStepper);

  module.exports = (0, _curry)(function toggle(stream1, stream2) {
    return (0, _stepper)(false, stream1.map(true).merge(stream2.map(false)));
  });
});
define('frampton-signals/toggle', ['exports', 'module', 'frampton-utils/curry', 'frampton-signals/behavior'], function (exports, module, _framptonUtilsCurry, _framptonSignalsBehavior) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _Behavior = _interopRequire(_framptonSignalsBehavior);

  // toggle :: Boolean -> EventStream a -> Behavior Boolean
  module.exports = (0, _curry)(function toggle(initial, stream) {
    return new _Behavior(!!initial, function (sink) {
      return stream.next(function (val) {
        setTimeout(function () {
          if (initial) {
            sink(initial = false);
          } else {
            sink(initial = true);
          }
        }, 0);
      });
    });
  });
});
define('frampton-string', ['exports', 'frampton/namespace', 'frampton-string/replace', 'frampton-string/trim', 'frampton-string/join', 'frampton-string/split', 'frampton-string/lines', 'frampton-string/words', 'frampton-string/starts_with', 'frampton-string/ends_with', 'frampton-string/contains', 'frampton-string/capitalize', 'frampton-string/dash_to_camel', 'frampton-string/length', 'frampton-string/normalize_newline'], function (exports, _framptonNamespace, _framptonStringReplace, _framptonStringTrim, _framptonStringJoin, _framptonStringSplit, _framptonStringLines, _framptonStringWords, _framptonStringStarts_with, _framptonStringEnds_with, _framptonStringContains, _framptonStringCapitalize, _framptonStringDash_to_camel, _framptonStringLength, _framptonStringNormalize_newline) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Frampton = _interopRequire(_framptonNamespace);

  var _replace = _interopRequire(_framptonStringReplace);

  var _trim = _interopRequire(_framptonStringTrim);

  var _join = _interopRequire(_framptonStringJoin);

  var _split = _interopRequire(_framptonStringSplit);

  var _lines = _interopRequire(_framptonStringLines);

  var _words = _interopRequire(_framptonStringWords);

  var _startsWith = _interopRequire(_framptonStringStarts_with);

  var _endsWith = _interopRequire(_framptonStringEnds_with);

  var _contains = _interopRequire(_framptonStringContains);

  var _capitalize = _interopRequire(_framptonStringCapitalize);

  var _dashToCamel = _interopRequire(_framptonStringDash_to_camel);

  var _length = _interopRequire(_framptonStringLength);

  var _normalizeNewline = _interopRequire(_framptonStringNormalize_newline);

  /**
   * @name String
   * @namespace
   * @memberof Frampton
   */
  _Frampton.String = {};
  _Frampton.String.replace = _replace;
  _Frampton.String.trim = _trim;
  _Frampton.String.join = _join;
  _Frampton.String.split = _split;
  _Frampton.String.lines = _lines;
  _Frampton.String.words = _words;
  _Frampton.String.startsWith = _startsWith;
  _Frampton.String.endsWith = _endsWith;
  _Frampton.String.contains = _contains;
  _Frampton.String.capitalize = _capitalize;
  _Frampton.String.dashToCamel = _dashToCamel;
  _Frampton.String.length = _length;
  _Frampton.String.normalizeNewline = _normalizeNewline;
});
define("frampton-string/capitalize", ["exports", "module"], function (exports, module) {
  "use strict";

  module.exports = capitalize;

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
});
define('frampton-string/contains', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  // contains :: String -> String -> Boolean
  module.exports = (0, _curry)(function contains(sub, str) {
    return str.indexOf(sub) > -1;
  });
});
define("frampton-string/dash_to_camel", ["exports", "module"], function (exports, module) {
  "use strict";

  module.exports = dash_to_camel;

  function dash_to_camel(str) {
    return str.replace(/-([a-z])/g, function (m, w) {
      return w.toUpperCase();
    });
  }
});
define('frampton-string/ends_with', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  // ends_with :: String -> String -> Boolean
  module.exports = (0, _curry)(function ends_with(sub, str) {
    return str.length >= sub.length && str.lastIndexOf(sub) === str.length - sub.length;
  });
});
define('frampton-string/is_empty', ['exports', 'module'], function (exports, module) {
  'use strict';

  module.exports = is_empty;

  function is_empty(str) {
    return str.trim() === '';
  }
});
define('frampton-string/join', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  /**
   * join :: String -> Array String -> String
   * @name join
   * @method
   * @memberof Frampton.String
   * @param {String} sep
   * @param {Array} strs
   * @returns {String}
   */
  module.exports = (0, _curry)(function join(sep, strs) {
    return strs.join(sep);
  });
});
define('frampton-string/length', ['exports', 'module', 'frampton-utils/is_something', 'frampton-utils/is_defined', 'frampton-string/normalize_newline'], function (exports, module, _framptonUtilsIs_something, _framptonUtilsIs_defined, _framptonStringNormalize_newline) {
  'use strict';

  /**
   * @name length
   * @memberof Frampton.String
   * @static
   * @param {String}
   * @returns {Number}
   */
  module.exports = length;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isSomething = _interopRequire(_framptonUtilsIs_something);

  var _isDefined = _interopRequire(_framptonUtilsIs_defined);

  var _normalizeNewline = _interopRequire(_framptonStringNormalize_newline);

  function length(str) {
    return (0, _isSomething)(str) && (0, _isDefined)(str.length) ? (0, _normalizeNewline)(str).length : 0;
  }
});
define("frampton-string/lines", ["exports", "module"], function (exports, module) {
  // lines :: String -> Array String
  "use strict";

  module.exports = lines;

  function lines(str) {
    return str.split(/\r\n|\r|\n/g);
  }
});
define('frampton-string/normalize_newline', ['exports', 'module'], function (exports, module) {
  /**
   * Returns a string with newlines normalized to \n. Windows machines will use
   * \r\n for newlines which can lead to irregularities when dealing with strings
   *
   * @name normalizeNewline
   * @memberof Frampton.String
   * @static
   * @param {String} str
   * @returns {String}
   */
  'use strict';

  module.exports = normalize_newline;

  function normalize_newline(str) {
    return str.replace(/\r\n/g, '\n');
  }
});
define('frampton-string/replace', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  /**
   * replace :: String -> String -> String -> String
   * @name replace
   * @method
   * @memberof Frampton.String
   * @param {String} newSubStr
   * @param {String} oldSubStr
   * @param {String} str
   * @returns {String}
   */
  module.exports = (0, _curry)(function replace(newSubStr, oldSubStr, str) {
    return str.replace(oldSubStr, newSubStr);
  });
});
define('frampton-string/split', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  // split :: String -> String -> Array String
  module.exports = (0, _curry)(function join(sep, str) {
    return str.split(sep);
  });
});
define('frampton-string/starts_with', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  // starts_with :: String -> String -> Boolean
  module.exports = (0, _curry)(function starts_with(sub, str) {
    return str.indexOf(sub) === 0;
  });
});
define("frampton-string/trim", ["exports", "module"], function (exports, module) {
  "use strict";

  module.exports = trim;

  function trim(str) {
    return str.trim();
  }
});
define("frampton-string/words", ["exports", "module"], function (exports, module) {
  // words :: String -> Array String
  "use strict";

  module.exports = words;

  function words(str) {
    return str.trim().split(/\s+/g);
  }
});
define('frampton-style', ['exports', 'frampton/namespace', 'frampton-style/add_class', 'frampton-style/remove_class', 'frampton-style/has_class', 'frampton-style/matches', 'frampton-style/current_value', 'frampton-style/set_style', 'frampton-style/remove_style', 'frampton-style/apply_styles', 'frampton-style/remove_styles', 'frampton-style/closest', 'frampton-style/contains', 'frampton-style/supported', 'frampton-style/supported_props'], function (exports, _framptonNamespace, _framptonStyleAdd_class, _framptonStyleRemove_class, _framptonStyleHas_class, _framptonStyleMatches, _framptonStyleCurrent_value, _framptonStyleSet_style, _framptonStyleRemove_style, _framptonStyleApply_styles, _framptonStyleRemove_styles, _framptonStyleClosest, _framptonStyleContains, _framptonStyleSupported, _framptonStyleSupported_props) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Frampton = _interopRequire(_framptonNamespace);

  var _addClass = _interopRequire(_framptonStyleAdd_class);

  var _removeClass = _interopRequire(_framptonStyleRemove_class);

  var _hasClass = _interopRequire(_framptonStyleHas_class);

  var _matches = _interopRequire(_framptonStyleMatches);

  var _current = _interopRequire(_framptonStyleCurrent_value);

  var _setStyle = _interopRequire(_framptonStyleSet_style);

  var _removeStyle = _interopRequire(_framptonStyleRemove_style);

  var _applyStyles = _interopRequire(_framptonStyleApply_styles);

  var _removeStyles = _interopRequire(_framptonStyleRemove_styles);

  var _closest = _interopRequire(_framptonStyleClosest);

  var _contains = _interopRequire(_framptonStyleContains);

  var _supported = _interopRequire(_framptonStyleSupported);

  var _supportedProps = _interopRequire(_framptonStyleSupported_props);

  /**
   * @name Style
   * @namespace
   * @memberof Frampton
   */
  _Frampton.Style = {};
  _Frampton.Style.addClass = _addClass;
  _Frampton.Style.closest = _closest;
  _Frampton.Style.removeClass = _removeClass;
  _Frampton.Style.hasClass = _hasClass;
  _Frampton.Style.matches = _matches;
  _Frampton.Style.current = _current;
  _Frampton.Style.setStyle = _setStyle;
  _Frampton.Style.removeStyle = _removeStyle;
  _Frampton.Style.applyStyles = _applyStyles;
  _Frampton.Style.removeStyles = _removeStyles;
  _Frampton.Style.contains = _contains;
  _Frampton.Style.supported = _supported;
  _Frampton.Style.supportedProps = _supportedProps;
});
define('frampton-style/add_class', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  /**
   * @name addClass
   * @method
   * @memberof Frampton.Style
   * @param {Object} element
   * @param {String} name
   */
  module.exports = (0, _curry)(function add_class(element, name) {
    element.classList.add(name);
  });
});
define('frampton-style/apply_styles', ['exports', 'module', 'frampton-utils/curry', 'frampton-style/set_style'], function (exports, module, _framptonUtilsCurry, _framptonStyleSet_style) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _setStyle = _interopRequire(_framptonStyleSet_style);

  /**
   * @name applyStyles
   * @method
   * @memberof Frampton.Style
   * @param {Object} element DomNode to add styles to
   * @param {Object} props   Has of props to add
   */
  module.exports = (0, _curry)(function apply_styles(element, props) {
    for (var key in props) {
      (0, _setStyle)(element, key, props[key]);
    }
  });
});
define('frampton-style/closest', ['exports', 'module', 'frampton-utils/curry', 'frampton-style/matches'], function (exports, module, _framptonUtilsCurry, _framptonStyleMatches) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _matches = _interopRequire(_framptonStyleMatches);

  /**
   * Searches up the Dom Tree from a given node and returns the first element
   * that matches the selector. If no match is found, null is returned.
   *
   * @name closest
   * @method
   * @memberof Frampton.Style
   * @param {String} selector Selector to search for
   * @param {Object} element  DomNode to start search from
   * @returns {Object} The first DomNode matching the selector or null.
   */
  module.exports = (0, _curry)(function closest(selector, element) {

    while (element) {
      if ((0, _matches)(selector, element)) {
        break;
      }
      element = element.parentElement;
    }

    return element || null;
  });
});
define('frampton-style/contains', ['exports', 'module', 'frampton-utils/curry', 'frampton-style/matches'], function (exports, module, _framptonUtilsCurry, _framptonStyleMatches) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _matches = _interopRequire(_framptonStyleMatches);

  /**
   * Searches inside the given element and returns true if the given element, or
   * one of its children matches the given selector, false otherwise.
   *
   * @name contains
   * @method
   * @memberof Frampton.Style
   * @param {String} selector Selector to search for
   * @param {Object} element  DomNode to search inside of
   * @returns {Boolean} Is there a match for the selector?
   */
  module.exports = (0, _curry)(function contains(selector, element) {
    return (0, _matches)(selector, element) || element.querySelectorAll(selector).length > 0;
  });
});
define('frampton-style/current_value', ['exports', 'module', 'frampton-utils/curry', 'frampton-style/supported'], function (exports, module, _framptonUtilsCurry, _framptonStyleSupported) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _supported = _interopRequire(_framptonStyleSupported);

  var style = window.getComputedStyle;

  /**
   * current :: DomNode -> String -> String
   *
   * @name currentValue
   * @method
   * @memberof Frampton.Style
   * @param {Object} element DomNode whose property to check
   * @param {String} prop    Name of property to check
   * @returns {String} String representation of current property value
   */
  module.exports = (0, _curry)(function current(element, prop) {
    return style(element).getPropertyValue((0, _supported)(prop));
  });
});
define('frampton-style/has_class', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  /**
   * Returns a Boolean indicated if the given DomNode has the given class.
   *
   * @name hasClass
   * @method
   * @memberof Frampton.Style
   * @param {Object} element DomNode to test
   * @param {String} name    Class to test for
   * @returns {Boolean}
   */
  module.exports = (0, _curry)(function has_class(element, name) {
    return element.classList.contains(name);
  });
});
define('frampton-style/matches', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  /**
   * @name matches
   * @method
   * @memberof Frampton.Style
   * @param {String} selector
   * @param {Object} element
   * @returns {Boolean}
   */
  module.exports = (0, _curry)(function matches(selector, element) {

    var elementList = (element.document || element.ownerDocument).querySelectorAll(selector);
    var i = 0;

    while (elementList[i] && elementList[i] !== element) {
      i++;
    }

    return elementList[i] ? true : false;
  });
});
define('frampton-style/remove_class', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  /**
   * @name removeClass
   * @method
   * @memberof Frampton.Style
   * @param {Object} element
   * @param {String} name
   */
  module.exports = (0, _curry)(function remove_class(element, name) {
    element.classList.remove(name);
  });
});
define('frampton-style/remove_style', ['exports', 'module', 'frampton-utils/curry', 'frampton-style/supported'], function (exports, module, _framptonUtilsCurry, _framptonStyleSupported) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _supported = _interopRequire(_framptonStyleSupported);

  /**
   * @name removeStyle
   * @method
   * @memberof Frampton.Style
   * @param {Object} element
   * @param {String} key
   */
  module.exports = (0, _curry)(function remove_style(element, key) {
    element.style.removeProperty((0, _supported)(key));
  });
});
define('frampton-style/remove_styles', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  /**
   * removeStyles :: DomNode -> Object -> ()
   *
   * @name removeStyles
   * @method
   * @memberof Frampton.Style
   * @param {Object} element A dom node to remove styles from
   * @param {Object} props   A hash of properties to remove
   */
  module.exports = (0, _curry)(function remove_styles(element, props) {
    for (var key in props) {
      element.style.removeProperty(key);
    }
  });
});
define('frampton-style/set_style', ['exports', 'module', 'frampton-utils/curry', 'frampton-style/supported'], function (exports, module, _framptonUtilsCurry, _framptonStyleSupported) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _supported = _interopRequire(_framptonStyleSupported);

  /**
   * @name setStyle
   * @method
   * @memberof Frampton.Style
   * @param {Object} element
   * @param {String} key
   * @param {String} value
   */
  module.exports = (0, _curry)(function set_style(element, key, value) {
    element.style.setProperty((0, _supported)(key), value, '');
  });
});
define('frampton-style/supported', ['exports', 'module', 'frampton-utils/memoize', 'frampton-style/supported_by_element'], function (exports, module, _framptonUtilsMemoize, _framptonStyleSupported_by_element) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _memoize = _interopRequire(_framptonUtilsMemoize);

  var _supportedByElement = _interopRequire(_framptonStyleSupported_by_element);

  /**
   * supported :: String -> String
   *
   * @name supported
   * @method
   * @memberof Frampton.Style
   * @param {String} prop A standard CSS property name
   * @returns {String} The property name with any vendor prefixes required by the browser, or null if the property is not supported
   */
  module.exports = (0, _memoize)((0, _supportedByElement)(document.createElement('div')));
});
define('frampton-style/supported_by_element', ['exports', 'module', 'frampton-utils/curry', 'frampton-utils/is_something', 'frampton-string/capitalize', 'frampton-string/dash_to_camel'], function (exports, module, _framptonUtilsCurry, _framptonUtilsIs_something, _framptonStringCapitalize, _framptonStringDash_to_camel) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _isSomething = _interopRequire(_framptonUtilsIs_something);

  var _capitalize = _interopRequire(_framptonStringCapitalize);

  var _dashToCamel = _interopRequire(_framptonStringDash_to_camel);

  var vendors = {
    'webkit': 'webkit',
    'Webkit': 'webkit',
    'Moz': 'moz',
    'ms': 'ms',
    'Ms': 'ms'
  };

  /**
   * @name supportedByElement
   * @method
   * @memberof Frampton.Style
   * @param {Object} element
   * @param {String} prop
   * @returns {String}
   */
  module.exports = (0, _curry)(function supported_by_element(element, prop) {

    var camelProp = (0, _dashToCamel)(prop);

    if ((0, _isSomething)(element.style[camelProp])) {
      return prop;
    }

    for (var key in vendors) {
      var propToCheck = key + (0, _capitalize)(camelProp);
      if ((0, _isSomething)(element.style[propToCheck])) {
        return ('-' + vendors[key] + '-' + prop).toLowerCase();
      }
    }

    return null;
  });
});
define('frampton-style/supported_props', ['exports', 'module', 'frampton-style/supported'], function (exports, module, _framptonStyleSupported) {
  'use strict';

  /**
   * @name supportedProps
   * @method
   * @memberof Frampton.Style
   * @param {Object} props
   * @returns {Object}
   */
  module.exports = supported_props;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _supported = _interopRequire(_framptonStyleSupported);

  function supported_props(props) {
    var obj = {};
    for (var key in props) {
      obj[(0, _supported)(key)] = props[key];
    }
    return obj;
  }
});
define('frampton-utils', ['exports', 'frampton/namespace', 'frampton-utils/apply', 'frampton-utils/assert', 'frampton-utils/compose', 'frampton-utils/curry', 'frampton-utils/equal', 'frampton-utils/extend', 'frampton-utils/get', 'frampton-utils/has_length', 'frampton-utils/identity', 'frampton-utils/immediate', 'frampton-utils/is_array', 'frampton-utils/is_boolean', 'frampton-utils/is_defined', 'frampton-utils/is_empty', 'frampton-utils/is_equal', 'frampton-utils/is_function', 'frampton-utils/is_nothing', 'frampton-utils/is_null', 'frampton-utils/is_object', 'frampton-utils/is_promise', 'frampton-utils/is_something', 'frampton-utils/is_string', 'frampton-utils/is_undefined', 'frampton-utils/log', 'frampton-utils/lazy', 'frampton-utils/memoize', 'frampton-utils/noop', 'frampton-utils/not', 'frampton-utils/of_value'], function (exports, _framptonNamespace, _framptonUtilsApply, _framptonUtilsAssert, _framptonUtilsCompose, _framptonUtilsCurry, _framptonUtilsEqual, _framptonUtilsExtend, _framptonUtilsGet, _framptonUtilsHas_length, _framptonUtilsIdentity, _framptonUtilsImmediate, _framptonUtilsIs_array, _framptonUtilsIs_boolean, _framptonUtilsIs_defined, _framptonUtilsIs_empty, _framptonUtilsIs_equal, _framptonUtilsIs_function, _framptonUtilsIs_nothing, _framptonUtilsIs_null, _framptonUtilsIs_object, _framptonUtilsIs_promise, _framptonUtilsIs_something, _framptonUtilsIs_string, _framptonUtilsIs_undefined, _framptonUtilsLog, _framptonUtilsLazy, _framptonUtilsMemoize, _framptonUtilsNoop, _framptonUtilsNot, _framptonUtilsOf_value) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Frampton = _interopRequire(_framptonNamespace);

  var _apply = _interopRequire(_framptonUtilsApply);

  var _assert = _interopRequire(_framptonUtilsAssert);

  var _compose = _interopRequire(_framptonUtilsCompose);

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _equal = _interopRequire(_framptonUtilsEqual);

  var _extend = _interopRequire(_framptonUtilsExtend);

  var _get = _interopRequire(_framptonUtilsGet);

  var _hasLength = _interopRequire(_framptonUtilsHas_length);

  var _identity = _interopRequire(_framptonUtilsIdentity);

  var _immediate = _interopRequire(_framptonUtilsImmediate);

  var _isArray = _interopRequire(_framptonUtilsIs_array);

  var _isBoolean = _interopRequire(_framptonUtilsIs_boolean);

  var _isDefined = _interopRequire(_framptonUtilsIs_defined);

  var _isEmpty = _interopRequire(_framptonUtilsIs_empty);

  var _isEqual = _interopRequire(_framptonUtilsIs_equal);

  var _isFunction = _interopRequire(_framptonUtilsIs_function);

  var _isNothing = _interopRequire(_framptonUtilsIs_nothing);

  var _isNull = _interopRequire(_framptonUtilsIs_null);

  var _isObject = _interopRequire(_framptonUtilsIs_object);

  var _isPromise = _interopRequire(_framptonUtilsIs_promise);

  var _isSomething = _interopRequire(_framptonUtilsIs_something);

  var _isString = _interopRequire(_framptonUtilsIs_string);

  var _isUndefined = _interopRequire(_framptonUtilsIs_undefined);

  var _log = _interopRequire(_framptonUtilsLog);

  var _lazy = _interopRequire(_framptonUtilsLazy);

  var _memoize = _interopRequire(_framptonUtilsMemoize);

  var _noop = _interopRequire(_framptonUtilsNoop);

  var _not = _interopRequire(_framptonUtilsNot);

  var _ofValue = _interopRequire(_framptonUtilsOf_value);

  /**
   * @name Utils
   * @namespace
   * @memberof Frampton
   */
  _Frampton.Utils = {};
  _Frampton.Utils.apply = _apply;
  _Frampton.Utils.assert = _assert;
  _Frampton.Utils.compose = _compose;
  _Frampton.Utils.curry = _curry;
  _Frampton.Utils.equal = _equal;
  _Frampton.Utils.extend = _extend;
  _Frampton.Utils.get = _get;
  _Frampton.Utils.hasLength = _hasLength;
  _Frampton.Utils.identity = _identity;
  _Frampton.Utils.immediate = _immediate;
  _Frampton.Utils.isArray = _isArray;
  _Frampton.Utils.isBoolean = _isBoolean;
  _Frampton.Utils.isDefined = _isDefined;
  _Frampton.Utils.isEmpty = _isEmpty;
  _Frampton.Utils.isEqual = _isEqual;
  _Frampton.Utils.isFunction = _isFunction;
  _Frampton.Utils.isNothing = _isNothing;
  _Frampton.Utils.isNull = _isNull;
  _Frampton.Utils.isObject = _isObject;
  _Frampton.Utils.isPromise = _isPromise;
  _Frampton.Utils.isSomething = _isSomething;
  _Frampton.Utils.isString = _isString;
  _Frampton.Utils.isUndefined = _isUndefined;
  _Frampton.Utils.log = _log;
  _Frampton.Utils.lazy = _lazy;
  _Frampton.Utils.memoize = _memoize;
  _Frampton.Utils.noop = _noop;
  _Frampton.Utils.not = _not;
  _Frampton.Utils.ofValue = _ofValue;
});
define("frampton-utils/apply", ["exports", "module"], function (exports, module) {
  /**
   * Takes a function and warps it to be called at a later time.
   * @name apply
   * @method
   * @memberof Frampton.Utils
   * @param {Function} fn      The function to wrap.
   * @param {Object}   thisArg Context in which to apply function.
   */
  "use strict";

  module.exports = apply;

  function apply(fn, thisArg) {
    return fn.call(thisArg || null);
  }
});
define('frampton-utils/assert', ['exports', 'module'], function (exports, module) {
  /**
   * Occassionally we need to blow things up if something isn't right.
   * @name assert
   * @method
   * @memberof Frampton.Utils
   * @param {String} msg  - Message to throw with error.
   * @param {*}    cond - A condition that evaluates to a Boolean. If false, an error is thrown.
   */
  'use strict';

  module.exports = assert;

  function assert(msg, cond) {
    if (!cond) {
      throw new Error(msg || 'An error occured'); // Boom!
    }
  }
});
define('frampton-utils/compose', ['exports', 'module', 'frampton-utils/assert', 'frampton-list/copy', 'frampton-list/foldr', 'frampton-list/head'], function (exports, module, _framptonUtilsAssert, _framptonListCopy, _framptonListFoldr, _framptonListHead) {
  'use strict';

  /**
   * Compose takes any number of functions and returns a function that when
   * executed will call the passed functions in order, passing the return of
   * each function to the next function in the execution order.
   *
   * @name compose
   * @memberof Frampton.Utils
   * @method
   * @param {function} functions - Any number of function used to build the composition.
   * @returns {function} A new function that runs each of the given functions in succession
   */
  module.exports = compose;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _assert = _interopRequire(_framptonUtilsAssert);

  var _copy = _interopRequire(_framptonListCopy);

  var _foldr = _interopRequire(_framptonListFoldr);

  var _head = _interopRequire(_framptonListHead);

  function compose() {
    var fns = (0, _copy)(arguments);
    (0, _assert)('Compose did not receive any arguments. You can\'t compose nothing. Stoopid.', fns.length > 0);
    return function composition() {
      return (0, _head)((0, _foldr)(function (args, fn) {
        return [fn.apply(this, args)];
      }, (0, _copy)(arguments), fns));
    };
  }
});
/* functions */
define('frampton-utils/curry', ['exports', 'module', 'frampton-utils/curry_n'], function (exports, module, _framptonUtilsCurry_n) {
  'use strict';

  /**
   * Takes a function and returns a new function that will wait to execute the original
   * function until it has received all of its arguments. Each time the function is called
   * without receiving all of its arguments it will return a new function waiting for the
   * remaining arguments.
   *
   * @name curry
   * @memberof Frampton.Utils
   * @method
   * @param {Function} curry - Function to curry.
   * @returns {Function} A curried version of the function passed in.
   */
  module.exports = curry;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curryN = _interopRequire(_framptonUtilsCurry_n);

  function curry(fn) {
    return (0, _curryN)(fn.length, fn);
  }
});
define('frampton-utils/curry_n', ['exports', 'module', 'frampton-utils/assert', 'frampton-utils/is_function'], function (exports, module, _framptonUtilsAssert, _framptonUtilsIs_function) {
  'use strict';

  /**
   * Takes a function and returns a new function that will wait to execute the original
   * function until it has received all of its arguments. Each time the function is called
   * without receiving all of its arguments it will return a new function waiting for the
   * remaining arguments.
   *
   * @name curryN
   * @memberof Frampton.Utils
   * @method
   * @param {Number}   arity Number of arguments for function
   * @param {Function} curry Function to curry.
   * @returns {Function} A curried version of the function passed in.
   */
  module.exports = curry_n;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _assert = _interopRequire(_framptonUtilsAssert);

  var _isFunction = _interopRequire(_framptonUtilsIs_function);

  function curry_n(arity, fn) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    (0, _assert)('Argument passed to curry is not a function', (0, _isFunction)(fn));

    function curried() {
      for (var _len2 = arguments.length, args2 = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args2[_key2] = arguments[_key2];
      }

      // an array of arguments for this instance of the curried function
      var locals = args.concat(args2);

      if (locals.length >= arity) {
        return fn.apply(null, locals);
      } else {
        return curry_n.apply(null, [arity, fn].concat(locals));
      }
    }

    return args.length >= arity ? curried() : curried;
  }
});
define('frampton-utils/equal', ['exports', 'module', 'frampton-utils/is_object', 'frampton-utils/is_array'], function (exports, module, _framptonUtilsIs_object, _framptonUtilsIs_array) {
  'use strict';

  /**
   * equal :: Object -> Object -> Boolean
   *
   * @name equal
   * @memberof Frampton.Utils
   * @method
   * @param {*} obj1
   * @param {*} obj2
   * @returns {Boolean}
   */
  module.exports = deep_equal;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isObject = _interopRequire(_framptonUtilsIs_object);

  var _isArray = _interopRequire(_framptonUtilsIs_array);

  function deep_equal(obj1, obj2) {

    var depth = 0;
    var original1 = obj1;
    var original2 = obj2;

    function _equal(obj1, obj2) {

      depth++;

      if (
      // If we're dealing with a circular reference, return reference equality.
      !(depth > 1 && original1 === obj1 && original2 === obj2) && ((0, _isObject)(obj1) || (0, _isArray)(obj1)) && ((0, _isObject)(obj2) || (0, _isArray)(obj2))) {

        var key = null;

        for (key in obj1) {
          if (!obj2 || !_equal(obj1[key], obj2[key])) {
            return false;
          }
        }

        return true;
      } else {
        return obj1 === obj2;
      }
    }

    return _equal(obj1, obj2);
  }
});
define('frampton-utils/extend', ['exports', 'module', 'frampton-list/foldl'], function (exports, module, _framptonListFoldl) {
  'use strict';

  /**
   * Extends one object with one or more other objects
   *
   * @name extend
   * @memberof Frampton.Utils
   * @method
   * @param {Object} base
   * @param {Object} args
   * @returns {Object}
   */
  module.exports = extend;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _foldl = _interopRequire(_framptonListFoldl);

  function extend(base) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return (0, _foldl)(function (acc, next) {
      var key;
      for (key in next) {
        acc[key] = next[key];
      }
      return acc;
    }, base, args);
  }
});
define('frampton-utils/get', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  /**
   * get :: String -> Object -> Any
   *
   * @name get
   * @method
   * @memberof Frampton.Utils
   * @param {String} prop
   * @param {Object} obj
   * @returns {*}
   */
  module.exports = (0, _curry)(function get(prop, obj) {
    return obj[prop] || null;
  });
});
define("frampton-utils/guid", ["exports", "module"], function (exports, module) {
  "use strict";

  module.exports = guid;
  var id = 0;

  function guid() {
    return id++;
  }
});
define('frampton-utils/has_length', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  /**
   * hasLength :: Int -> [a] -> Boolean
   *
   * @name hasLength
   * @method
   * @memberof Frampton.Utils
   * @param {Number} len
   * @param {Object} obj
   * @returns {Boolean}
   */
  module.exports = (0, _curry)(function has_length(len, obj) {
    return obj && obj.length && obj.length >= len ? true : false;
  });
});
define("frampton-utils/identity", ["exports", "module"], function (exports, module) {
  "use strict";

  module.exports = identity;

  function identity(x) {
    return x;
  }
});
define("frampton-utils/immediate", ["exports", "module"], function (exports, module) {
  /**
   * immediate :: Function -> ()
   * @name immediate
   * @method
   * @memberof Frampton.Utils
   * @param {Function} fn
   * @param {Object}   [context]
   */
  "use strict";

  module.exports = immediate;

  function immediate(fn, context) {
    setTimeout(fn.bind(context || null), 0);
  }
});
define("frampton-utils/inherits", ["exports", "module"], function (exports, module) {
  /**
   * Similar to class extension in other languages. The child recieves all the
   * static and prototype methods/properties of the parent object.
   */
  "use strict";

  module.exports = inherits;

  function inherits(child, parent) {

    for (var key in parent) {
      if (parent.hasOwnProperty(key)) {
        child[key] = parent[key];
      }
    }

    function Class() {
      this.constructor = child;
    }

    Class.prototype = parent.prototype;
    child.prototype = new Class();
    child.__super__ = parent.prototype;

    return child;
  }
});
define("frampton-utils/is_array", ["exports", "module"], function (exports, module) {
  /**
   * Returns a boolean telling us if a given object is an array
   *
   * @name isArray
   * @method
   * @memberof Frampton.Utils
   * @param {Object} arr
   * @returns {Boolean}
   */
  "use strict";

  module.exports = is_array;

  function is_array(arr) {
    return Array.isArray ? Array.isArray(arr) : Object.prototype.toString.call(arr) === "[object Array]";
  }
});
define('frampton-utils/is_boolean', ['exports', 'module'], function (exports, module) {
  /**
   * Returns a boolean telling us if a given value is a boolean
   *
   * @name isBoolean
   * @method
   * @memberof Frampton.Utils
   * @param {*} obj
   * @returns {Boolean}
   */
  'use strict';

  module.exports = is_boolean;

  function is_boolean(obj) {
    return typeof obj === 'boolean';
  }
});
define('frampton-utils/is_defined', ['exports', 'module', 'frampton-utils/is_undefined'], function (exports, module, _framptonUtilsIs_undefined) {
  'use strict';

  /**
   * Returns a boolean telling us if a given value is defined
   *
   * @name isDefined
   * @method
   * @memberof Frampton.Utils
   * @param {*} obj
   * @returns {Boolean}
   */
  module.exports = is_defined;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isUndefined = _interopRequire(_framptonUtilsIs_undefined);

  function is_defined(obj) {
    return !(0, _isUndefined)(obj);
  }
});
define('frampton-utils/is_empty', ['exports', 'module', 'frampton-utils/is_nothing'], function (exports, module, _framptonUtilsIs_nothing) {
  'use strict';

  /**
   * Returns a boolean telling us if a given value doesn't exist or has length 0
   *
   * @name isEmpty
   * @method
   * @memberof Frampton.Utils
   * @param {*} obj
   * @returns {Boolean}
   */
  module.exports = is_empty;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isNothing = _interopRequire(_framptonUtilsIs_nothing);

  function is_empty(obj) {
    return (0, _isNothing)(obj) || !obj.length || 0 === obj.length;
  }
});
define('frampton-utils/is_equal', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  /**
   * (===) equality between two values
   *
   * @name isEqual
   * @method
   * @memberof Frampton.Utils
   * @param {*} a
   * @param {*} b
   * @returns {Boolean}
   */
  module.exports = (0, _curry)(function is_equal(a, b) {
    return a === b;
  });
});
define('frampton-utils/is_function', ['exports', 'module'], function (exports, module) {
  /**
   * Returns true/false is the object a fucntion
   *
   * @name isFunction
   * @method
   * @memberof Frampton.Utils
   * @param {*} fn
   * @returns {Boolean}
   */
  'use strict';

  module.exports = is_function;

  function is_function(fn) {
    return typeof fn === 'function';
  }
});
define('frampton-utils/is_nothing', ['exports', 'module', 'frampton-utils/is_undefined', 'frampton-utils/is_null'], function (exports, module, _framptonUtilsIs_undefined, _framptonUtilsIs_null) {
  'use strict';

  /**
   * Returns true/false is the object null or undefined
   *
   * @name isNothing
   * @method
   * @memberof Frampton.Utils
   * @param {*} obj
   * @returns {Boolean}
   */
  module.exports = is_nothing;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isUndefined = _interopRequire(_framptonUtilsIs_undefined);

  var _isNull = _interopRequire(_framptonUtilsIs_null);

  function is_nothing(obj) {
    return (0, _isUndefined)(obj) || (0, _isNull)(obj);
  }
});
define("frampton-utils/is_null", ["exports", "module"], function (exports, module) {
  /**
   * Returns true/false is the object null
   *
   * @name isNull
   * @method
   * @memberof Frampton.Utils
   * @param {*} obj
   * @returns {Boolean}
   */
  "use strict";

  module.exports = is_null;

  function is_null(obj) {
    return obj === null;
  }
});
define('frampton-utils/is_number', ['exports', 'module'], function (exports, module) {
  /**
   * Returns true/false is the object a number
   *
   * @name isNumber
   * @method
   * @memberof Frampton.Utils
   * @param {*} obj
   * @returns {Boolean}
   */
  'use strict';

  module.exports = is_number;

  function is_number(obj) {
    return typeof obj === 'number';
  }
});
define('frampton-utils/is_object', ['exports', 'module', 'frampton-utils/is_something', 'frampton-utils/is_array'], function (exports, module, _framptonUtilsIs_something, _framptonUtilsIs_array) {
  'use strict';

  /**
   * Returns true/false is the object a regular Object
   *
   * @name isObject
   * @method
   * @memberof Frampton.Utils
   * @param {*} obj
   * @returns {Boolean}
   */
  module.exports = isObject;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isSomething = _interopRequire(_framptonUtilsIs_something);

  var _isArray = _interopRequire(_framptonUtilsIs_array);

  function isObject(obj) {
    return (0, _isSomething)(obj) && !(0, _isArray)(obj) && typeof obj === 'object';
  }
});
define('frampton-utils/is_promise', ['exports', 'module', 'frampton-utils/is_object', 'frampton-utils/is_function'], function (exports, module, _framptonUtilsIs_object, _framptonUtilsIs_function) {
  'use strict';

  /**
   * Returns true/false indicating if object appears to be a Promise
   *
   * @name isPromise
   * @method
   * @memberof Frampton.Utils
   * @param {*} obj
   * @returns {Boolean}
   */
  module.exports = is_promise;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isObject = _interopRequire(_framptonUtilsIs_object);

  var _isFunction = _interopRequire(_framptonUtilsIs_function);

  function is_promise(obj) {
    return (0, _isObject)(obj) && (0, _isFunction)(obj.then);
  }
});
define('frampton-utils/is_something', ['exports', 'module', 'frampton-utils/is_nothing'], function (exports, module, _framptonUtilsIs_nothing) {
  'use strict';

  /**
   * Returns true/false indicating if object is not null or undefined
   *
   * @name isSomething
   * @method
   * @memberof Frampton.Utils
   * @param {*} obj
   * @returns {Boolean}
   */
  module.exports = is_something;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isNothing = _interopRequire(_framptonUtilsIs_nothing);

  function is_something(obj) {
    return !(0, _isNothing)(obj);
  }
});
define('frampton-utils/is_string', ['exports', 'module'], function (exports, module) {
  /**
   * Returns true/false indicating if object is a String
   *
   * @name isString
   * @method
   * @memberof Frampton.Utils
   * @param {*} obj
   * @returns {Boolean}
   */
  'use strict';

  module.exports = is_string;

  function is_string(obj) {
    return typeof obj === 'string';
  }
});
define('frampton-utils/is_undefined', ['exports', 'module'], function (exports, module) {
  /**
   * Returns true/false indicating if object is undefined
   *
   * @name isUndefined
   * @method
   * @memberof Frampton.Utils
   * @param {*} obj
   * @returns {Boolean}
   */
  'use strict';

  module.exports = is_undefined;

  function is_undefined(obj) {
    return typeof obj === 'undefined';
  }
});
define("frampton-utils/lazy", ["exports", "module"], function (exports, module) {
  /**
   * Takes a function and warps it to be called at a later time.
   * @name lazy
   * @memberof Frampton
   * @method
   * @method
   * @static
   * @param {Function} fn The function to wrap.
   * @param {...Any} args Arguments to pass to the function when called.
   */
  "use strict";

  module.exports = lazy;

  function lazy(fn) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return function () {
      fn.apply(null, args);
    };
  }
});
define('frampton-utils/log', ['exports', 'module', 'frampton/namespace'], function (exports, module, _framptonNamespace) {
  'use strict';

  module.exports = log;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Frampton = _interopRequire(_framptonNamespace);

  function log(msg, data) {

    if (typeof console.log !== 'undefined' && _Frampton.isDev()) {
      if (data) {
        console.log(msg, data);
      } else {
        console.log(msg);
      }
    }

    return msg;
  }
});
define('frampton-utils/memoize', ['exports', 'module', 'frampton-utils/is_string', 'frampton-utils/is_number'], function (exports, module, _framptonUtilsIs_string, _framptonUtilsIs_number) {
  'use strict';

  /**
   * @name memoize
   * @method
   * @memberof Frampton.Utils
   * @param {Function} fn
   * @param {Object}   [context]
   * @returns {Function}
   */
  module.exports = memoize;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isString = _interopRequire(_framptonUtilsIs_string);

  var _isNumber = _interopRequire(_framptonUtilsIs_number);

  function memoize(fn, context) {

    var store = {};
    var len = fn.length;

    return function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var key = len === 1 && ((0, _isString)(args[0]) || (0, _isNumber)(args[0])) ? args[0] : JSON.stringify(args);

      if (key in store) {
        return store[key];
      } else {
        return store[key] = fn.apply(context || null, args);
      }
    };
  }
});
define("frampton-utils/noop", ["exports", "module"], function (exports, module) {
  /**
   * @name noop
   * @method
   * @memberof Frampton.Utils
   */
  "use strict";

  module.exports = noop;

  function noop() {}
});
define("frampton-utils/not", ["exports", "module"], function (exports, module) {
  /**
   * not :: Function -> a -> Boolean
   * @name not
   * @method
   * @memberof Frampton.Utils
   * @param {Function} fn
   * @returns {Boolean}
   */
  "use strict";

  module.exports = not;

  function not(fn) {
    return function (arg) {
      return !fn(arg);
    };
  }
});
define('frampton-utils/not_implemented', ['exports', 'module'], function (exports, module) {
  'use strict';

  module.exports = function () {
    throw new Error('This method has not been implemented');
  };
});
define("frampton-utils/of_value", ["exports", "module"], function (exports, module) {
  /**
   * @name ofValue
   * @method
   * @memberof Frampton.Utils
   * @param {*} value
   * @returns {Function}
   */
  "use strict";

  module.exports = of_value;

  function of_value(value) {
    return function () {
      return value;
    };
  }
});
define('frampton-window', ['exports', 'frampton/namespace', 'frampton-window/window'], function (exports, _framptonNamespace, _framptonWindowWindow) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Frampton = _interopRequire(_framptonNamespace);

  var _Window = _interopRequire(_framptonWindowWindow);

  _Frampton.Window = _Window;
});
define('frampton-window/window', ['exports', 'module', 'frampton-signals/empty', 'frampton-signals/stepper', 'frampton-events/listen', 'frampton-utils/get', 'frampton-utils/is_something'], function (exports, module, _framptonSignalsEmpty, _framptonSignalsStepper, _framptonEventsListen, _framptonUtilsGet, _framptonUtilsIs_something) {
  'use strict';

  /**
   * @name Window
   * @method
   * @memberof Frampton
   * @param {Object} [element] DomNode to act as applicaton window
   * @returns {Object}
   */
  module.exports = Window;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _empty = _interopRequire(_framptonSignalsEmpty);

  var _stepper = _interopRequire(_framptonSignalsStepper);

  var _get = _interopRequire(_framptonUtilsGet);

  var _isSomething = _interopRequire(_framptonUtilsIs_something);

  var element = null;
  var resize = (0, _framptonEventsListen.listen)('resize', window);
  var dimensionsStream = (0, _empty)();
  var dimensions = (0, _stepper)([getWidth(), getHeight()], dimensionsStream);
  var width = (0, _stepper)(getWidth(), dimensionsStream.map((0, _get)(0)));
  var height = (0, _stepper)(getHeight(), dimensionsStream.map((0, _get)(1)));

  function getWidth() {
    return (0, _isSomething)(element) ? element.clientWidth : window.innerWidth;
  }

  function getHeight() {
    return (0, _isSomething)(element) ? element.clientHeight : window.innerHeight;
  }

  function updateIfNeeded() {
    var w = getWidth();
    var h = getHeight();
    if (w !== dimensions[0] || h !== dimensions[1]) {
      dimensionsStream.pushNext([w, h]);
    }
  }

  function update() {
    updateIfNeeded();
    setTimeout(updateIfNeeded, 0);
  }

  resize.next(update);
  function Window(element) {
    element = element;
    return {
      dimensions: dimensions,
      width: width,
      height: height,
      resize: resize
    };
  }
});
define('frampton', ['exports', 'module', 'frampton/namespace', 'frampton-utils', 'frampton-list', 'frampton-object', 'frampton-string', 'frampton-math', 'frampton-events', 'frampton-signals', 'frampton-mouse', 'frampton-keyboard', 'frampton-window', 'frampton-html', 'frampton-style'], function (exports, module, _framptonNamespace, _framptonUtils, _framptonList, _framptonObject, _framptonString, _framptonMath, _framptonEvents, _framptonSignals, _framptonMouse, _framptonKeyboard, _framptonWindow, _framptonHtml, _framptonStyle) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Frampton = _interopRequire(_framptonNamespace);

  module.exports = _Frampton;
});
define('frampton/namespace', ['exports', 'module'], function (exports, module) {
  /*globals Frampton:true */

  /**
   * The parent namespace for everything else in Frampton
   *
   * @name Frampton
   * @namespace
   */
  'use strict';

  Frampton.VERSION = '0.0.12';

  Frampton.TEST = 'test';

  Frampton.DEV = 'dev';

  Frampton.PROD = 'prod';

  if (typeof Frampton.ENV === 'undefined') {
    Frampton.ENV = {
      MODE: Frampton.PROD
    };
  }

  Frampton.isDev = function () {
    return Frampton.ENV.MODE === Frampton.DEV;
  };

  Frampton.isTest = function () {
    return Frampton.ENV.MODE === Frampton.TEST;
  };

  Frampton.isProd = function () {
    return Frampton.ENV.MODE === Frampton.PROD;
  };

  module.exports = Frampton;
});
require("frampton");

}());