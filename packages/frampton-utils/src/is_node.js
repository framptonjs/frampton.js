import isSomething from 'frampton-utils/is_something';
import isObject from 'frampton-utils/is_object';
import isDefined from 'frampton-utils/is_defined';

/**
 * Returns true/false is the object a DomNode
 *
 * @name isNode
 * @method
 * @memberof Frampton.Utils
 * @param {*} obj
 * @returns {Boolean}
 */
export default function is_node(obj) {
  return (isSomething(obj) && isObject(obj) && isDefined(obj.nodeType) && isDefined(obj.nodeName));
}