/**
 * Occassionally we need to blow things up if something isn't right.
 * @name assert
 * @memberOf Frampton.Utils
 * @static
 * @param {String} msg  - Message to throw with error.
 * @param {Any}    cond - A condition that evaluates to a Boolean. If false, an error is thrown.
 */
export default function assert(msg, cond) {
  if (!cond) {
    throw new Error(msg || 'An error occured'); // Boom!
  }
}