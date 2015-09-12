/**
 * Internally we require all state objects to have a name and path. This
 * checks a state object to ensure it meets those requirements.
 *
 * @name validState
 * @method
 * @private
 * @memberof Frampton.History
 * @param {Object} state
 * @returns {Boolean}
 */
export default function valid_state(state) {
  return !!(state.name && state.path);
}