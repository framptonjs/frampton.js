import curry from 'frampton-utils/curry';

/**
 * Returns a Boolean indicated if the given DomNode has the given class.
 *
 * @name hasClass
 * @method
 * @memberof Frampton.Style
 * @param {Object} element DomNode to test
 * @param {String} name    Class to test for
 * @returns {Boolean}
 */
export default curry(function has_class(element, name) {
  return element.classList.contains(name);
});