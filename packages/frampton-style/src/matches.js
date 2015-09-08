import curry from 'frampton-utils/curry';

/**
 * @name matches
 * @method
 * @memberof Frampton.Style
 * @param {String} selector
 * @param {Object} element
 * @returns {Boolean}
 */
export default curry(function matches(selector, element) {

  var elementList = (element.document || element.ownerDocument).querySelectorAll(selector);
  var i = 0;

  while (elementList[i] && elementList[i] !== element) {
    i++;
  }

  return (elementList[i] ? true : false);
});