import curry from 'frampton-utils/curry';

/**
 * @name addClass
 * @memberOf Frampton.Style
 * @instance
 * @param {Object} element
 * @param {String} name
 */
export default curry(function add_class(element, name) {
  element.classList.add(name);
});