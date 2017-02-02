import createTask from 'frampton-data/task/create';
import curryN from 'frampton-utils/curry_n';

/**
 * @name delay
 * @method
 * @memberof Frampton.Data.Task
 * @param {Function} fn - Function to delay
 * @param {Number} time - Miliseconds to delay function
 * @returns {Frampton.Data.Task}
 */
export default curryN(2, function delay(time, val) {
  return createTask((sinks) => {
    setTimeout(() => {
      sinks.resolve(val);
    }, time);
  });
});
