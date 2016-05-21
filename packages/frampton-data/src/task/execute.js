import log from 'frampton-utils/log';
import warn from 'frampton-utils/warn';

/**
 * execute :: Signal Task x a -> Signal a -> ()
 *
 * Takes a Signal of Tasks to execute and a function to call with the resolve values
 * of those Tasks. Progress and reject values are ignored (logged to the console in dev mode).
 * It is suggested to use Tasks that have their reject and progress values mapped to reslove
 * values using the recover and progress methods on the Task prototype.
 *
 * @name execute
 * @memberof Frampton.Task
 * @static
 * @param {Frampton.Signals.Signal} tasks - Signal of Tasks to execute
 * @param {Function} value - A function to pass the resolve values to
 */
export default function execute(tasks, value) {
  tasks.value((task) => {
    task.run({
      reject : (err) => {
        warn('Error running task: ', err);
      },
      resolve : (val) => {
        value(val);
      },
      progress : (val) => {
        log('Task progress: ', val);
      }
    });
  });
}
