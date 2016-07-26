/**
 * @name forward
 * @memberof Frampton.Signal
 * @param {Frampton.Signal#} sig
 * @param {Function} mapping
 * @returns {Frampton.Signal#}
 */
export default function forward(sig, mapping) {
  return function(val) {
    sig.push(mapping(val));
  };
}
