import constant from 'frampton-signals/constant';

var instance = null;

/**
 * A Behavior representing the current depth of application history
 *
 * @name depth
 * @method
 * @memberof Frampton.History
 * @returns {Frampton.Signals.Behavior}
 */
export default function depth() {
  if (!instance) {
    instance = constant(0);
  }
  return instance;
}