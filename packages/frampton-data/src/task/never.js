import createTask from 'frampton-data/task/create';

/**
 * never :: Task x a
 *
 * Creates a Task that never resolves.
 *
 * @name never
 * @method
 * @memberof Frampton.Data.Task
 * @returns {Frampton.Data.Task}
 */
export default function never() {
  return createTask(() => {});
}
