import createTask from 'frampton-data/task/create';

/**
 * fail :: x -> Task x a
 *
 * Creates a Task that always fails with the given value.
 *
 * @name fail
 * @method
 * @memberof Frampton.Data.Task
 * @param {*} err - Value used as the return value of the reject branch.
 * @returns {Frampton.Data.Task}
 */
export default function fail(err) {
  return createTask((sinks) => sinks.reject(err));
}
