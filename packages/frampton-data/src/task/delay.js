import createTask from 'frampton-data/task/create';

/**
 * @name delay
 * @method
 * @memberof Frampton.Data.Task
 * @param {Function} fn - Function to delay
 * @param {Number} time - Miliseconds to delay function
 * @returns {Frampton.Data.Task}
 */
export default function delay(fn, time) {
  return createTask((sinks) => {
    setTimeout(() => {
      sinks.resolve(fn());
    }, time);
  });
}
