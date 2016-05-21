import create from 'frampton-data/task/create';

/**
 * when :: [Task x a] -> Task x [a]
 *
 * Creates a Task that waits for each of the given Tasks to resolve before it resolves.
 * When it does resolve, it resolves with an Array containing the resolved values of each
 * of its parent Tasks. The Array contains the resolve values in the same order as the
 * order that the parent Tasks were passed in.
 *
 * @name when
 * @method
 * @memberof Frampton.Data.Task
 * @param {Frampton.Data.Task[]} tasks - The Tasks to wait for
 * @returns {Frampton.Data.Task}
 */
export default function when(...tasks) {

  return create((sinks) => {

    const valueArray = new Array(tasks.length);
    const len = tasks.length;
    var idx = 0;
    var count = 0;

    function logError(err) {}
    function logProgress(val) {}

    tasks.forEach((task) => {
      const index = idx++;
      task.run({
        reject : logError,
        resolve : (val) => {
          count = count + 1;
          valueArray[index] = val;
          if (count === len) {
            sinks.resolve(valueArray);
          }
        },
        progress : logProgress
      });
    });
  });
}
