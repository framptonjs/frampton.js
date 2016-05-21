import { createSignal } from 'frampton-signal/create';

/**
 * Method to combine multiple Signals into one with a given mapping function. Values
 * of the Signals are passed to the mapping function in the same order they appear
 * in the array.
 *
 * @name combine
 * @method
 * @memberof Frampton.Signal
 * @param {Function} mapping - Function used to combine given Signals
 * @param {Frampton.Signal[]} parents - Array of Signals to combine
 * @returns {Frampton.Signal} A new Signal
 */
export default function combine(mapping, parents) {
  return createSignal((self) => {
    self(mapping.apply(null, parents.map((parent) => parent._value)));
  }, parents);
}
