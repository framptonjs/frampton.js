import curry from 'frampton-utils/curry';
import matches from 'frampton-style/matches';

export default curry(function closest(selector, element) {

  while (element) {
    if (matches(selector, element)) {
      break;
    }
    element = element.parentElement;
  }

  return (element || null);
});