import { extend, isNothing } from 'frampton-utils';

var defaults = {
  LIMIT   : 1000,
  TIMEOUT : (5 * 60 * 1000) // 5 minutes
};

function currentTime() {
  return (new Date()).getTime();
}

function isExpired(entry, timeout) {
  return (currentTime() - entry.timestamp > timeout);
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
 * @class
 * @param {Object} options - A hash of options to configure the cache. Currently only supports
 * LIMIT (the max number of items in cache) and TIMEOUT (how long an entry should be valid).
 */
function Cache(options) {

  this.store  = {};
  this.config = {};
  this.size   = 0;
  this.head   = null;
  this.tail   = null;

  extend(this.config, defaults, options);
}

/**
 * @name get
 * @memberOf Cache
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
      return null;
    }

    // otherwise, yeah b@$%#!, let's return the value and get moving.
    makeHead(this.store[key], this.head, this.tail);
    updateCounter(this.store[key]);
    return this.store[key].value;
  }

  return null;
};

/**
 * @name put
 * @memberOf Cache
 * @method
 * @instance
 */
Cache.prototype.put = function Cache_put(key, value) {

  if (isNothing(key) || isNothing(value)) return;

  if (!this.store[key]) {

    this.size = this.size + 1;
    this.store[key] = {
      key       : key,
      value     : value,
      next      : null,
      prev      : null,
      timestamp : currentTime(),
      counter   : 1
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
 * @name remove
 * @memberOf Cache
 * @method
 * @instance
 */
Cache.prototype.remove = function Cache_remove(key) {

  var entryToRemove;

  if (isNothing(this.store[key])) return;

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
 * @memberOf Cache
 * @static
 * @param {Object} obj Object to test.
 * @return {Boolean} Is the object an instance of Cache?
 */
Cache.isCache = function Cache_isCache(obj) {
  return (obj instanceof Cache);
};

export default Cache;