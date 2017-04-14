/**
 * sequence :: [Task x a] -> Task x a
 *
 * Creates a Task that runs the given Tasks in the order they are passed in. The new
 * Task will resolve when all of its parent Tasks have resolved. The resolve value of
 * the new Task is the resolve value of the last of its parents Tasks. The resolve
 * values for all other Tasks are discarded.
 *
 * @name sequence
 * @method
 * @memberof Frampton.Data.Task
 * @param {Frampton.Data.Task[]} tasks - The Tasks to wait for
 * @returns {Frampton.Data.Task}
 */
export default function sequence(...tasks) {
  return tasks.reduce((acc, next) => {
    return acc.concat(next);
  });
}
