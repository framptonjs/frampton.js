import curry from 'frampton-utils/curry';
import matches from 'frampton-style/matches';

export default curry(function contains(selector, element) {
  return (matches(selector, element) || element.querySelectorAll(selector).length > 0);
});