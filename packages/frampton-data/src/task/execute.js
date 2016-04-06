import warn from 'frampton-utils/warn';

/**
 * execute :: Signal a -> Signal Task x a -> ()
 *
 * When we get a task on the tasks signal, run it and push the value
 * onto the values signal.
 *
 * @name execute
 * @memberof Frampton.Task
 * @static
 * @param {Frampton.Signal.Signal} values
 * @param {Frampton.Signals.Signal} tasks
 */
export default function execute(values, tasks) {
  tasks.value((task) => {
    task.run((err) => {
      warn('Error running task: ', err);
    }, (val) => {
      values(val);
    });
  });
}