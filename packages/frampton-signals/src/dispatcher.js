import noop from 'frampton-utils/noop';
import remove from 'frampton-list/remove';

/**
 * Dispatcher is a helper object that helps the a stream manage its Outlets. A
 * new instance of the Dispatcher is created for each new stream. The owning stream
 * inherits references to its dispatcher's subscribe, broadcast and clear methods.
 *
 * @name Dispatcher
 * @class
 * @private
 * @param  {EventStream} stream The EventStream that owns this instance of the dispatcher.
 * @returns {Dispatcher}   A new dispatcher.
 */
function Dispatcher(stream) {

  var subscribers = [],
      sink        = null;

  /**
   * Add Outlets to the owning stream.
   *
   * @name subscribe
   * @memberOf Dispatcher
   * @method
   * @instance
   * @param   {Function} fn - A callback for this stream
   * @returns {Function} A function to cancel the subscription.
   */
  this.subscribe = function Dispatcher_subscribe(fn) {

    subscribers.push(fn);

    if (subscribers.length === 1) {
      sink = stream.push.bind(stream);
      stream.cleanup = stream.seed(sink) || noop;
    }

    return function unsub() {
      subscribers = remove(fn, subscribers);
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
   * @memberOf Dispatcher
   * @method
   * @instance
   * @param {Any} data The data to push to subscribers.
   */
  this.push = function Dispatcher_push(event) {
    subscribers.forEach((fn) => {
      fn(event);
    });
  };

  /**
   * Used to burn it all down when this stream is destroyed.
   *
   * @name destroy
   * @memberOf Dispatcher
   * @method
   * @instance
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

var isDispatcher = function(obj) {
  return (obj instanceof Dispatcher);
};

export default Dispatcher;

export {
  isDispatcher
};