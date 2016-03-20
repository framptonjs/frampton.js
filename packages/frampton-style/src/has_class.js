import curry from 'frampton-utils/curry';

/**
 * Returns a Boolean indicated if the given DomNode has the given class.
 *
 * @name hasClass
 * @method
 * @memberof Frampton.Style
 * @param {String} name    Class to test for
 * @param {Object} element DomNode to test
 * @returns {Boolean}
 */
export default curry(function has_class(name, element) {
  return element.classList.contains(name);
});