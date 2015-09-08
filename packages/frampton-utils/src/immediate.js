/**
 * immediate :: Function -> ()
 * @name immediate
 * @method
 * @memberof Frampton.Utils
 * @param {Function} fn
 * @param {Object}   [context]
 */
export default function immediate(fn, context) {
  setTimeout(fn.bind(context || null), 0);
}