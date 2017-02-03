import { Task } from 'frampton-data/task/create';
import validSinks from 'frampton-data/task/valid_sinks';

/**
 * @name SyncTask
 * @class
 * @extends Frampton.Data.Task
 */
export class SyncTask extends Task {

  constructor(computation) {
    super(computation);
  }

  /**
   * Takes a hash of functions to call based on the resolution of the Task and runs the computation
   * contained within this Task.
   *
   * The sinks object should be of the form:
   * {
   *   reject : (err) => {},
   *   resolve : (val) => {},
   *   progress : (prog) => {}
   * }
   *
   * Each function is used by the contained computation to update us on the state of the running
   * computation.
   *
   * @name run
   * @method
   * @memberof Frampton.Data.SyncTask#
   * @param {Object} sinks
   * @param {Function} sinks.reject - The function to call on failure.
   * @param {Function} sinks.resolve - The function to call on success.
   * @param {Function} sinks.progress - The function to call on progress.
   */
  run(sinks) {
    try {
      this.fn(validSinks(sinks));
    } catch(e) {
      sinks.reject(e);
    }
  }
}

export default function create_sync(computation) {
  return new SyncTask(computation);
}