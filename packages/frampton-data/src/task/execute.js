import warn from 'frampton-utils/warn';

/**
 * execute :: Signal Task x a -> Signal a -> Signal a -> ()
 *
 * When we get a task on the tasks signal, run it and push the value
 * onto the values signal. Tasks that are rejected in execute are
 * ignored. It is suggested to use task that handle their errors with
 * the recover method.
 *
 * @name execute
 * @memberof Frampton.Task
 * @static
 * @param {Frampton.Signals.Signal} tasks
 * @param {Frampton.Signal.Signal} values
 * @param {Frampton.Signal.Signal} progresses
 */
export default function execute(tasks, values, progresses) {
  tasks.value((task) => {
    task.run({
      reject : (err) => {
        warn('Error running task: ', err);
      },
      resolve : (val) => {
        values(val);
      },
      progress : (val) => {
        progresses(val);
      }
    });
  });
}