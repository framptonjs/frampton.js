import curry from 'frampton-utils/curry';

/**
 * @name removeClass
 * @method
 * @memberof Frampton.Style
 * @param {Object} element
 * @param {String} name
 */
export default curry(function remove_class(element, name) {
  element.classList.remove(name);
});